const Leap = require('leapjs')
const SerialPort = require('serialport')
const port = new SerialPort('COM3', { baudRate: 9600 })

// M1=base degrees. Allowed values from 0 to 180 degrees
// M2=shoulder degrees. Allowed values from 15 to 165 degrees
// M3=elbow degrees. Allowed values from 0 to 180 degrees
// M4=wrist vertical degrees. Allowed values from 0 to 180 degrees
// M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
// M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.
let M1 = 0
let M2 = 15
let M3 = 0
let M4 = 0
let M5 = 0
let M6 = 10

let palmNormal = []
let handDirection = []
let handSphereCenter = []
let indexFingerDirection = []
let thumbDirection = []

function sendData () {
  if (palmNormal.length !== 0) {
    M1 = parseInt(handDirection[0] * 90 + 90)

    M2 = parseInt(handSphereCenter[2] / 5) + 90
    M2 = M2 > 165 ? 165 : M2 < 15 ? 15 : M2

    M3 = parseInt(handDirection[1] * 90)
    M3 = M3 < 0 ? 0 : M3

    M4 = parseInt(indexFingerDirection[2] * -56 + 34)
    M4 = M4 < 0 ? 0 : M4 > 90 ? 90 : M4

    M5 = parseInt(palmNormal[0] * 90) + 90

    M6 = parseInt(calcAngle() * 210 - 122.3)
    M6 = M6 < 10 ? 10 : M6 > 73 ? 73 : M6

    const sendData = [255, M1, M2, M3, M4, M5, M6]
    console.log(`M1: ${M1}, M2: ${M2}, M3: ${M3}, M4: ${M4}, M5: ${M5}, M6: ${M6}`)
    port.write(sendData)
  }
}

setInterval(() => {
  sendData()
}, 50)

let data = {}
Leap.loop(function (frame) {
  if (frame.hands[0]) {
    data = frame.hands[0]
    palmNormal = data.palmNormal
    handDirection = data.direction || [0, 0, 0]
    handSphereCenter = data.sphereCenter || [0, 0, 0]
    indexFingerDirection = data.indexFinger ? data.indexFinger.direction : [0, 0, 0]
    thumbDirection = data.thumb ? data.thumb.direction : [0, 0, 0]
  }
})

function calcAngle () {
  const x1 = thumbDirection[0]
  const y1 = thumbDirection[1]
  const z1 = thumbDirection[2]
  const x2 = indexFingerDirection[0]
  const y2 = indexFingerDirection[1]
  const z2 = indexFingerDirection[2]
  const aLength = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1)
  const bLength = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2)
  const cosValue = (x1 * x2 + y1 * y2 + z1 * z2) / (aLength * bLength)
  return cosValue
}

// setInterval(() => {
//   let value = parseInt(calcAngle() * 210 - 122.3)
//   console.log(value)
// }, 100)

// const Readline = require('@serialport/parser-readline')
// const parser = new Readline()
// port.pipe(parser)
// parser.on('data', line => console.log(`Serial Port Msg: ${line}`))
