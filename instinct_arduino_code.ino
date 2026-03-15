#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <HTTPClient.h>
#include <WiFi.h>

// WiFi credentials
const char* ssid = "moto";
const char* password = "987654321";

// API server
const char* serverName = "http://YOUR_PC_IP:8000/telemetry";

TinyGPSPlus gps;

// GPS Serial
HardwareSerial gpsSerial(1);

// Tamper pin
const int tamperPin = 4;

void setup() {
  Serial.begin(115200);

  pinMode(tamperPin, INPUT_PULLUP);

  // GPS serial
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);

  // Connect WiFi
  WiFi.begin(ssid, password);

  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connected!");
}

void loop() {

  Serial.println("Reading GPS data...");

  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated()) {

    float lat = gps.location.lat();
    float lon = gps.location.lng();

    Serial.print("Latitude: ");
    Serial.println(lat);

    Serial.print("Longitude: ");
    Serial.println(lon);

    int battery = 85;

    bool tamper = digitalRead(tamperPin) == LOW;

    Serial.print("Tamper Status: ");
    Serial.println(tamper ? "TRUE" : "FALSE");

    String mode = "installed";

    sendData(lat, lon, battery, mode, tamper);

    delay(10000);
  }
}

void sendData(float lat, float lon, int battery, String mode, bool tamper) {

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"device_id\":\"meter001\",";
    json += "\"lat\":" + String(lat, 6) + ",";
    json += "\"lon\":" + String(lon, 6) + ",";
    json += "\"battery\":" + String(battery) + ",";
    json += "\"mode\":\"" + mode + "\",";
    json += "\"tamper\":" + String(tamper ? "true" : "false");
    json += "}";

    Serial.println("Sending JSON to server:");
    Serial.println(json);

    int httpResponseCode = http.POST(json);

    Serial.print("Server Response Code: ");
    Serial.println(httpResponseCode);

    http.end();
  }
}