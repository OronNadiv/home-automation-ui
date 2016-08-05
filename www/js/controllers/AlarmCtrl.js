'use strict'

require('../factories/alarm_toggles')
require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('AlarmCtrl',
    function ($scope,
              AlarmToggles, me, socketIO) {
      $scope.me = me
      $scope.io = socketIO(me)

      function refreshAlarmState () {
        AlarmToggles.getRecent({count: 1}).$promise
          .then(function (events) {
            $scope.isArmed = !!(events.length && events[0].is_armed)
          })
      }

      if (me.is_trusted) {
        $scope.io.socket.on('connect', $scope.io.connect.bind(undefined, $scope.io.socket))
        $scope.io.socket.on('authenticated', $scope.io.authenticated.bind(undefined, refreshAlarmState))
        $scope.io.socket.on('authenticated', $scope.io.socket.emit.bind($scope.io.socket, 'join', ['alarm-sensors']))
        $scope.io.socket.on('unauthorized', $scope.io.unauthorized)
        $scope.io.socket.on('disconnect', $scope.io.disconnect)
        $scope.io.socket.on('error', $scope.io.error)

        $scope.io.socket.on('TOGGLE_CREATED', function (toggle) {
          console.log('on TOGGLE_CREATED called. toggle:', toggle)
          $scope.isArmed = !!toggle.is_armed
        })

        $scope.onAlarmToggle = function (isArmed) {
          console.log('Selection changed.', isArmed)
          AlarmToggles.changeAlarmState({is_armed: isArmed}).$promise
            .then(function () {
              console.log('server updated successfully')
            })
        }
      }
      refreshAlarmState()
    }
  )
