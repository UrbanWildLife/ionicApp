// -*- Mode: JS; tab-width: 2; indent-tabs-mode: nil; -*-
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
    .controller('Map', function($rootScope, $cordovaGeolocation) {
      // Here's to Here

	    // Initialize the platform object:
	    var platform = new H.service.Platform({
	      'app_id': '1MrIFeGNV4L6zYk9PZqB',
	      'app_code': 'tqDjDcngM5yj54XCRAYcbQ'
	    });

	    // Obtain the default map types from the platform object
	    var maptypes = platform.createDefaultLayers();

	    // Instantiate (and display) a map object:
	    $rootScope.map = new H.Map(
	      document.getElementById('mapContainer'),
	      maptypes.normal.map,
	      {
		    zoom: 12,
		    center: { lng: 13.4, lat: 52.51 }
	      });

    $rootScope.addPin = function placePin (location) {
        cords = {lat: location.lat, lng: location.lng};
        myMarker = new H.map.Marker(cords);
        $rootScope.map.addObject(myMarker);
    };

	    // Set behavior
	    $rootScope.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents($rootScope.map));

      // The location
      var posOptions = {timeout: 3000, enableHighAccuracy: true};
      $rootScope.pinCurrentPosition = function pinCurrentPosition(posCb, errCb) {
        $cordovaGeolocation.getCurrentPosition(posOptions).then(posCb, errCb);
      };

      $rootScope.pinCurrentPosition(function pinCurrentPosition1(position) {
        var loc = {lat: position.coords.latitude, lng: position.coords.longitude};
        $rootScope.map.setCenter(loc);
      });
    })
    .controller('LocationsCtrl', function($scope, $http) {
        $http.get('http://localhost:1337/locations').then(function SuccessCb(data) {
            $scope.populatePins(data.data);
            console.debug('Successfuly fetched locations', data);
        }, function errorCallback(data) {
            console.debug('Backend error', data);
        });

        $scope.populatePins = function populatePins(locations) {
            var myMarker,
                cords;
            angular.forEach(locations, $scope.addPin);
        }

    })
    .controller('LocationCtrl', function($scope) {
        //Single location

    })
    .controller('AddLocationCtrl', function($scope) {
        $scope.animals = [
            'cow',
            'cat',
            'oak',
            'bat',
            'bird',
            'deer',
            'dog',
            'elephant',
            'turlte',
            'rabbit',
            'sheep',
            'fish',
            'other'
        ];
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('search', {
                url: '/search',
                views: {
                    '@': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })
            .state('locations', {
                url: '/locations',
                views: {
                    '@': {
                        templateUrl: 'templates/locations.html',
                        controller: 'LocationsCtrl'
                    }
                }
            })
            .state('app.locations.add', {
                url: '/locations/add',
                views: {
                    '@': {
                        templateUrl: 'templates/addLocation.html',
                        controller: 'AddLocationCtrl'
                    }
                }
            })
            .state('app.locations.single', {
                url: '/location/:locationId',
                views: {
                    '@': {
                        templateUrl: 'templates/location.html',
                        controller: 'LocationCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/locations');
    });
