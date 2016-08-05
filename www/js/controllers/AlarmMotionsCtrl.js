'use strict'

require('../factories/alarm_motions')
require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('AlarmMotionsCtrl',
    function ($scope,
              AlarmMotions, me, socketIO) {
      $scope.io = socketIO(me)
      function processAlarmEvent (event) {
        event.localTimeFormatted = moment.utc(event.updated_at).local().format('l h:mm:ss A')
        return event
      }

      function fetchMotions () {
        AlarmMotions.getAll().$promise
          .then(function (motions) {
            $scope.motions = _.map(motions || [], processAlarmEvent)
          })
      }

      $scope.io.socket.on('connect', $scope.io.connect.bind(undefined, $scope.io.socket))
      $scope.io.socket.on('authenticated', $scope.io.authenticated.bind(undefined, fetchMotions))
      $scope.io.socket.on('authenticated', $scope.io.socket.emit.bind($scope.io.socket, 'join', ['sirens']))
      $scope.io.socket.on('unauthorized', $scope.io.unauthorized)
      $scope.io.socket.on('disconnect', $scope.io.disconnect)
      $scope.io.socket.on('error', $scope.io.error)

      $scope.io.socket.on('MOTION_CREATED', function (motion) {
        console.log('on MOTION_CREATED called. motion:', motion)
        $scope.motions.push(motion)
      })
    }
  )
