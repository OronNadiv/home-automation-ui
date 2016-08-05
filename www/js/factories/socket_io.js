'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('socketIO',
    function ($cookies, $window) {
      return function (me) {
        var suffix = me.is_trusted ? '-trusted' : ''
        var url = $window.PUSH_URL + '/' + me.group_id + suffix
        console.log('url:', url)

        return {
          connect: function (socket) {
            console.log('connect called.  Connected to server.  socket:', !!socket)
            var token = $cookies.get('XSRF-TOKEN')
            console.log('Emitting token.  Token:', !!token)
            socket.emit('authenticate', {token: token})
          },

          authenticated: function (callback) {
            console.log('authenticated called.')
            if (callback) {
              callback()
            }
          },

          unauthorized: function (err) {
            console.log('unauthorized called.  err:', err)
            $window.location.href = $window.LOGIN_URL
          },

          error: function (err) {
            console.log('error called.  err:', err)
            // $window.location.href = $window.LOGIN_URL;
          },

          disconnect: function () {
            console.log('disconnect called.  Disconnected from server.')
          },

          socket: io.connect(url)
        }
      }
    })
