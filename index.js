const Leap = require('leapjs')
const SerialPort = require('serialport')
// const Readline = require('@serialport/parser-readline')

const port = new SerialPort('COM3', { baudRate: 9600 })
let handVector = []

// const parser = new Readline()
// port.pipe(parser)
// parser.on('data', line => console.log(`Serial Port Msg: ${line}`))

setInterval(() => {
  if (handVector.length !== 0) {
    const angle = parseInt(handVector[2] * 90 + 90)
    console.log(handVector)
    console.log(angle)
    port.write([angle])
  }
}, 100)

Leap.loop(function (frame) {
  if (frame.hands[0]) {
    handVector = frame.hands[0].palmNormal
  }
})
