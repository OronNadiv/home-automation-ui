const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('../logger')
const verbose = log.verbose.bind(log, LOG_PREFIX)
const info = log.info.bind(log, LOG_PREFIX)
const error = log.error.bind(log, LOG_PREFIX)

const authToken = require('./../middleware/auth_token')
const bodyParser = require('body-parser')
const config = require('./../config')
const cookieParser = require('cookie-parser')
const diehard = require('diehard')
const express = require('express')
const favicon = require('serve-favicon')
const Promise = require('bluebird')
const ping = require('./../middleware/ping')
const redirectToHttps = require('./../middleware/redirect_to_https')
const xHeaders = require('./../middleware/x_headers')

const app = express()

module.exports = {
  initialize () {
    return new Promise(resolve => {
      app.use('/ping', ping)
      app.use(redirectToHttps)
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({extended: true}))

      app.use(favicon(path.join(__dirname, '../../www/favicon.ico')))
      app.use(cookieParser())

      app.use(express.static(path.join(__dirname, '/../../www'), {etag: true}))
      app.use(express.static(path.join(__dirname, '/../../bower_components'), {etag: true}))

      app.use(authToken)
      app.use(xHeaders)

      app.use((err, req, res) => {
        if (!(err instanceof Error)) {
          // req is actually res.
          error('unknown request.  See logs for more details.')
          return req.sendStatus(404)
        }
        error('sending Error.  Err: ', err)
        return res.sendStatus(err.status || 500)
      })

      const server = app.listen(config.port, () => {
        info(`Express server listening on port ${server.address().port}`)

        diehard.register(done => {
          verbose('Shutting down http server')
          server.close(() => {
            verbose('Http server was shutdown successfully.')
            done()
          })
        })

        resolve({server: server, express: app})
      })
    })
  }
}
