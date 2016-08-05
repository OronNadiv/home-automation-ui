'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('Logins',
    function ($resource, $window) {
      var methods = {
        patch: {
          method: 'PATCH',
          isArray: false
        }
      }
      return $resource($window.LOGIN_URL + '/:id', {id: '@id'}, methods)
    }
  )

