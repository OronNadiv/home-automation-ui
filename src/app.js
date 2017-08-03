const diehard = require('diehard')
const expressInitializer = require('./initializations/express')
const Promise = require('bluebird')
const socketIO = require('socket.io')

Promise
  .try(expressInitializer.initialize)
  .get('server')
  .then(socketIO)
  .then(() => diehard.listen({timeout: 5000}))
