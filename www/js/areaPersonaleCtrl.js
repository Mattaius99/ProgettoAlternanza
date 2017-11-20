angular.module('starter.controllers')

.controller('areaPersonaleCtrl', function($scope, $http, $stateParams, $window){
  var linkSelect="http://segnalazioneguasti.altervista.org/select.php";
  var linkInsert="http://segnalazioneguasti.altervista.org/insert.php";

  var today = new Date();
  var idUte = $stateParams.id_Utente;

  $scope.pos = -3;

  $scope.benvenuto = null;
  $scope.guasti = new Array();
  $scope.tipologie = new Array();
  $scope.comuni = new Array();
  $scope.guastiTmp;
  $scope.titolo = null;
  $scope.indirizzo = null;
  $scope.descrizione = null;
  $scope.data = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  $scope.urgenza = null;
  $scope.img = null;
  $scope.idTipo = null;
  $scope.idCom = null;

  $http.get(linkSelect,{
    params: {
      t: 'Utente',
      id: '24'
    }
  }).then(function(response){
    $scope.benvenuto = "Ciao, " + response.data.Utente[0].nome + " " + response.data.Utente[0].cognome;
  })

  show = function(par) {
    var next = true;
    $scope.guastiTmp = new Array();
    if($scope.guasti.length >= $scope.pos) {
      document.getElementById("freccia").src="http://segnalazioneguasti.altervista.org/images/freccia_giu.png";
      next = true;
    }else{
      document.getElementById("freccia").src="http://segnalazioneguasti.altervista.org/images/freccia_su.png";
      next = false;
    }
    if(next){
      $scope.pos += 3;
    }else{
      $scope.pos -= 3;
    }
    var cont = 0;
    for (elem in $scope.guasti) {
      if (cont < $scope.pos) {
        $scope.guastiTmp[cont]=$scope.guasti[cont];
        cont++;
      }
    }
    $scope.pos = cont;
    if(par)
     $scope.$apply();
  };

  seleziona = function(tab) {
    $http.get(linkSelect,{
      params: {
        t: tab
      }
    }).then(function(response){
      switch(tab) {
        case 'Guasto':
          $scope.guasti=response.data.Guasto;
          show();
          break;
        case 'Tipologia':
          $scope.tipologie=response.data.Tipologia;
          break;
        case 'Comune':
          $scope.comuni=response.data.Comune;
      }
    })
    show();
  };

  carica = function() {
    $http.get(linkInsert,{
      params: {
        tabella: 'Guasto',
        titolo: $scope.titolo,
        descrizione: $scope.descrizione,
        urgenza: $scope.urgenza,
        indirizzo: $scope.indirizzo,
        risolto: '0',
        data: $scope.data,
        utente: idUte,
        tipo: $scope.idTipo,
        comune: $scope.idCom,
        img: $scope.img
      }
    })
  };

  seleziona('Guasto');
  seleziona('Tipologia');
  seleziona('Comune');
})
