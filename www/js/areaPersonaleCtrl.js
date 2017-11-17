angular.module('starter.controllers')

.controller('areaPersonaleCtrl', function($scope, $http, $stateParams){
  var linkSelect="http://segnalazioneguasti.altervista.org/select.php";
  var linkInsert="http://segnalazioneguasti.altervista.org/insert.php";

  var today = new Date();
  var idUte = $stateParams.id_Utente;
  var cont = 0;
  var pos = 0;

  $scope.benvenuto = null;
  $scope.guasti = {};
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
      id: '15'
    }
  }).then(function(response){
    $scope.benvenuto = "Ciao, " + response.data.Utente[0].nome + " " + response.data.Utente[0].cognome;
  })

  function seleziona() {
    $http.get(linkSelect,{
      params: {
        t: 'Guasto'
      }
    }).then(function(response){
      if(response.data.Guasto.length > 3){
        for(cont=0; cont < 3; cont++, pos++){
            $scope.guasti[cont]=response.data.Guasto[pos];
        }
      }else{
        $scope.guasti=response.data.Guasto;
      }
    })
  }

  seleziona();

  function carica() {
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
  }
});
