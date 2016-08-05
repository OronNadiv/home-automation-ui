'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('AlarmToggles',
    function ($resource, $window) {
      var methods = {
        getRecent: {
          method: 'GET',
          params: {count: '@count'},
          isArray: true
        },
        changeAlarmState: {
          method: 'POST'
        }
      }
      return $resource($window.ALARM_URL + '/toggles', {}, methods)
    }
  )
