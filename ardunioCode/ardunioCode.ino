#include <Braccio.h>
#include <Servo.h>

Servo base;
Servo shoulder;
Servo elbow;
Servo wrist_rot;
Servo wrist_ver;
Servo gripper;

const int stepLength = 3;
int count = 0;

int M1 = 0;
int M2 = 15;
int M3 = 180;
int M4 = 170;
int M5 = 0;
int M6 = 73;
int bufferM1 = 0;
int bufferM2 = 15;
int bufferM3 = 180;
int bufferM4 = 170;
int bufferM5 = 0;
int bufferM6 = 73;
int _time = 0;
int _timeOld = 0;
boolean moveBraccio = false;

void setup() {
  Serial.begin(9600);
  Braccio.begin();
}

void loop() {
  braccioAction();
  if (Serial.available()) {
    int num = Serial.read();
    if (num == 255) {
      count = 0;
      if ((bufferM1 < M1 - stepLength) || (bufferM1 > M1 + stepLength )) M1 = bufferM1;
      if ((bufferM2 < M2 - stepLength) || (bufferM2 > M2 + stepLength )) M2 = bufferM2;
      if ((bufferM3 < M3 - stepLength) || (bufferM3 > M3 + stepLength )) M3 = bufferM3;
      if ((bufferM4 < M4 - stepLength) || (bufferM4 > M4 + stepLength )) M4 = bufferM4;
      if ((bufferM5 < M5 - stepLength) || (bufferM5 > M5 + stepLength )) M5 = bufferM5;
      if ((bufferM6 < M6 - stepLength) || (bufferM6 > M6 + stepLength )) M6 = bufferM6;
    } else {
      count++;
    }
    switch (count)
    {
      case 1:
        bufferM1 = num;
        if (bufferM1 > 180) bufferM1 = 0;
        if (bufferM1 < 0) bufferM1 = 0;
        break;
      case 2:
        bufferM2 = num;
        if (bufferM2 > 180) bufferM2 = 15;
        if (bufferM2 < 15) bufferM2 = 15;
        break;
      case 3:
        bufferM3 = num;
        if (bufferM3 > 180) bufferM3 = 0;
        if (bufferM3 < 0) bufferM3 = 0;
        break;
      case 4:
        bufferM4 = num;
        if (bufferM4 > 180) bufferM4 = 0;
        if (bufferM4 < 0) bufferM4 = 0;
        break;
      case 5:
        bufferM5 = num;
        if (bufferM5 > 180) bufferM5 = 0;
        if (bufferM5 < 0) bufferM5 = 0;
        break;
      case 6:
        bufferM6 = num;
        if (bufferM6 > 180) bufferM6 = 0;
        if (bufferM6 < 0) bufferM6 = 0;
        break;
      default:
        break;
    }
  }
}

void braccioAction() {
  if (!moveBraccio) {
    moveBraccio = true;
    _time = (int)(millis() / 150);
    if (_timeOld != _time) {
      _timeOld = _time;
      Braccio.ServoMovement(10, M1, M2, M3, M4, M5, M6);
    }
    moveBraccio = false;
  }
}