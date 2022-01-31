/**
 * Libraries
 */
#include <SoftwareSerial.h>
#include <DHT.h>
#include <MQ135.h>
#include <Adafruit_BMP085.h>
#include <Adafruit_PCD8544.h>

/**
 * Pins
 */
#define PIN_ESP_RX 5
#define PIN_ESP_TX 6
#define PIN_DHT A0
#define PIN_MQ A1
#define PIN_FAN 2
#define PIN_PIEZO 3

/**
 * Constants
 */
const uint16_t DELAY = 500;

/**
 * Initializing
 */
SoftwareSerial espSerial(PIN_ESP_RX, PIN_ESP_TX);          // (RX, TX)
DHT dht(PIN_DHT, DHT11);                                   // (Pin, DHT_Type)
MQ135 mq(PIN_MQ);                                          // (Pin)
Adafruit_BMP085 bmp;                                       // (SCL, SDA)->(A4, A5)
Adafruit_PCD8544 lcd = Adafruit_PCD8544(8, 9, 10, 12, 11); // (SCLK, DIN, D/C, CS, RST)

/**
 * Varibles
 */
float lng, lat, altitude;
float ppm, rzero, resistance, co_ppm, co2_ppm, alkol_ppm, aseton_ppm;
float temperature, humidity, heat_index;
float pressure, fan_temp;

void setup()
{
  // Ouputs initializing
  pinMode(PIN_FAN, OUTPUT);
  pinMode(PIN_PIEZO, OUTPUT);
  // Seial comminications
  Serial.begin(9600);
  espSerial.begin(115200);
  // Installing Modul and Sensors
  dht.begin();
  bmp.begin();
  lcd.begin();
  lcd.setContrast(100);
}

void loop()
{
  // DHT11
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  heat_index = dht.computeHeatIndex(temperature, humidity, false);
  // MQ135
  rzero = mq.getCorrectedRZero(temperature, humidity);
  resistance = mq.getCorrectedResistance(temperature, humidity);
  ppm = mq.getCorrectedPPM(temperature, humidity);
  co_ppm = calcPpm(rzero, resistance, -0.250, 0.687);
  co2_ppm = calcPpm(rzero, resistance, -0.351, 0.721);
  alkol_ppm = calcPpm(rzero, resistance, -0.316, 0.681);
  aseton_ppm = calcPpm(rzero, resistance, -0.298, 0.465);
  // BMP180
  pressure = bmp.readPressure();
  fan_temp = bmp.readTemperature();
  // 3310LCD
  lcd.clearDisplay();
  lcd.setTextSize(2);
  lcd.setCursor(0, 0);
  lcd.println(ppm);
  lcd.display();
  // Fan Control
  if (fan_temp > 35.00)
    digitalWrite(PIN_FAN, HIGH);
  else
    digitalWrite(PIN_FAN, LOW);
  // Sends sensor and module data via Serial Communication
  serialComminication();
  // Wait until the delay
  delay(DELAY);
}

/**
 * Functions
 */

// Esp Serial Communication
void serialComminication()
{
  espSerial.print("\"ppm\":" + String(ppm, 2));
  espSerial.print(", \"co_ppm\":" + String(co_ppm, 2));
  espSerial.print(", \"co2_ppm\":" + String(co2_ppm, 2));
  espSerial.print(", \"alkol_ppm\":" + String(alkol_ppm, 2));
  espSerial.print(", \"aseton_ppm\":" + String(aseton_ppm, 2));
  espSerial.print(", \"temperature\":" + String(temperature, 2));
  espSerial.print(", \"humidity\":" + String(humidity, 2));
  espSerial.print(", \"heat_index\":" + String(heat_index, 2));
  espSerial.print(", \"pressure\":" + String(pressure, 4));
  espSerial.println();
}

// Ppm values calculation
double calcPpm(float rzero, float resistance, double m, double b)
{
  return pow(10, (log10(resistance / rzero) - b) / m);
}
