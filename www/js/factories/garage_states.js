'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('GarageStates',
    function ($resource, $window) {
      var methods = {
        getRecent: {
          method: 'GET',
          params: {count: '@count'},
          isArray: true
        }
      }
      return $resource($window.GARAGE_URL + '/states', {}, methods)
    }
  )
