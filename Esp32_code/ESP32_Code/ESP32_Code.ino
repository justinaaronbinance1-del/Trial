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


const char* ssid = "De_Villa_Fam";
const char* password = "5WzSakYV"; 
const char* serverName = "http://192.168.1.103:8000/data"; 

uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];



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

  if(!particleSensor.begin(Wire, I2C_SPEED_STANDARD)){
    Serial.println("MAX30102 not found!");
    while(1);
  }
  Serial.println("MAX30102 detected succesfully");
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

  Serial.println();
  Serial.println("Connected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
}



void loop() {

  String timestamp = String(millis());

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

  Serial.printf("AcX=%d | AcY=%d | AcZ=%d | GyX=%d | GyY=%d | GyZ=%d\n", AcX, AcY, AcZ, GyX, GyY, GyZ);

  for (int i = 0; i< BUFFER_SIZE; i++){
    while(!particleSensor.check()){
      delay(1);
    }
    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    delay(40);
  }

int32_t spo2;
int8_t validspo2;
int32_t heartRate;
int8_t validheartRate;

maxim_heart_rate_and_oxygen_saturation(
    irBuffer, BUFFER_SIZE,
    redBuffer,
    &spo2, &validspo2,
    &heartRate, &validheartRate);
  
  // Display results
  Serial.print("Heart Rate: ");
  if (validheartRate)
    Serial.print(heartRate);
  else
    Serial.print("Invalid");
  
  Serial.print(" bpm | SpO2: ");
  if (validspo2)
    Serial.print(spo2);
  else
    Serial.print("Invalid");
  
  Serial.println(" %");


  if(WiFi.status() == WL_CONNECTED){
  HTTPClient http;

  http.begin(serverName);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  String httpRequestData = "ax=" + String(AcX) + 
                              "&ay=" + String(AcY)+ 
                              "&az=" + String(AcZ) + 
                              "&gx=" + String(GyX) + 
                              "&gy="+ String(GyY)+ 
                              "&gz=" + String(GyZ) +
                              "&timestamp=" + String(timestamp);


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

  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(1000);
}
