/**
 * Libraries
 */
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
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
 const uint16_t DELAY = 1000;

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
   StaticJsonDocument<255> payload;
   deserializeJson(payload ,json);

    ppm=payload["ppm"];
    co_ppm=payload["co_ppm"];
    co2_ppm=payload["co2_ppm"];
    alkol_ppm=payload["alkol_ppm"];
    aseton_ppm=payload["aseton_ppm"];
    temperature=payload["temperature"];
    humidity=payload["humidity"];
    heat_index=payload["heat_index"];
    pressure=payload["pressure"];

   gps.f_get_position(&lat, &lng);
   altitude = gps.f_altitude();

  
   if (WiFi.status() == WL_CONNECTED) {
    
      WiFiClient client;
      HTTPClient http;
    
      http.begin(client, SERVER_HOST + "/api");
      http.addHeader("Content-Type", "application/json");

      StaticJsonDocument<255> data;
      data["id"] = ID;
      data["lat"] = lat;
      data["lng"] = lng;
      data["altitude"] = altitude;
      data["ppm"] = ppm;
      data["co_ppm"] = co_ppm;
      data["co2_ppm"] = co2_ppm;
      data["alkol_ppm"] = alkol_ppm;
      data["aseton_ppm"] = aseton_ppm;
      data["temperature"] = temperature;
      data["humidity"] = humidity;
      data["heat_index"] = heat_index;
      data["pressure"] = pressure;

      
      char body[255];
      serializeJson(data, body);
        
      int httpCode = http.POST(body);
      if(httpCode == HTTP_CODE_OK){
        String payload = http.getString();
        Serial.println(payload);  
      }
      else{
        Serial.println("Server Fatal Error");  
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
  do{
    while(Serial.available())
      str+= char(Serial.read());
  }while(millis()-start<DELAY);
  return str;
}
