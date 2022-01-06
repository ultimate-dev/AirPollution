/**
 * Libraries
 */
#include <SoftwareSerial.h>
#include <DHT.h>
#include <MQ135.h>
#include <Adafruit_BMP085.h>
#include <Adafruit_PCD8544.h>
#include <ArduinoJson.h>

/**
 * Pins
 */
#define PIN_ESP_RX 5
#define PIN_ESP_TX 6
#define PIN_DHT A0
#define PIN_MQ A1

/**
 * Constants
 */
 const uint16_t DELAY = 1000;

/**
 * Initializing
 */
SoftwareSerial espSerial(PIN_ESP_RX, PIN_ESP_TX);// (RX, TX)
DHT dht(PIN_DHT, DHT11);// (Pin, DHT_Type)
MQ135 mq(PIN_MQ);// (Pin)
Adafruit_BMP085 bmp; // (SCL, SDA)->(A4, A5)
Adafruit_PCD8544 lcd = Adafruit_PCD8544(8, 9, 10, 12, 11);// (SCLK, DIN, D/C, CS, RST)

 /**
 * Varibles
 */
 float lng, lat, altitude;
 float ppm,rzero,resistance, co_ppm, co2_ppm, alkol_ppm, aseton_ppm;
 float temperature, humidity, heat_index;
 float pressure;

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);
  
  dht.begin();
  bmp.begin();
  lcd.begin();
  lcd.setContrast(100);

}

void loop() {


 // DHT11
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  heat_index = dht.computeHeatIndex(temperature, humidity, false);
 
  // MQ135
  rzero = mq.getCorrectedRZero(temperature, humidity);
  resistance = mq.getCorrectedResistance(temperature, humidity);
  ppm = mq.getCorrectedPPM(temperature, humidity);

  // BMP180
  pressure = bmp.readPressure();
  
 // 3310LCD
  lcd.clearDisplay();
  lcd.setTextSize(1);
  lcd.setCursor(0,0);
  lcd.println("Hello, world!");
  lcd.display();

  

 
  sendSerial();

  delay(DELAY);
}

void sendSerial(){
  StaticJsonDocument<255> data;
  data["ppm"] = ppm;
  data["co_ppm"] = co_ppm;
  data["co2_ppm"] = co2_ppm;
  data["alkol_ppm"] = alkol_ppm;
  data["aseton_ppm"] = aseton_ppm;
  data["temperature"] = temperature;
  data["humidity"] = humidity;
  data["heat_index"] = heat_index;
  data["pressure"] = pressure;
  
  char output[255];
  serializeJson(data, output);
 
  espSerial.println(output);
}
