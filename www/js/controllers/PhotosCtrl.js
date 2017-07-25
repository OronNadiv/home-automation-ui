'use strict'

require('../factories/cameras')
require('../factories/files')
require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('PhotosCtrl',
    function ($window, $scope, $ionicActionSheet, $ionicPopup, $timeout,
      Cameras, Files, me, socketIO) {
      $scope.me = me
      $scope.io = socketIO(me)
      function processImage (image) {
        var name = image.name
        var index1 = name.indexOf('-')
        var index2 = name.indexOf('.')
        var time = parseInt(name.substr(index1 + 1, index2 - index1 - 1))
        image.time = time
        image.localTimeFormatted = moment(time).format('dddd, MMMM D, gggg h:mm:ss A')
        return image
      }

      function fetchImages () {
        Files.getRecent().$promise
          .then(function (files) {
            $scope.slides = _.map(files || [], processImage)
          })
      }

      function takePhotos (options) {
        Cameras.takePhotos(options)
          .$promise
          .then(function () {
            var alertPopup = $ionicPopup.alert({
              title: 'Done',
              template: 'Request to take photo(s) has been sent'
            })

            $timeout(function () {
              alertPopup.close()
            }, 4000)
          })
      }

      function takePhotosDuration (minutes) {
        takePhotos({duration: moment.duration(minutes, 'minutes')})
      }

      function takePhotosCount (count) {
        takePhotos({count: count})
      }

      $scope.takePhotos = function () {
        var buttons = [
          {text: 'Once'},
          {text: 'For 1 Minute'},
          {text: 'For 5 Minute'},
          {text: 'For 10 Minute'},
          {text: 'For 15 Minute'},
          {text: 'For 30 Minute'}
        ]
        $ionicActionSheet.show({
          buttons: buttons,
          titleText: 'Take Photo(s)',
          cancelText: 'Cancel',
          cancel: function () {
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                takePhotosCount(1)
                return true
              case 1:
                takePhotosDuration(1)
                return true
              case 2:
                takePhotosDuration(5)
                return true
              case 3:
                takePhotosDuration(10)
                return true
              case 4:
                takePhotosDuration(15)
                return true
              case 5:
                takePhotosDuration(30)
                return true
            }
          }
        })
      }

      if (me.is_trusted) {
        $scope.io.socket.on('connect', $scope.io.connect.bind(undefined, $scope.io.socket))
        $scope.io.socket.on('authenticated', $scope.io.authenticated.bind(undefined, fetchImages))
        $scope.io.socket.on('authenticated', $scope.io.socket.emit.bind($scope.io.socket, 'join', ['storage']))
        $scope.io.socket.on('unauthorized', $scope.io.unauthorized)
        $scope.io.socket.on('disconnect', $scope.io.disconnect)
        $scope.io.socket.on('error', $scope.io.error)

        $scope.io.socket.on('FILE_CREATED', function (file) {
          console.log('on FILE_CREATED called. file:', file)
          file = processImage(file)
          $scope.slides.unshift(file)
        })
      }
    }
  )
