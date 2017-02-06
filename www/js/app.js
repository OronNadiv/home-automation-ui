/* global cordova, StatusBar */
'use strict'

require('./factories/**/*.js', {mode: 'expand'})
require('./directives/**/*.js', {mode: 'expand'})
require('./controllers/**/*.js', {mode: 'expand'})

angular.module('home-automation', [
  'home-automation.controllers',
  'home-automation.directives',
  'home-automation.factories',
  'ionic'
])
  .run(function ($ionicPlatform, $cookies, $interval, $window, $http) {
    /* eslint-disable no-undef */
    $window.ALARM_URL = process.env.ALARM_URL || '//localhost:3002'
    $window.CAMERA_URL = process.env.CAMERA_URL || '//localhost:3007'
    $window.GARAGE_URL = process.env.GARAGE_URL || '//localhost:3003'
    $window.LOGIN_URL = process.env.LOGIN_URL || '//localhost:3001'
    $window.PUSH_URL = process.env.PUSH_URL || '//localhost:3005'
    $window.STORAGE_URL = process.env.STORAGE_URL || '//localhost:3006'
    /* eslint-enable no-undef */

    $interval(function () {
      var token = $cookies.get('XSRF-TOKEN')
      if (!token) {
        $window.location.href = $window.LOGIN_URL
      }
    }, 10000)

    $http({
      method: 'GET',
      url: $window.ALARM_URL + '/ping'
    })
    $http({
      method: 'GET',
      url: $window.CAMERA_URL + '/ping'
    })
    $http({
      method: 'GET',
      url: $window.GARAGE_URL + '/ping'
    })
    $http({
      method: 'GET',
      url: $window.LOGIN_URL + '/ping'
    })
    $http({
      method: 'GET',
      url: $window.PUSH_URL + '/ping'
    })
    $http({
      method: 'GET',
      url: $window.STORAGE_URL + '/ping'
    })

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault()
      }
    })
  })
  .factory('authInterceptor', function ($q, $window) {
    return {
      responseError: function (err) {
        if (err.status === 401) {
          console.log('Unauthenticated. err: ', err)
          $window.location.href = $window.LOGIN_URL
          return $q.reject(err)
        }
        if (err.status < 100 || err.status === 408 || err.status >= 500) {
          console.error('Unexpected error. err: ', err)
          // $ionicPopup.alert({
          //  title: 'Connectivity issues',
          //  template: 'Oops! Something went wrong.'
          // });
        }
      }
    }
  })
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true
    $httpProvider.interceptors.push('authInterceptor')
  }])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        controller: 'TabsCtrl',
        templateUrl: '/templates/tabs.html',
        url: '',
        resolve: {
          me: function (Users) {
            return Users.me().$promise
          }
        }
      })

      // .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
      //  $ionicConfigProvider.tabs.position('bottom'); // other values: top
      //  $ionicConfigProvider.tabs.style('standard'); // other values: top
      // }])

      .state('tab.garage', {
        url: '^/garage',
        views: {
          'tab-garage': {
            templateUrl: 'templates/garage.html',
            controller: 'GarageCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.alarm', {
        url: '^/alarm',
        views: {
          'tab-alarm': {
            templateUrl: '/templates/alarm.html',
            controller: 'AlarmCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.alarmAcks', {
        views: {
          'tab-alarm': {
            templateUrl: '/templates/alarm-acks.html',
            controller: 'AlarmAcksCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.alarmMotions', {
        views: {
          'tab-alarm': {
            templateUrl: '/templates/alarm-motions.html',
            controller: 'AlarmMotionsCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.alarmToggles', {
        views: {
          'tab-alarm': {
            templateUrl: '/templates/alarm-toggles.html',
            controller: 'AlarmTogglesCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.photos', {
        url: '^/photos',
        views: {
          'tab-photos': {
            templateUrl: 'templates/photos.html',
            controller: 'PhotosCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.photo', {
        url: '^/photo/:id',
        views: {
          'tab-photos': {
            templateUrl: 'templates/photo.html',
            controller: 'PhotoCtrl',
            resolve: {
              id: function ($stateParams) {
                return parseInt($stateParams.id)
              },
              me: function (Users) {
                return Users.me().$promise
              }
            }
          }
        }
      })

      .state('tab.users', {
        cache: false,
        url: '^/users',
        views: {
          'tab-users': {
            templateUrl: 'templates/users.html',
            controller: 'UsersCtrl',
            resolve: {
              me: function (Users) {
                return Users.me().$promise
              },
              users: function (Users) {
                return Users.getAll().$promise
              }
            }
          }
        }
      })

      .state('tab.user', {
        url: '^/user/:id',
        views: {
          'tab-users': {
            templateUrl: 'templates/user.html',
            controller: 'UserCtrl',
            resolve: {
              user: function ($stateParams, Users) {
                return Users.get({id: $stateParams.id}).$promise
              }
            }
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/alarm')
  })
