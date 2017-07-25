'use strict'

require('../factories/users')
require('./index')

angular.module('home-automation.controllers')
  .controller('UserCtrl',
    function ($scope, $ionicActionSheet, $ionicPopup,
      Logins, user) {
      $scope.user = user

      $scope.changeRole = function () {
        var buttons = [
          {text: 'Regular'},
          {text: 'Trusted'},
          {text: 'Administrator'}
        ]
        if ($scope.user.role === 'owner') {
          // owner cannot be changed, even by the owner.
          return
        }
        $ionicActionSheet.show({
          buttons: buttons,
          titleText: 'Modify User\'s Role',
          cancelText: 'Cancel',
          cancel: function () {
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                $scope.user.role = 'regular'
                return true
              case 1:
                $scope.user.role = 'trusted'
                return true
              case 2:
                $scope.user.role = 'admin'
                return true
              case 3:
                $scope.user.role = 'owner'
                return true
            }
          }
        })
      }

      var handler = $scope.$watch(function () {
        return user
      }, function (newVal, oldVal) {
        if (!newVal || !oldVal || (
          newVal.name === oldVal.name &&
          newVal.email === oldVal.email &&
          newVal.is_active === oldVal.is_active &&
          newVal.role === oldVal.role)) {
          return
        }
        newVal.$patch().then(function (res) {
          console.log(res)
          _.extend(newVal, res)
        })
      }, true)
      $scope.$on('$destroy', function () {
        if (handler) {
          handler()
          handler = null
        }
      })

      $scope.changePassword = function () {
        $scope.data = {password1: '', password2: ''}
        var popup = $ionicPopup.show({
          templateUrl: '/templates/change-password.html',
          title: 'Change Password',
          subTitle: '',
          scope: $scope,
          buttons: [
            {text: 'Cancel'},
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function (e) {
                if (!$scope.data.password1 || $scope.data.password1 !== $scope.data.password2) {
                  e.preventDefault()
                } else {
                  new Logins({password: $scope.data.password1})
                    .$patch({id: user.login_id})
                    .then(function () {
                      popup.close()
                    })
                    .catch(console.error)
                }
              }
            }
          ]
        })
      }
    }
  )
