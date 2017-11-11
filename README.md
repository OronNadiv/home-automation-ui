#### DEPRECATED. See [new implementation][ui-react-url] using React.

# Home Automation - UI
This server is the gateway to the front-end html, css, javascript, images and more.
It validates the user's token and sends back the required files.
The front-end uses [AngularJS][angular-url], [ionic][ionic-url], [pug (previously jade)][pug-url] and [stylus][stylus-url].

[![JavaScript Style Guide][standard-image]][standard-url]

I suggest you first [read][overview-url] about the different components of the home automation application.  
This will help you understand better the general architecture and different functions of the system.

## Installation instructions
Click [here][server-installation-instruction-url] and follow the installation instructions for the server micro-service, before moving to the next step.

## Environment variables (configuration)
__AUTH\_PUBLIC\_KEY__ (required): content of auth server's publickey.  
__NODE\_ENV__ (required): set up the running environment.  Default: `production`.  `production` will enforce encryption using SSL and other security mechanisms.  
__PORT__ (required): server's port.  default: `3002`  
__ALARM\_URL__ (required): url to the [alarm system][alarm-url] server.  Default: `//localhost:3002`  
__CAMERA\_URL__ (required): url to the [camera][camera-url] server.  Default: `//localhost:3007`  
__GARAGE\_URL__ (required): url to the [garage][garage-url] server.  Default: `//localhost:3003`  
__LOGIN\_URL__ (required): url to the [authentication][auth-url] server.  Default: `//localhost:3001`  
__PUSH\_URL__ (required): url to the [push][push-url] server.  Default: `//localhost:3005`  
__STORAGE\_URL__ (required): url to the [storage][storage-url] server.  Default: `//localhost:3006`

### License
[AGPL-3.0](https://spdx.org/licenses/AGPL-3.0.html)

### Author
[Oron Nadiv](https://github.com/OronNadiv) ([oron@nadiv.us](mailto:oron@nadiv.us))

[dependencies-image]: https://david-dm.org/OronNadiv/home-automation-ui/status.svg
[dependencies-url]: https://david-dm.org/OronNadiv/home-automation-ui
[dependencies-dev-image]: https://david-dm.org/OronNadiv/home-automation-ui/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/OronNadiv/home-automation-ui?type=dev
[travis-image]: http://img.shields.io/travis/OronNadiv/home-automation-ui.svg?style=flat-square
[travis-url]: https://travis-ci.org/OronNadiv/home-automation-ui
[coveralls-image]: http://img.shields.io/coveralls/OronNadiv/home-automation-ui.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/OronNadiv/home-automation-ui
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com

[angular-url]: https://angularjs.org
[ionic-url]: http://ionicframework.com
[pug-url]: http://jade-lang.com
[stylus-url]: http://stylus-lang.com

[overview-url]: https://oronnadiv.github.io/home-automation
[client-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-raspberry-pi-clients
[server-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-server-micro-services
[private-public-keys-url]: https://oronnadiv.github.io/home-automation/#generating-private-and-public-keys

[alarm-url]: https://github.com/OronNadiv/alarm-system-api
[auth-url]: https://github.com/OronNadiv/authentication-api
[camera-url]: https://github.com/OronNadiv/camera-api
[garage-url]: https://github.com/OronNadiv/garage-door-api
[notifications-url]: https://github.com/OronNadiv/notifications-api
[push-url]: https://github.com/OronNadiv/push-api
[storage-url]: https://github.com/OronNadiv/storage-api
[ui-url]: https://github.com/OronNadiv/home-automation-ui
[ui-react-url]: https://github.com/OronNadiv/home-automation-ui-react
