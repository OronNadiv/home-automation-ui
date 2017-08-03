const verbose = require('debug')('ha:initializations:express:verbose')
const info = require('debug')('ha:initializations:express:info')
const warn = require('debug')('ha:initializations:express:warn')
const error = require('debug')('ha:initializations:express:error')

const authToken = require('./../middleware/auth_token')
const bodyParser = require('body-parser')
const config = require('./../config')
const cookieParser = require('cookie-parser')
const diehard = require('diehard')
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
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
          warn('unknown request.  See logs for more details.')
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
