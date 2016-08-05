'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('GarageToggles',
    function ($resource, $window) {
      var methods = {
        changeDoorState: {
          method: 'POST'
        }
      }
      return $resource($window.GARAGE_URL + '/toggles', {}, methods)
    }
  )
