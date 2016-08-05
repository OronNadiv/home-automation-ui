const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('./logger')
const error = log.error.bind(log, LOG_PREFIX)

const domain = require('domain')
const diehard = require('diehard')
const expressInitializer = require('./initializations/express')
const Promise = require('bluebird')
const socketIO = require('socket.io')

const d = domain.create()

d.on('error', error)

d.run(() => {
  log.level = process.env.LOG_LEVEL || 'info'

  Promise
    .try(expressInitializer.initialize)
    .get('server')
    .then(socketIO)
    .then(() => diehard.listen({timeout: 5000}))
})
