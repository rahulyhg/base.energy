// GSM - Version: Latest 
#include <GSM.h>
#include <GSM3CircularBuffer.h>
#include <GSM3IO.h>
#include <GSM3MobileAccessProvider.h>
#include <GSM3MobileCellManagement.h>
#include <GSM3MobileClientProvider.h>
#include <GSM3MobileClientService.h>
#include <GSM3MobileDataNetworkProvider.h>
#include <GSM3MobileMockupProvider.h>
#include <GSM3MobileNetworkProvider.h>
#include <GSM3MobileNetworkRegistry.h>
#include <GSM3MobileSMSProvider.h>
#include <GSM3MobileServerProvider.h>
#include <GSM3MobileServerService.h>
#include <GSM3MobileVoiceProvider.h>
#include <GSM3SMSService.h>
#include <GSM3ShieldV1.h>
#include <GSM3ShieldV1AccessProvider.h>
#include <GSM3ShieldV1BandManagement.h>
#include <GSM3ShieldV1BaseProvider.h>
#include <GSM3ShieldV1CellManagement.h>
#include <GSM3ShieldV1ClientProvider.h>
#include <GSM3ShieldV1DataNetworkProvider.h>
#include <GSM3ShieldV1DirectModemProvider.h>
#include <GSM3ShieldV1ModemCore.h>
#include <GSM3ShieldV1ModemVerification.h>
#include <GSM3ShieldV1MultiClientProvider.h>
#include <GSM3ShieldV1MultiServerProvider.h>
#include <GSM3ShieldV1PinManagement.h>
#include <GSM3ShieldV1SMSProvider.h>
#include <GSM3ShieldV1ScanNetworks.h>
#include <GSM3ShieldV1ServerProvider.h>
#include <GSM3ShieldV1VoiceProvider.h>
#include <GSM3SoftSerial.h>
#include <GSM3VoiceCallService.h>

// Sensors
int sensorPinStrom = A0; 
int sensorPinSpannung = A1; 

float vout = 0.0;
float vin = 0.0;
float R1 = 100000.0; // Widerstandswert R1 (100K) - siehe Schaltskizze!
float R2 = 10000.0; // Widerstandswert R2 (10K) - siehe Schaltskizze!

int sensorValue = 0;
float strom=0;
float spannung=0;


// PIN Number
#define PINNUMBER ""

// APN data
// Hofer HOT Sim Card
#define GPRS_APN       "web" // replace your GPRS APN
#define GPRS_LOGIN     "web@telering.at"    // replace with your GPRS login
#define GPRS_PASSWORD  "web" // replace with your GPRS password

// initialize the library instance
GSMClient client;
GPRS gprs;
GSM gsmAccess(false); // true is debug

// URL, path & port (for example: arduino.cc)
char server[] = "dev.base.energy";
char path[] = "/elektroskop-baselogger/baseLogger.php?voltage=";
int port = 80; // port 80 is the default for HTTP

//****Programm******

void setup() {
   //Serielle Schnitstelle für Ausgabe öffnen
   Serial.begin(9600);    
   Serial.println("Starting base logger..."); 


  Serial.println("Starting Arduino web client.");
  // connection state
  boolean notConnected = true;

  // After starting the modem with GSM.begin()
  // attach the shield to the GPRS network with the APN, login and password
  while (notConnected) {
    if ((gsmAccess.begin(PINNUMBER) == GSM_READY) &
        (gprs.attachGPRS(GPRS_APN, GPRS_LOGIN, GPRS_PASSWORD) == GPRS_READY)) {
      notConnected = false;
      Serial.println("GPRS_READY");
    } else {
      Serial.println("Not connected");
      delay(1000);
    }
  }



} 

void loop() {
  //******STROM*****
  sensorValue = analogRead(sensorPinStrom); //Hole Wert
  //510=0A
  //sensorValue =   sensorValue -510;//510=0A  0=-75A  1023=75A
  //springen um 0 reduzieren
  //if(sensorValue==1)sensorValue=0;
  //if(sensorValue==-1)sensorValue=0;
  //Umwandeln um einen Wert zuwischen -75 und +75 zu erhalten
  strom=(float)75/512*sensorValue;
  //über Serielle Schnitstelle ausgeben
  Serial.print(sensorValue); 
  Serial.print("A"); 
  Serial.print("\t"); 
  
  //******SPANNUNG*****
  // put your main code here, to run repeatedly:
  sensorValue = analogRead(sensorPinSpannung); //Messwerte am analogen Pin als "values" definieren
  vout = (sensorValue * 5.0) / 1024.0; // Messwerte in Volt umrechnen = Spannung am Ausgang des
  // Spannungsteilers mit Zuleitung zu Pin A0
  spannung = vout / (R2 / (R1 + R2)); // Berechnen, welche Spannung am Eingang des Spannungsteilers
  // anliegt. Das entspricht der Spannung der zu untersuchenden Batterie
  if (spannung < 0.09) {
    spannung = 0.0; // Unterdrücken unerwünschter Anzeigen
  }

    //über Serielle Schnitstelle ausgeben
  Serial.print(spannung); 
  Serial.println("V"); //\n


  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  if (client.connect(server, port)) {
    Serial.println("connected");
    // Make a HTTP request:
    client.print("POST ");
    client.print(path);
    client.print(spannung);
    client.println(" HTTP/1.1");
    client.print("Host: ");
    client.println(server);
    client.println("Connection: close");
    client.println();    
    
  } 
  else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }     



  // if the server's disconnected, stop the client:
  if (!client.available() && !client.connected()) {
    Serial.println();
    Serial.println("client unavailable and disconnected.");
    client.stop();
  }

  Serial.println("disconnecting...");
  //client.flush(); // precaution
  client.stop(); // precaution
 
  delay(60000); //60 Sekunden warten
}
