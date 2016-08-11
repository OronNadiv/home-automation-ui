const error = require('debug')('ha:app:error')

const domain = require('domain')
const diehard = require('diehard')
const expressInitializer = require('./initializations/express')
const Promise = require('bluebird')
const socketIO = require('socket.io')

const d = domain.create()

d.on('error', error)

d.run(() => {
  Promise
    .try(expressInitializer.initialize)
    .get('server')
    .then(socketIO)
    .then(() => diehard.listen({timeout: 5000}))
})
