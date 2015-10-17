// -*- Mode: HTML; tab-width: 2; indent-tabs-mode: nil; -*-

angular.module('starter')
  .controller('GeoCtrl', function($cordovaGeolocation) {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude
        var lng = position.coords.longitude
      }, function(err) {
        // error
      });
  });


