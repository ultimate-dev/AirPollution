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
 const String WIFI_SSID = "AirPollution_WIFI";
 const String WIFI_PASS = "taha55taha";
 const String SERVER_HOST = "http://192.168.43.185:2323";

 /**
 * Constants
 */
 const uint16_t DELAY = 500;

/**
 * Initializing
 */
 TinyGPS gps;
 SoftwareSerial gpsSerial(PIN_GPS_RX, PIN_GPS_TX);// (RX, TX)
 
/**
 * Varibles
 */
 float lng, lat, altitude;
 float ppm, co_ppm, co2_ppm, alkol_ppm, aseton_ppm;
 float temperature, humidity, heat_index;
 float pressure;
 String json;
 

void setup() {
 Serial.begin(115200);
 gpsSerial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println();
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
}

void loop() {
  
   encodeGps();
   
   String json = encodeSerial();
   Serial.println(json);


   gps.f_get_position(&lat, &lng);
   altitude = gps.f_altitude();

  
   if (WiFi.status() == WL_CONNECTED) {
    
      WiFiClient client;
      HTTPClient http;
    
      http.begin(client, SERVER_HOST + "/api");
      http.addHeader("Content-Type", "application/json");

        
      int httpCode = http.POST(json);
      if(httpCode == HTTP_CODE_OK){
        Serial.println(http.getString());
      }
      http.end();
    }


}

void encodeGps(){
  unsigned long start = millis();
  do{
    while(gpsSerial.available())
      gps.encode(gpsSerial.read());
  }while(millis()-start<DELAY);
}

String encodeSerial(){
  String str;
  unsigned long start = millis();

    if(Serial.available())
      str+= Serial.readStringUntil('\r');
  
  return "{ \"id\":\""+ID+"\", \"lat\":"+String(lat,6)+", \"lng\":"+String(lng,6)+", \"altitude\":"+String(altitude,4)+", "+str+" }";
}
