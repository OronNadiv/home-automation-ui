'use strict'

require('../factories/garage_states')
require('../factories/garage_toggles')
require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('GarageCtrl',
    function ($window, $scope, $ionicPopup, $timeout,
              GarageStates, GarageToggles, me, socketIO) {
      $scope.me = me
      $scope.io = socketIO(me)
      function processDoorState (state) {
        state.localTimeFormatted = moment.utc(state.created_at).local().format('l h:mm:ss A')
        state.stateFormatted = state.is_open ? 'Open' : 'Close'
        return state
      }

      function refreshRecentDoorStates () {
        GarageStates.getRecent().$promise
          .then(function (recentDoorStates) {
            $scope.recentDoorStates = _.map(recentDoorStates || [], processDoorState)
          })
          .catch(function (err) {
            console.error('Error: While fetching recentDoorStates.  err: ', err)
            if (!$scope.recentDoorStates) {
              $scope.recentDoorStates = []
            }
          })
      }

      $scope.io.socket.on('connect', $scope.io.connect.bind(undefined, $scope.io.socket))
      $scope.io.socket.on('authenticated', $scope.io.authenticated.bind(undefined, refreshRecentDoorStates))
      $scope.io.socket.on('authenticated', $scope.io.socket.emit.bind($scope.io.socket, 'join', ['garage-doors']))
      $scope.io.socket.on('unauthorized', $scope.io.unauthorized)
      $scope.io.socket.on('disconnect', $scope.io.disconnect)
      $scope.io.socket.on('error', $scope.io.error)

      $scope.io.socket.on('STATE_CREATED', function (state) {
        console.log('on STATE_CREATED called. state:', state)
        $scope.recentDoorStates.unshift(processDoorState(state))
      })

      $scope.changeDoorStateClicked = function () {
        var isClosed = $scope.recentDoorStates.length && !$scope.recentDoorStates[0].is_open

        function changeDoorState () {
          GarageToggles.changeDoorState().$promise
            .then(function () {
              var alertPopup = $ionicPopup.alert({
                title: 'Done',
                template: isClosed ? 'Request to open the door has been sent' : 'Request to close the door has been sent'
              })

              $timeout(function () {
                alertPopup.close()
              }, 4000)
            })
        }

        changeDoorState()
      }
      refreshRecentDoorStates()
    }
  )
