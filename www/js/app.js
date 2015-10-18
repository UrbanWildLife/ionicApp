"use strict";

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
        $rootScope.loc = { lng: 13.42, lat: 52.53 };
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
		    center: $rootScope.loc
	      });

    $rootScope.addPin = function placePin (location) {
        if (typeof location.type === 'undefined') {
            location.type = 'other';
        } else if (location.type === 'me') {
            var cords = {lat: location.lat, lng: location.lng},
                myMarker = new H.map.Marker(cords);
            $rootScope.map.addObject(myMarker);
        } else {
            var cords = {lat: location.lat, lng: location.lng},
                myMarker = new H.map.Marker(cords, {icon: new H.map.Icon("img/" + location.type + ".svg")});
            $rootScope.map.addObject(myMarker);
        }

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
         loc.type = 'me';
        $rootScope.addPin(loc);
        $rootScope.loc = loc;
      });
    })
    .controller('LocationsCtrl', function($scope, $http, $state) {
        $http.get('http://localhost:1337/locations').then(function SuccessCb(data) {
            $scope.populatePins(data.data);
            console.debug('Successfuly fetched locations', data);
        }, function errorCallback(data) {
            console.debug('Backend error', data);
        });

        $scope.populatePins = function populatePins(locations) {
            angular.forEach(locations, $scope.addPin);
        };

        $scope.goToAddLocation = function goToAddLocation() {
          $state.go("addLocation");
        };
    })
    .controller('LocationCtrl', function($scope) {
        //Single location

    })
    .controller('AddLocationCtrl', function($scope, $http, $state, $cordovaToast) {
        $scope.forms = $scope.forms || {};
        console.debug($scope.forms.selected, $state.current);
        window.scope = $scope;
        if ($scope.forms.selected && $state.current.name === 'addLocation.description') {
            $state.go('addLocation');
        }

        $scope.animals = [
            'cow',
            'cat',
            'oak',
            'bat',
            'bird',
            'deer',
            'dog',
            'elephant',
            'turtle',
            'rabbit',
            'sheep',
            'fish',
            'other'
        ];

        $scope.saveLocation = function saveLocation() {
            var payload = angular.copy($scope.loc);
            payload.type = $scope.forms.selected;
            payload.description = $scope.forms.description;

            $http.post('http://localhost:1337/locations', payload).then(function(success){
                try{
                    $cordovaToast.show('Saved!', 'long', 'center', function(data) {
                        console.debug(data);
                    }, function(data) {
                        console.debug(data);
                    });
                } catch(e){
                    alert('success!');
                }
                $state.go('locations');
            });
        }
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
            .state('addLocation', {
                    url: '/addLocation',
                views: {
                    '@': {
                        templateUrl: 'templates/addLocation.html',
                        controller: 'AddLocationCtrl'
                    }
                }
            })
            .state('addLocation.description', {
                url: '/addLocationDescription',
                views: {
                    '@': {
                        templateUrl: 'templates/addLocationDescription.html'
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
