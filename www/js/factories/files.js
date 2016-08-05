'use strict'

require('./index')

angular.module('home-automation.factories')
  .factory('Files',
    function ($resource, $window) {
      var methods = {
        getRecent: {
          method: 'GET',
          isArray: true,
          params: {after: moment().subtract(2, 'weeks').toDate().toString()}
        }
      }
      return $resource($window.STORAGE_URL + '/files', {}, methods)
    }
  )
