angular.module('starter.controllers')

.controller('areaPersonaleCtrl', function($scope, $http, $stateParams, $window){
  var linkSelect="http://segnalazioneguasti.altervista.org/select.php";
  var linkInsert="http://segnalazioneguasti.altervista.org/insert.php";

  var numSegnalazioni = 3;

  var today = new Date();
  var idUte = $stateParams.id_Utente;
  var cont = 0;

  $scope.pos = 3;
  $scope.next = true;

  $scope.benvenuto = null;
  $scope.guasti = new Array();
  $scope.tipologie = new Array();
  $scope.comuni = new Array();
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

  seleziona = function(tab, lim) {
    console.log(lim);
    $scope.guasti = new Array();
    var tmp = 0;
    $http.get(linkSelect,{
      params: {
        t: tab
        //id: '15'
      }
    }).then(function(response){
      switch(tab){
        case 'Guasto':
          if(response.data.Guasto.length > lim && lim > 0){
            for(cont=0; cont < lim; cont++, tmp++){
              if(response.data.Guasto[tmp] != null){
                $scope.guasti[cont]=response.data.Guasto[tmp];
              }else{
                break;
              }
            }
          }else{
            $scope.guasti=response.data.Guasto;
          }
          $scope.pos += tmp;
          break;
        case 'Tipologia':
          if(response.data.Tipologia.length > lim && lim > 0){
            for(cont=0; cont < lim; cont++, tmp++){
              if(response.data.Guasto[tmp] != null){
                $scope.tipoliogie[cont]=response.data.Tipologia[tmp];
              }else{
                break;
              }
            }
          }else{
            $scope.tipologie=response.data.Tipologia;
          }
          break;
          case 'Comune':
            if(response.data.Comune.length > lim && lim > 0){
              for(cont=0; cont < lim; cont++, tmp++){
                if(response.data.Guasto[tmp] != null){
                  $scope.comuni[cont]=response.data.Comune[tmp];
                }else{
                  break;
                }
              }
            }else{
              $scope.comuni=response.data.Comune;
            }
            break;
        }
    })
  }

  freccia = function() {
    if($scope.guasti.lenght <= $scope.pos) {
      console.log("next");
      document.getElementById("freccia").src="http://segnalazioneguasti.altervista.org/images/freccia_giu.png";
      $scope.next = true;
    }else{
      document.getElementById("freccia").src="http://segnalazioneguasti.altervista.org/images/freccia_su.png";
      $scope.next = false;
    }
    if($scope.next){
      $scope.pos += 3;
      seleziona('Guasto', $scope.pos);
    }else{
      $scope.pos -= 3;
      seleziona('Guasto', $scope.pos);
    }
  }

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

  }

  };

  seleziona('Guasto',numSegnalazioni);
  seleziona('Tipologia',0);
  seleziona('Comune',0);

});
