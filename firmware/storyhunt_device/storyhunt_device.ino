// Story Hunt checkpoint device: ESP32 + RC522 card reader + SPI TFT + 3 buttons.
//
// NOT YET TESTED ON HARDWARE. It was written against the server API without the
// board in hand. Check the pins below against your wiring before flashing.
//
// The device is deliberately "dumb": it sends card taps and button presses to
// the server and draws whatever title/lines/button labels come back. All game
// logic lives in server.js, and public/device.html behaves exactly the same.
//
// Libraries (Arduino Library Manager): MFRC522, TFT_eSPI, ArduinoJson (v7).
// TFT pins and driver are set in TFT_eSPI's User_Setup.h, not here.

#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <TFT_eSPI.h>
#include <ArduinoJson.h>

// ---- change these ----
const char* WIFI_SSID = "your-hotspot";
const char* WIFI_PASS = "your-password";
const char* SERVER    = "http://192.168.43.10:3000";  // laptop IP on the same hotspot
const char* TOKEN     = "demo-device-token";
const char* CHECKPOINT = "cafe-1";

const int PIN_RFID_SS = 5, PIN_RFID_RST = 27;         // RC522 shares the SPI bus with the TFT
const int PIN_RED = 32, PIN_YELLOW = 33, PIN_GREEN = 25;  // buttons to GND, internal pull-ups
// ----------------------

MFRC522 rfid(PIN_RFID_SS, PIN_RFID_RST);
TFT_eSPI tft;
String lastDrawn;
unsigned long lastPoll = 0;

// Draw text with simple word wrap. Returns the y position after the text.
int drawWrapped(const String& text, int y, int size, uint16_t colour) {
  tft.setTextSize(size);
  tft.setTextColor(colour, TFT_BLACK);
  const int maxChars = (tft.width() - 8) / (6 * size);
  String line;
  int start = 0;
  while (start < (int)text.length()) {
    int space = text.indexOf(' ', start);
    if (space < 0) space = text.length();
    String word = text.substring(start, space);
    if (line.length() + word.length() + 1 > (unsigned)maxChars && line.length()) {
      tft.setCursor(4, y); tft.print(line); y += 8 * size + 4; line = "";
    }
    line += (line.length() ? " " : "") + word;
    start = space + 1;
  }
  if (line.length()) { tft.setCursor(4, y); tft.print(line); y += 8 * size + 4; }
  return y;
}

void draw(JsonDocument& doc) {
  String title = doc["title"] | "Story Hunt";
  String key = title;
  for (JsonVariant l : doc["lines"].as<JsonArray>()) key += "|" + l.as<String>();
  if (key == lastDrawn) return;  // nothing changed, avoid flicker
  lastDrawn = key;

  tft.fillScreen(TFT_BLACK);
  int y = drawWrapped(title, 6, 3, TFT_YELLOW) + 6;
  for (JsonVariant l : doc["lines"].as<JsonArray>()) y = drawWrapped(l.as<String>(), y, 2, TFT_WHITE) + 4;

  if (!doc["buttons"].isNull()) {
    y = tft.height() - 60;
    y = drawWrapped("RED: " + doc["buttons"]["red"].as<String>(), y, 2, TFT_RED);
    y = drawWrapped("YELLOW: " + doc["buttons"]["yellow"].as<String>(), y, 2, TFT_YELLOW);
    drawWrapped("GREEN: " + doc["buttons"]["green"].as<String>(), y, 2, TFT_GREEN);
  }
}

void showError(const String& msg) {
  lastDrawn = "";
  tft.fillScreen(TFT_BLACK);
  int y = drawWrapped("Please wait", 6, 3, TFT_YELLOW) + 6;
  drawWrapped(msg, y, 2, TFT_WHITE);
}

// POST (body given) or GET (body empty), then draw the reply.
void request(const String& path, const String& body) {
  if (WiFi.status() != WL_CONNECTED) { showError("No Wi-Fi. Trying again."); return; }
  HTTPClient http;
  http.setTimeout(4000);
  http.begin(String(SERVER) + path);
  int code;
  if (body.length()) { http.addHeader("Content-Type", "application/json"); code = http.POST(body); }
  else code = http.GET();
  if (code == 200) {
    JsonDocument doc;
    if (!deserializeJson(doc, http.getString())) draw(doc);
  } else {
    showError("Cannot reach the server (" + String(code) + ").");
  }
  http.end();
}

String baseBody() {
  return String("{\"deviceToken\":\"") + TOKEN + "\",\"checkpointId\":\"" + CHECKPOINT + "\"";
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RED, INPUT_PULLUP); pinMode(PIN_YELLOW, INPUT_PULLUP); pinMode(PIN_GREEN, INPUT_PULLUP);
  tft.init(); tft.setRotation(1);
  SPI.begin(); rfid.PCD_Init();
  showError("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  request(String("/api/device/state?checkpointId=") + CHECKPOINT, "");
}

void loop() {
  // 1. Card tap: send the card's UID as hex.
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String uid;
    for (byte i = 0; i < rfid.uid.size; i++) { if (rfid.uid.uidByte[i] < 0x10) uid += "0"; uid += String(rfid.uid.uidByte[i], HEX); }
    Serial.println("Card " + uid);
    request("/api/device/tap", baseBody() + ",\"cardId\":\"" + uid + "\"}");
    rfid.PICC_HaltA();
    delay(800);  // ignore the same card held in place
  }

  // 2. Buttons.
  const int pins[3] = { PIN_RED, PIN_YELLOW, PIN_GREEN };
  const char* names[3] = { "red", "yellow", "green" };
  for (int i = 0; i < 3; i++) {
    if (digitalRead(pins[i]) == LOW) {
      request("/api/device/button", baseBody() + ",\"button\":\"" + names[i] + "\"}");
      while (digitalRead(pins[i]) == LOW) delay(10);  // wait for release
      delay(150);
    }
  }

  // 3. Poll so timed messages clear and the screen follows the server.
  if (millis() - lastPoll > 1500) {
    lastPoll = millis();
    request(String("/api/device/state?checkpointId=") + CHECKPOINT, "");
  }
}
