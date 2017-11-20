angular.module('starter.controllers')

.controller('segnalaCtrl', function($scope, $http) {
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

  var link = "http://SegnalazioneGuasti.altervista.org/select.php";
  $scope.comuni = null;

  $http.get(link,{
    params: {
      t:'Comune'
    }
  }).then(function(response){
    $scope.comuni = response.data.Comune;
    console.log($scope.comuni);
  }).catch(function(error){
    console.log(error);
  });
})
