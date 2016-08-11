const error = require('debug')('ha:config:error')

const fs = require('fs')
const path = require('path')

const config = {production: process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'}

config.authPublicKey = process.env.AUTH_PUBLIC_KEY || (config.production ? null : fs.readFileSync(path.join(__dirname, '../test/keys/public_key.pem')))
if (!config.authPublicKey) {
  error(
    'Login public key could not be found in the environment variable.  Please set \'AUTH_PUBLIC_KEY\'.'
  )
  process.exit(1)
}

config.loginUrl = process.env.LOGIN_URL || (config.production ? null : 'http://localhost:3001')
if (!config.loginUrl) {
  error(
    'Login URL could not be found in the environment variable.  Please set \'LOGIN_URL\'.'
  )
  process.exit(1)
}

config.port = process.env.PORT || 3000

module.exports = config
