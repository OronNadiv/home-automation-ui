const info = require('debug')('ha:middleware:redirect_to_https:info')

const config = require('../config')

module.exports = (req, res, next) => {
  if (config.skipSSL || req.headers['x-forwarded-proto'] === 'https' || !config.production) {
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
