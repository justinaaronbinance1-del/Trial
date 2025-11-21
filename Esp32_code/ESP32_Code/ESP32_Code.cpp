#include <Wire.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include "time.h"
#include <ArduinoJson.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"
#include <ESPmDNS.h>

#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>


#define BUFFER_SIZE 100


//  MPU6050 and MAX30102
const int MPU = 0x68;
int16_t AcX, AcY, AcZ, GyX, GyY, GyZ;
MAX30105 particleSensor;

//  WiFi Credentials 
const char* ssid = "De_Villa_Fam";
const char* password = "5WzSakYV";
const char* http_server = "http://DESKTOP-85CI60K.local:8000/data";


// Time Server
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 8 * 3600;  // Philippines GMT+8
const int daylightOffset_sec = 0;   //no dst

//  WebSocket Server 
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");


// Buffers
uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];
int bufferIndex = 0;

// Timers
unsigned long lastComputeTime = 0;
unsigned long lastSendTime = 0;
unsigned long lastSampleTime = 0;
const int sampleInterval = 40;   // ~25Hz sampling for smooth waveform
const int computeInterval = 5000;
const int sendInterval = 5000;   // Compute HR & SpO₂ every 5 seconds

// Backend user info
int userId = -1;
String dynamicUsername = "";
unsigned long lastUserFetch = 0;
const unsigned long userFetchInterval = 3000;

// Sensor Initial Values
long irValue = 0;
long redValue = 0;
int32_t spo2 = 0;
int8_t validspo2 = 0;
int32_t heartRate = 0;
int8_t validheartRate = 0;



void setup() {
  Wire.begin(21, 22);
  Serial.begin(115200);
  delay(500);

  Serial.println("MPU6050 Test Started...");
  Wire.beginTransmission(MPU);
  
   if (Wire.endTransmission() != 0) {
    Serial.println("MPU6050 not detected!");
    while (1);
  } else {
    Serial.println("MPU6050 detected successfully!");
  }
  
 
   Serial.println("MAX30102 Test Started...");
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
     Serial.println("MAX30102 not found!");
    while (1);
  }
 
 
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x1F);
  particleSensor.setPulseAmplitudeIR(0x1F);
  particleSensor.setPulseAmplitudeGreen(0);

  particleSensor.setPulseWidth(411);  
  particleSensor.setSampleRate(100); 

 Serial.println("Place your finger on the sensor...");

  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);


  
   Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
     Serial.print(".");
  }
   Serial.println("\nConnected to WiFi!");
   Serial.print("ESP32 IP Address: " + WiFi.localIP().toString());

   // start mDNS for dynamic hostname
   if(!MDNS.begin("esp32")){
    Serial.println("Error starting mDNS");
   }else{
    Serial.println("mDNS started. address http://esp32.local");
   }
   
    ws.onEvent(onWsEvent);
    server.addHandler(&ws);
    server.begin();

   configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
   Serial.println("Waiting NTP time...");

   struct tm timeinfo;
   while (!getLocalTime(&timeinfo)){
      Serial.print(".");
      delay(500);
   }
  Serial.println("\nTime acquired!");
  
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  delay(1000);

  Serial.println("Registering device with backend...");
  while(userId < 0 ){
    if(fetchCurrentUser()){
      Serial.println("User Registration Successful!");
    }else{
      Serial.println("Retrying registration in 3 seconds...");
      delay(3000);
    }
  }
   Serial.println("UserID: " + String(userId) + ", Username: " + dynamicUsername);

  
}

void loop() {
  
  unsigned long currentTime = millis();


  Wire.beginTransmission(MPU);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true);

  AcX = Wire.read() << 8 | Wire.read();
  AcY = Wire.read() << 8 | Wire.read();
  AcZ = Wire.read() << 8 | Wire.read();
  GyX = Wire.read() << 8 | Wire.read();
  GyY = Wire.read() << 8 | Wire.read();
  GyZ = Wire.read() << 8 | Wire.read();

  if (millis() - lastUserFetch >= userFetchInterval){
    fetchCurrentUser();
    lastUserFetch = millis();
  }


  if (currentTime - lastSampleTime >= sampleInterval) {
    lastSampleTime = currentTime;

    if (particleSensor.check()) {
       irValue = particleSensor.getIR(); // For Heart rate
       redValue = particleSensor.getRed(); // For Oxygen level

      irBuffer[bufferIndex] = irValue;
      redBuffer[bufferIndex] = redValue;
      bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;

      sendWebsocketData(irValue, redValue);

      
      
    }
  }

  
  if (currentTime - lastComputeTime >= computeInterval) {
    lastComputeTime = currentTime;

    maxim_heart_rate_and_oxygen_saturation(
      irBuffer, BUFFER_SIZE,
      redBuffer,
      &spo2, &validspo2,
      &heartRate, &validheartRate
    );

 Serial.print("Heart Rate: ");
    if (validheartRate)
      Serial.print(heartRate);
    else
       Serial.print("Invalid");

     Serial.print(" bpm | SpO₂: ");
    if (validspo2)
       Serial.print(spo2);
    else
       Serial.print("Invalid");
     Serial.println(" %");

   
  }

  
  if (userId > 0 && WiFi.status() == WL_CONNECTED && currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime;
    HTTPClient http;
    http.begin(http_server);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String timestamp = getTimestamp();

    String httpRequestData = "user_id=" + String(userId) +
                            "&username=" + dynamicUsername +
                            "&ax=" + String(AcX) +
                             "&ay=" + String(AcY) +
                             "&az=" + String(AcZ) +
                             "&gx=" + String(GyX) +
                             "&gy=" + String(GyY) +
                             "&gz=" + String(GyZ) +
                             "&heartRate=" + String(heartRate) +
                             "&spo2=" + String(spo2) +
                             "&timestamp=" + timestamp;

    Serial.println("Sending POST data: " + httpRequestData);
    int httpResponseCode = http.POST(httpRequestData);


    if (httpResponseCode > 0) {
       Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
       Serial.println("Server Response:");
       Serial.println(payload);
    } else {
       Serial.print("Error code: ");
       Serial.println(httpResponseCode);
    }


    http.end();
  }
  ws.cleanupClients();
}


bool fetchCurrentUser(){
      if (WiFi.status() != WL_CONNECTED) return false;

        HTTPClient http;
        http.begin("http://DESKTOP-85CI60K.local:8000/current_user");

      int httpResponseCode = http.GET();
      
      if (httpResponseCode > 0){
        String payload = http.getString();
        Serial.println("Server Response: " + payload);

        StaticJsonDocument<300> doc;
        DeserializationError error = deserializeJson(doc, payload);

      if(error){
        Serial.print("JSON parsing failed:");
        Serial.println(error.c_str());
        http.end();
        return false;
      }


      userId = doc["user_id"];
      dynamicUsername = doc["username"].as<String>();

      Serial.println("Fetched User ID: " + String(userId));
      Serial.println("Fetched Username: " + dynamicUsername);

      
      http.end();
      return true;
      }else{
      Serial.print("HTTP error code: ");
      Serial.println(httpResponseCode);
      http.end();
      return false;
      }
    } 
    String getTimestamp(){
      struct tm timeinfo;
      if(!getLocalTime(&timeinfo)){
        return "";
      }
    char buf[25];
      strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", &timeinfo);
      return String(buf);
}

void sendWebsocketData(long irValue, long redValue){
  StaticJsonDocument<150> doc;
  doc["ir"] = irValue;
  doc["red"] = redValue;

  String json;
  serializeJson(doc, json);

  ws.textAll(json);
}
void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t * data, size_t len){
  if(type == WS_EVT_CONNECT){
        Serial.println("WebSocket client connected");
    } else if(type == WS_EVT_DISCONNECT){
        Serial.println("WebSocket client disconnected");
    }
}


