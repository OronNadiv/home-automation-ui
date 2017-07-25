'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('AlarmMotions',
    function ($resource, $window) {
      /* eslint-enable no-unused-vars */
      var methods = {
        getAll: {
          method: 'GET',
          isArray: true
        }
      }
      return $resource($window.ALARM_URL + '/motions', {}, methods)
    }
  )
