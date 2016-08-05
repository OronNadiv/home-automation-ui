'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('Cameras',
    function ($resource, $window) {
      var methods = {
        takePhotos: {
          method: 'POST',
          isArray: false
        }
      }
      return $resource($window.CAMERA_URL + '/take', {}, methods)
    }
  )
