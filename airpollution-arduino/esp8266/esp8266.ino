/**
 * Libraries
 */
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <TinyGPS.h>

/**
 * Pins
 */
#define PIN_GPS_RX 4
#define PIN_GPS_TX 5

/**
 * Configrations
 */
const String ID = "ELZ_1";
const String WIFI_SSID = "DUMAN";
const String WIFI_PASS = "d.u.m.a.n.55";
const String SERVER_HOST = "http://192.168.1.105:2323";

/**
 * Constants
 */
const uint16_t DELAY = 500;

/**
 * Initializing
 */
TinyGPS gps;
SoftwareSerial gpsSerial(PIN_GPS_RX, PIN_GPS_TX); // (RX, TX)

/**
 * Variables
 */
float lng, lat, altitude;
float ppm, co_ppm, co2_ppm, alkol_ppm, aseton_ppm;
float temperature, humidity, heat_index;
float pressure;
String json;

void setup()
{
  // Serial comminications
  Serial.begin(115200);
  gpsSerial.begin(9600);
  // Installing modules
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println();
  // Wifi connection
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
}

void loop()
{
  // Encoding
  encodeGps();
  // Serial comminication
  String json = encodeSerial();
  Serial.println(json);
  // Gps latitude ,longitude and altitude values
  gps.f_get_position(&lat, &lng);
  altitude = gps.f_altitude();
  // Wifi Connection status
  if (WiFi.status() == WL_CONNECTED)
  {
    // Wifi client and http classes
    WiFiClient client;
    HTTPClient http;
    // Http request
    http.begin(client, SERVER_HOST + "/api");
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(json);
    // Http response
    if (httpCode == HTTP_CODE_OK)
      Serial.println(http.getString());
    // Http end
    http.end();
  }
}

/**
 * Functions
 */

// Encoding gps data
void encodeGps()
{
  unsigned long start = millis();
  do
  {
    while (gpsSerial.available())
      gps.encode(gpsSerial.read());
  } while (millis() - start < DELAY);
}

// Encoding Serial comminication read data
String encodeSerial()
{
  String str;
  unsigned long start = millis();

  if (Serial.available())
    str += Serial.readStringUntil('\r');

  return "{ \"id\":\"" + ID + "\", \"lat\":" + String(lat, 6) + ", \"lng\":" + String(lng, 6) + ", \"altitude\":" + String(altitude, 4) + ", " + str + " }";
}
