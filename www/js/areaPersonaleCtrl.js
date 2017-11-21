angular.module('starter.controllers')

.controller('areaPersonaleCtrl', function($scope, $http, $stateParams, $window){
  var linkSelect="http://segnalazioneguasti.altervista.org/select.php";
  var linkInsert="http://segnalazioneguasti.altervista.org/insert.php";

  var today = new Date();
  var idUte = $stateParams.id_Utente;

  $scope.pos = 3;

  $scope.benvenuto = null;
  $scope.guasti = new Array();

  $http.get(linkSelect,{
    params: {
      t: 'Utente',
      id: idUte
    }
  }).then(function(response){
    $scope.benvenuto = "Ciao, " + response.data.Utente[0].nome + " " + response.data.Utente[0].cognome;
  })

  $http.get(linkSelect,{
    params: {
      t: 'Guasto'
    }
  }).then(function(response){
    $scope.guasti=response.data.Guasto;
    show();
  });

  show = function(par, direction) {
    $scope.guastiTmp = new Array();
    if(direction == 1 && $scope.guasti.length >= $scope.pos){
      $scope.pos += 3;
    }else if(direction == 0){
      $scope.pos -= 3;
    }
    if($scope.pos >= $scope.guasti.length){
      document.getElementById("frecciasu").hidden="";
      document.getElementById("frecciagiu").hidden="hidden";
    }
    if($scope.pos <= 3){
      document.getElementById("frecciasu").hidden="hidden";
      document.getElementById("frecciagiu").hidden="";
    }
    if($scope.pos < $scope.guasti.length && $scope.pos > 3){
      document.getElementById("frecciasu").hidden="";
      document.getElementById("frecciagiu").hidden="";
    }
    var cont = 0;
    for (elem in $scope.guasti) {
      if (cont < $scope.pos) {
        $scope.guastiTmp[cont]=$scope.guasti[cont];
        cont++;
      }
    }
    if(par)
      $scope.$apply();
  };

  openMap = function() {
    console.log("ok");
  }

})
