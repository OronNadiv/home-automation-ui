'use strict'

require('./index')

angular.module('home-automation.controllers')
  .controller('TabsCtrl',
    function ($scope, me) {
      $scope.me = me
    }
  )
