#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>
#include <PID_v1.h>

#define ONE_WIRE_BUS 12

// logging period
int loggingPeriod = 60; // in minutes

// millis
uint32_t lastMillis = 0;
uint32_t lastLogging = 0;

// avg temp in this room
double sensorReadings[3] = {0.0};
double tempAvg = 0.0;

// AC temp control
double tempControl = 0.0;
double setPoint = 20.0; // desired room temperature within 20°C

// setup for DS18B20 using OneWire interface.
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
byte numDevices = 0;

// setup for dummy temperature controller using LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// PID constants
double kp = 0.5;   // Proportional gain
double ki = 0.2; // Integral gain
double kd = 0.6;   // Derivative gain

// setup PID instance
PID tempPID(&tempAvg, &tempControl, &setPoint, kp, ki, kd, DIRECT);

void setup() {
  Serial.begin(115200);
  sensors.begin();

  // auto finding the addresses to make it easier
  byte address[8];

  while (oneWire.search(address)) {
    numDevices++;
  }

  if (numDevices == 0) {
    Serial.println("{\"status\": \"Failed\"}");
    for (;;);
  }

  // init LCD for dummy temp controller
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("AC Control");

  tempPID.SetMode(AUTOMATIC);
}

void loop() {
  uint32_t currMillis = millis();

  // polling sensor 1s
  if (currMillis - lastMillis >= 1000) {
    getTemp();
    computePID();
    printLCDTempControl();
    sendStatistic("RT");

    lastMillis = currMillis;
  }

  // statistic
  if (currMillis - lastLogging >= 1000 * 60 * loggingPeriod) {
    sendStatistic("LOG");

    lastLogging = currMillis;
  }

}

void getTemp() {
  tempAvg = 0.0;
  sensors.requestTemperatures();

  for (byte i = 0; i < numDevices; i++) {
    double readings = sensors.getTempCByIndex(i);
    sensorReadings[i] = readings;
    tempAvg += readings;
  }

  tempAvg /= numDevices;
}

void computePID() {
  // compute error
  double error = setPoint - tempAvg;


  // a bit hack to make PID response according to the direction
  // set direction based on error sign
  if (error > 0) {
    tempPID.SetControllerDirection(DIRECT); // increase output to heat up the room
  } else {
    tempPID.SetControllerDirection(REVERSE); // decrease output to cool down the room
  }

  // compute PID output
  tempPID.Compute();

  // calculate the output according PID direction
  if (error > 0) {
    tempControl = setPoint + tempControl;
  } else {
    tempControl = setPoint - tempControl;
  }

  tempControl = constrain(tempControl, 0, 40);

}

void printLCDTempControl() {
  lcd.setCursor(0, 1);
  lcd.print(tempControl);

  lcd.setCursor(6, 1);
  lcd.print("C");

}

void sendStatistic(String level) {
  Serial.print(level);
  Serial.print("#");
  Serial.print(sensorReadings[0]);
  Serial.print(",");
  Serial.print(sensorReadings[1]);
  Serial.print(",");
  Serial.print(sensorReadings[2]);
  Serial.print(",");
  Serial.print(tempAvg);
  Serial.print(",");
  Serial.println(tempControl);
}