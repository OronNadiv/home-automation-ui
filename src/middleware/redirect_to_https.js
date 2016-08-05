const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('../logger')
const info = log.info.bind(log, LOG_PREFIX)

const config = require('../config')

module.exports = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https' || !config.production) {
    return next()
  }
  info(
    'Redirecting to https.  req.hostname: ',
    req.hostname,
    ', req.ur: ',
    req.url
  )
  res.redirect(`https://${req.hostname}${req.url}`)
}
