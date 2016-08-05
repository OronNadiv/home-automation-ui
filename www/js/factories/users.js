'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('Users',
    function ($resource, $window) {
      var methods = {
        me: {
          method: 'GET',
          isArray: false,
          params: {id: 'me'}
        },
        get: {
          method: 'GET',
          isArray: false
        },
        getAll: {
          method: 'GET',
          isArray: true
        },
        patch: {
          method: 'PATCH',
          isArray: false
        }
      }
      console.log('$window.LOGIN_URL:', $window.LOGIN_URL)
      return $resource($window.LOGIN_URL + '/users/:id', {id: '@id'}, methods)
    }
  )

