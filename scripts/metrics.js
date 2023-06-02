const io = require('@pm2/io')

const message = io.metric({ name: 'Messages' })
const command = io.metric({ name: 'Commands' })
const stream = io.metric({ name: 'Streams' })
const free = io.metric({ name: 'Free' })

exports.message = function () {
  message.set()
}

exports.reportCommand = function () {
  command.set()
}

exports.streamCounter = function () {
  stream.set()
}

exports.free = function () {
  free.set()
}
