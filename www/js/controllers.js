angular.module('starter.controllers', [])

.factory('Comuni',function(){
var comuni = {};
return{
  getComuni: function(){
    return comuni;
  },
  setComuni: function(param){
    comuni = param;
  }
}
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('guastiCtrl', function($scope, $http) {
  var link = "http://SegnalazioneGuasti.altervista.org/select.php";
  $scope.guasti = null;

  $http.get(link,{
    params: {
      t:'Guasto'
    }
  }).then(function(response){
    $scope.guasti = response.data.Guasto;
    console.log($scope.guasti);
  }).catch(function(error){
    console.log(error);
  });
})

.controller('segnalaCtrl', function($scope, $http, $rootScope, $ionicPopup) {
$rootScope.isAuthenticated = 2;

  var link = "http://SegnalazioneGuasti.altervista.org/select.php";
  $scope.tipologie = null;

  $http.get(link,{
    params: {
      t:'Tipologia'
    }
  }).then(function(response){
    $scope.tipologie = response.data.Tipologia;
    console.log($scope.tipologie);
  }).catch(function(error){
    console.log(error);
  });

  $http.get('./json/comuni.json')
        .success(function(data){
          $scope.comuni = data;
          Comuni.setComuni($scope.comuni);
        });
})

.controller('MappaCtrl', function($scope, $http) {
    var addresses = new Array(
      "Via Matino Taviano",
      "Via Corsica Taviano",
      "Via Santa Croce Taviano",
      "Via Aspromonte Taurisano"
    );
    var coordinates = new Array();
    var dist=500;
    for(i=0;i<addresses.length;i++){
      addresses[i]=addresses[i].split(' ').join('+');
      $http.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: addresses[i]
        }
      }).then(function(response){
        coordinates.push({lat: response.data.results[0].geometry.location.lat, lng: response.data.results[0].geometry.location.lng});
        var mapOptions={
          center: coordinates[0],
          zoom: 15,
          disableDefaultUI: true,
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var marker = new google.maps.Marker({
          position: coordinates[0],
          map: map
        });
        for(j=0;j<coordinates.length;j++){
          if(calcolaDistanza(coordinates[0].lat, coordinates[0].lng, coordinates[j].lat, coordinates[j].lng)<=dist){
            var marker = new google.maps.Marker({
              position: {lat: coordinates[j].lat, lng: coordinates[j].lng},
              map: map
            });
            marker.setMap(map);
          }
        }
        var radius = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              map: map,
              center: coordinates[0],
              radius: dist //metri
            });
        google.maps.event.addListener(map, 'zoom_changed', function() {
          map.setCenter(coordinates[0]);
        })
        });
      }


    calcolaDistanza = function(lt1, ln1, lt2, ln2) {
      var R = 6371e3; // raggio della Terra
      var lat1 = toRadians(lt1);
      var lat2 = toRadians(lt2);
      var diffLat = toRadians(lt2-lt1);
      var diffLng = toRadians(ln2-ln1);

      var a = Math.sin(diffLat/2) * Math.sin(diffLat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(diffLng/2) * Math.sin(diffLng/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d;
    }

    toRadians = function(x) {
      return x*Math.PI/180;
    }
})
