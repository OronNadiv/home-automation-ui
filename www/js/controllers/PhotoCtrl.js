'use strict'

require('../factories/files')
require('../factories/socket_io')
require('./index')

angular.module('home-automation.controllers')
  .controller('PhotoCtrl',
    function ($window, $scope, id,
              Files, me, socketIO) {
      $scope.me = me
      $scope.io = socketIO(me)
      $scope.slides = []

      function processImage (image) {
        image.w = 2592
        image.h = 1944
        image.src = $window.STORAGE_URL + '/files/' + image.id
        return image
      }

      function fetchImages () {
        Files.getRecent().$promise
          .then(function (files) {
            var index = 0
            _.each(files || [], function (file, currIndex) {
              file = processImage(file)
              if (file.id === id) {
                index = currIndex
              }
              $scope.slides.push(file)
            })

            $scope.opts.index = index
            $scope.$broadcast($scope.startEvent)
          })
      }

      $scope.startEvent = 'START_GALLERY'
      $scope.opts = {history: false, galleryPIDs: false, index: 0}

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
