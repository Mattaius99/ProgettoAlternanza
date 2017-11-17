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
  $scope.tipologie = {};
  $scope.comuni = {};
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

  function seleziona(tab, lim) {
    $http.get(linkSelect,{
      params: {
        t: tab
      }
    }).then(function(response){
      switch(tab){
        case 'Guasto':
          if(response.data.Guasto.length > lim && lim != 0){
            for(cont=0; cont < lim; cont++, pos++){
                $scope.guasti[cont]=response.data.Guasto[pos];
            }
          }else{
            $scope.guasti=response.data.Guasto;
          }
          break;
        case 'Tipologia':
          if(response.data.Tipologia.length > lim && lim != 0){
            for(cont=0; cont < lim; cont++, pos++){
                $scope.tipoliogie[cont]=response.data.Tipologia[pos];
            }
          }else{
            $scope.tipologie=response.data.Tipologia;
          }
          break;
          case 'Comune':
            if(response.data.Comune.length > lim && lim != 0){
              for(cont=0; cont < lim; cont++, pos++){
                  $scope.comuni[cont]=response.data.Comune[pos];
              }
            }else{
              $scope.comuni=response.data.Comune;
            }
            break;
        }
    })
  }

  seleziona('Guasto',3);
  seleziona('Tipologia',0);
  seleziona('Comune',0);

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
