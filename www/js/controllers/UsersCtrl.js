'use strict'

require('../factories/users')
require('./index')

angular.module('home-automation.controllers')
  .controller('UsersCtrl',
    function ($scope, $ionicPopup,
              Users, me, users) {
      $scope.users = users
      _.each($scope.users, function (user) {
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
      })

      $scope.createUser = function () {
        $scope.newUser = {
          name: '',
          email: '',
          password: '',
          password2: '',
          role: 'regular',
          is_active: true
        }
        var popup = $ionicPopup.show({
          templateUrl: '/templates/create-user.html',
          title: 'Create User',
          subTitle: '',
          scope: $scope,
          buttons: [
            {text: 'Cancel'},
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function (e) {
                $scope.newUser.name = s.trim($scope.newUser.name)
                $scope.newUser.email = s.trim($scope.newUser.email)
                if (!$scope.newUser.name || !$scope.newUser.email || !$scope.newUser.password || $scope.newUser.password !== $scope.newUser.password2) {
                  e.preventDefault()
                } else {
                  new Users($scope.newUser).$save()
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
