'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('AlarmAcks',
    function ($resource, $window) {
      var methods = {
        getAll: {
          method: 'GET',
          isArray: true
        }
      }
      return $resource($window.ALARM_URL + '/acks', {}, methods)
    }
  )
