/**
 * Libraries
 */
#include <SoftwareSerial.h>
#include <DHT.h>
#include <MQ135.h>
#include <Adafruit_BMP085.h>
#include <TinyGPS.h>
#include <Adafruit_PCD8544.h>
#include <Esp8266_HTTP.h>

/**
 * Baunds
 */
#define BAUND 9600
#define BAUND_ESP 115200
#define BAUND_GPS 9600


/**
 * Pins
 */
#define PIN_ESP_RX 2
#define PIN_ESP_TX 3
#define PIN_DHT A0
#define PIN_MQ A1


/**
 * Initializing
 */
Esp esp(PIN_ESP_RX, PIN_ESP_TX);// (RX, TX)
DHT dht(PIN_DHT, DHT11);// (Pin, DHT_Type)
MQ135 mq(PIN_MQ);// (Pin)
Adafruit_BMP085 bmp; // (SCL, SDA)->(A4, A5)
Adafruit_PCD8544 lcd = Adafruit_PCD8544(8, 9, 10, 12, 11);// (SCLK, DIN, D/C, CS, RST)


/**
 * Configration
 */
const String ID = "ELZ_1";
const String WIFI_SSID = "AirPollution_WIFI";
const String WIFI_PASS = "taha55taha";
const String SERVER_IP = "192.168.43.185";
const String SERVER_PORT = "2323";

/**
 * Variables
 */
float temperature, humidity, heat_index;
float rzero, resistance, ppm;
float pressure, sealevel_pressure;
uint8_t sat, hdop;
float latitude, longitude, altitude, course, speed;
String cardinal;
int year;
byte month, day, hour, minute, second;
unsigned long age;

void setup()
{

  Serial.begin(BAUND);
  esp.begin(BAUND_ESP);
  esp.connect(WIFI_SSID, WIFI_PASS);
  dht.begin();
  bmp.begin();
  lcd.begin();
  lcd.setContrast(100);
 
}

void loop()
{


 
  // DHT11
  esp.startHttp(SERVER_IP, SERVER_PORT);
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  heat_index = dht.computeHeatIndex(temperature, humidity, false);
  esp.http("dht/set?id="+ID+"&values="+String(temperature)+","+String(humidity)+","+String(heat_index), "POST");
  esp.closeHttp();
 
 
  // MQ135
  esp.startHttp(SERVER_IP, SERVER_PORT);
  rzero = mq.getCorrectedRZero(temperature, humidity);
  resistance = mq.getCorrectedResistance(temperature, humidity);
  ppm = mq.getCorrectedPPM(temperature, humidity);
  esp.http("mq/set?id="+ID+"&values="+String(rzero)+","+String(resistance)+","+String(ppm), "POST");
  esp.closeHttp();

 
  // BMP180
  esp.startHttp(SERVER_IP, SERVER_PORT);
  pressure = bmp.readPressure();
  sealevel_pressure = bmp.readSealevelPressure(/*altitude*/);
  esp.http("bmp/set?id="+ID+"&values="+String(pressure)+","+String(sealevel_pressure), "POST");
  esp.closeHttp();


  // 3310LCD
  lcd.clearDisplay();
  lcd.setTextSize(1);
  lcd.setCursor(0,0);
  lcd.println("Hello, world!");
  lcd.display();
  
  delay(1000);

  
}
