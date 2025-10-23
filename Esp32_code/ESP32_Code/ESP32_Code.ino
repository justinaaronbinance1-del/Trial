#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;
const int MPU_INT_PIN = 15;

volatile bool mpuInterrupt = false;

void IRAM_ATTR dmpDataReady(){
  mpuInterrupt = true;
}

const char* ssid = "De_Villa_Fam";      
const char* password = "5WzSakYV";         

const char* serverName = "http://192.168.1.102:8000/data"; 

void setup() {
  Serial.begin(115200);
  delay(500);

  Wire.begin(21,22);

  Wire.beginTransmission(0x68);
  Wire.write(0x68);
  Wire.write(0x00);
  Wire.endTransmission(true);
  

  WiFi.mode(WIFI_STA);           
  WiFi.begin(ssid, password);  

  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("✅ Connected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  pinMode(MPU_INT_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(MPU_INT_PIN), dmpDataReady, RISING);

  if (!mpu.begin()){
    Serial.println("MPU not found");
    while(1);
  }
  Serial.println("MPU Ready");
}

void loop() {

  byte error, address;
  int nDevices = 0;

  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("✅ I2C device found at address 0x");
      Serial.println(address, HEX);
      nDevices++;
    }
  }

  if (nDevices == 0) {
    Serial.println("❌ No I2C devices found");
  }else{
    Serial.println("Scan complete.\n");
  }
  delay(2000);



  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded"); 

    sensors_event_t a, g, temp;

    if(mpuInterrupt){
      mpuInterrupt = false;
      
      mpu.getEvent(&a, &g, &temp);
    } else {
      
      mpu.getEvent(&a, &g, &temp);
    }


    Serial.print("accX: "); Serial.print(a.acceleration.x);
    Serial.print(", accY: "); Serial.print(a.acceleration.y);
    Serial.print(", accZ: "); Serial.print(a.acceleration.z);
    Serial.print(" | gX: "); Serial.print(g.gyro.x);
    Serial.print(", gY: "); Serial.print(g.gyro.y);
    Serial.print(", gZ: "); Serial.println(g.gyro.z);
    

    String httpRequestData = "accX = " + String(a.acceleration.x, 8) + 
                              "&accY=" + String(a.acceleration.y, 8)+ 
                              "&accZ = " + String(a.acceleration.z, 8) + 
                              "&gX = " + String(g.gyro.x, 8) + 
                              "&gY = "+ String(g.gyro.y, 8)+ 
                              "&gZ = " + String(g.gyro.z, 8);


    Serial.println("Sending POST data: " + httpRequestData);

    int httpResponseCode = http.POST(httpRequestData);

    if (httpResponseCode > 0) {
      Serial.print("✅ HTTP Response code: ");
      Serial.println(httpResponseCode);

      String payload = http.getString();
      Serial.println("Server Response:");
      Serial.println(payload);
    } else {
      Serial.print("❌ Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();  

  } else {
    Serial.println("❌ WiFi Disconnected");
  }

  delay(2000);  
}

