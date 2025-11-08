#include <Wire.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

#define BUFFER_SIZE 100


const int MPU = 0x68;
int16_t AcX, AcY, AcZ, GyX, GyY, GyZ;
MAX30105 particleSensor;



const char* ssid = "gold";
const char* password = "wathafenvelA";
const char* http_server = "http://192.168.18.22:8000/data";




uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];
int bufferIndex = 0;


unsigned long lastComputeTime = 0;
unsigned long lastSendTime = 0;
unsigned long lastSampleTime = 0;
const int sampleInterval = 40;   // ~25Hz sampling for smooth waveform
const int computeInterval = 5000;
const int sendInterval = 5000;   // Compute HR & SpO₂ every 5 seconds

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
 Serial.println("Place your finger on the sensor...");

  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  
   Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
     Serial.print(".");
  }
   Serial.println("\nConnected to WiFi!");
   Serial.print("ESP32 IP Address: ");
   Serial.println(WiFi.localIP());
  
  
  
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  delay(1000);
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


  if (currentTime - lastSampleTime >= sampleInterval) {
    lastSampleTime = currentTime;

    if (particleSensor.check()) {
       irValue = particleSensor.getIR();
       redValue = particleSensor.getRed();

      irBuffer[bufferIndex] = irValue;
      redBuffer[bufferIndex] = redValue;
      bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
      
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

  
  if (WiFi.status() == WL_CONNECTED && currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime;
    HTTPClient http;
    http.begin(http_server);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String timestamp = String(millis());
    String httpRequestData = "ax=" + String(AcX) +
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
}

