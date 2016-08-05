'use strict'

require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('AlarmTogglesCtrl',
    function ($scope,
              AlarmToggles, me, socketIO) {
      function processToggleEvent (event) {
        event.localTimeFormatted = moment.utc(event.created_at).local().format('l h:mm:ss A')
        return event
      }

      function fetchToggles () {
        AlarmToggles.getRecent({count: 20}).$promise
          .then(function (toggles) {
            $scope.toggles = _.map(toggles || [], processToggleEvent)
          })
      }

      $scope.me = me
      $scope.io = socketIO(me)

      $scope.io.socket.on('connect', $scope.io.connect.bind(undefined, $scope.io.socket))
      $scope.io.socket.on('authenticated', $scope.io.authenticated.bind(undefined, fetchToggles))
      $scope.io.socket.on('authenticated', $scope.io.socket.emit.bind($scope.io.socket, 'join', ['alarm-sensors']))
      $scope.io.socket.on('unauthorized', $scope.io.unauthorized)
      $scope.io.socket.on('disconnect', $scope.io.disconnect)
      $scope.io.socket.on('error', $scope.io.error)

      $scope.io.socket.on('TOGGLE_CREATED', function (toggle) {
        console.log('on TOGGLE_CREATED called. toggle:', toggle)
        $scope.toggles.push(processToggleEvent(toggle))
      })
    }
  )
