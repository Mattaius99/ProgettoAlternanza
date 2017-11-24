angular.module('starter.controllers',['ngStorage'])

.factory('Guasti',function (){
  var guasti = {};
  return {
    getGuasti: function (){
      return guasti;
    },
    setGuasti: function(param){
      guasti = param;
    }
  }
})

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

.factory('Salvataggio',function (){
  var salvataggio = {};
  return {
    getSalvataggio: function (){
      return salvataggio;
    },
    setSalvataggio: function(param){
      salvataggio = param;
    }
  }
})

.service('ModalService', function($ionicModal, $rootScope) {

  var init = function($scope) {

    var promise;
    $scope = $scope || $rootScope.$new();

    promise = $ionicModal.fromTemplateUrl('templates/login.html',
      {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.openModal = function() {
       $scope.modal.show();
     };
     $scope.closeModal = function() {
       $scope.modal.hide();
     };
     $scope.$on('$destroy', function() {
       $scope.modal.remove();
     });

    return promise;
  }

  return {
    init: init
  }

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, ModalService, $localStorage,Salvataggio) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
//  });

  $scope.voceMenu = $localStorage.save;
  if($localStorage.save != null)
  {
      $scope.benvenuto = $localStorage.save[0].user;
  }
  else {
      $scope.benvenuto = "";
  }


  $scope.showLogin = function(){
       if(typeof $rootScope.isAuthenticated == 'undefined' || !isAuthenticated ){
          ModalService
            .init($scope)
            .then(function(modal) {
              modal.show();
            });
        }
  }

    $scope.endLogin = function(){
      // $rootScope.isAuthenticated = null;
       if($scope.voceMenu != null)
       {
         $scope.$storage = $localStorage.$reset({
         save : Salvataggio.getSalvataggio(),
         save : null
     });
      location.replace("#/app/home");
       }
       else {
         $scope.showLogin();
          // $scope.modal.show();
       }



    // }

  }
  $scope.hideLogin = function(){
      console.log("nascondo login");
          $scope.closeModal();
  }

  $scope.changePage = function(){
      window.location.replace("#/app/registrazione");
      history.go(0);
  }

  $scope.openPersonale = function() {
    console.log($scope.benvenuto);
    if($scope.benvenuto != ""){
      location.replace("#/app/areaPersonale/"+$scope.benvenuto);
    }else {
      location.replace("#/app/login");
    }
  }
})

.controller('HomeCtrl', function($scope,$http,Guasti,Comuni,$timeout) {

  var link="http://segnalazioneguasti.altervista.org/select.php";
  $scope.guasti = null;

  //chiamata al server per ottenere i guasti
  $http.get(link,{
    params:{
      t:'Guasto'
    }
  }).then(function(response){
    //passsaggio dati alla factory
    Guasti.setGuasti(response.data.Guasto);
    $scope.guasti=response.data.Guasto;
  }).catch(function(error){
    console.log(error);
  });

  //utilizzo file json contenente comuni
  $http.get('./json/comuni.json')
      .success(function (data) {
          // The json data will now be in scope.
          $scope.comuni = data;
          Comuni.setComuni($scope.comuni);
  });

  //funzione di refresh della pagina principale
  $scope.doRefresh = function() {
      $timeout( function() {
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
      window.location.replace();
  };

  //funzione scroll to top della pagina principale
  scrollFunction = function() {
    if (SearchContent.scrollTop > 10) {
        document.getElementById("scrollToTop").style.display = "block";
    } else {
        document.getElementById("scrollToTop").style.display = "none";
    }
  }
})

.controller('DettaglioCtrl', function($scope, $stateParams, $http, Guasti, Comuni) {

  $scope.guasti = Guasti.getGuasti();
  $scope.idComune=null;
  $scope.posizione=null;

  //controllo posizione del guasto
  for(var i=0;i<$scope.guasti.length;i++){
     $scope.idGuasto=$scope.guasti[i].id_Guasto;
     if($stateParams.guastoId===$scope.idGuasto){
       $scope.posizione=i;
       $scope.idComune=$scope.guasti[$scope.posizione].id_comune;
     }
  }


  $scope.comune = Comuni.getComuni();
  //controllo posizione comune
  for(var i=0;i<$scope.comune.length;i++){
    if($scope.comune[i].codice===$scope.idComune){
      $scope.posizione_comune=i;
      break;
    }
  }

  //urgenza
  for(var i=0;i<$scope.guasti.length;i++){
    $scope.idGuasto=$scope.guasti[i].id_Guasto;
    if($stateParams.GuastoId===$scope.idGuasto){
      switch($scope.guasti[i].urgenza) {
        case "1":
          $scope.urgenza_color="display:inline;border-style: solid;border-width: 2px;border-radius: 12px;border-color: #408000;background-color: #408000;";//bassa
        break;
        case "2":
          $scope.urgenza_color="display:inline;border-style: solid;border-width: 2px;border-radius: 12px;border-color: #ffff00;background-color: #ffff00;";//media
        break;
        case "3":
          $scope.urgenza_color="display:inline;border-style: solid;border-width: 2px;border-radius: 12px;border-color: #ff3300;background-color: #ff3300;";//elevata
        break;
        default:
        $scope.urgenza_color="display:inline;border-style: solid;border-width: 2px;border-radius: 12px;border-color: #999966;background-color: #999966;";//non definita
      }
    }
  }
  //risolto
  for(var i=0;i<$scope.guasti.length;i++){
    $scope.idGuasto=$scope.guasti[i].id_Guasto;
    if($stateParams.GuastoId===$scope.idGuasto){
     if($scope.guasti[i].risolto==1){
       $scope.risolto="Risolto";
       break;
     }
     else{
       $scope.risolto="In lavorazione";
       break;
     }
  }
}

  //mappa dettaglio
  $scope.indirizzo=$scope.guasti[$scope.posizione].indirizzo+"+"+$scope.comune[$scope.posizione_comune].nome;
  $scope.myMap = function(){
    $scope.indirizzo=$scope.indirizzo.split(' ').join('+');
    var link="http://maps.googleapis.com/maps/api/geocode/json?address="+$scope.indirizzo;
    $http.get(link,{

    }).then(function(response){
      var lat=response.data.results[0].geometry.location.lat;
      var lng=response.data.results[0].geometry.location.lng;
      var mapOptions = {
                  center:{lat: lat, lng: lng},
                  zoom: 16,
                  streetViewControl: false,
                  disableDefaultUI: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                  };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var marker = new google.maps.Marker({
        position:{lat: lat, lng: lng},
        map: map,
        title: 'Marker'
      });
      marker.setMap(map);
    })
  }
$scope.myMap();
})

.controller('utentiCtrl', function($scope,$http,$rootScope,ModalService) {

  if(!$rootScope.isAuthenticated || typeof $rootScope.isAuthenticated === 'undefined' ){
      ModalService
        .init($scope)
        .then(function(modal) {
          modal.show();
        });
   }
   else
   {
    var linkUtenti = "http://segnalazioneguasti.altervista.org/select.php";
    $scope.utenti = null;
    $http.get(linkUtenti,{
      params: {
        t: 'Utente'
      }
    }).then(function(response){
      $scope.utenti = response.data.Utente;
      console.log($scope.utenti);
    }).catch(function(error){
      console.log(error);
    });
    window.location.replace("#/app/utenti");
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.hideLogin = function(){
          $scope.closeModal();
  }
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

.controller('MappaCtrl', function($scope, $http, Guasti, Comuni) {

    var addresses = new Array();
    var cities = new Array();
    var guasti = Guasti.getGuasti();
    var comuni = Comuni.getComuni();
    addresses.push("Via Rocco Scotellaro, 55");
    cities.push("Lecce");
    for(i=0;i<guasti.length;i++){
      addresses.push(guasti[i].indirizzo)
      for(j=0;j<comuni.length;j++)
        if(guasti[i].id_comune === comuni[j].codice){
          cities.push(comuni[j].nome);
        }
    }
    var coordinates = new Array();
    var dist=500;
    for(i=0;i<addresses.length;i++){
      addresses[i] += " "+cities[i];
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

.controller('areaPersonaleCtrl', function($scope, $http, $stateParams){

  var linkSelect="http://segnalazioneguasti.altervista.org/select.php";

  $scope.pos = 3;
  $scope.nomeUte=$stateParams.idUte;
  $scope.utente=null;

  $http.get(linkSelect,{
    params: {
      t: 'Utente',
    }
  }).then(function(response){
    var utenti = response.data.Utente;
    for(i=0;i<utenti.length;i++)
      if($scope.nomeUte === utenti[i].username){
        $scope.utente=utenti[i];
        $scope.idUte=$scope.utente.id_utente;
      }

    document.getElementById("imgUte").src="http://segnalazioneguasti.altervista.org/images/img_users/"+$scope.utente.img;
    $scope.guasti = new Array();

    $http.get(linkSelect,{
      params: {
        t: 'Guasto',
        id: $scope.idUte
      }
    }).then(function(response){
      $scope.guasti=response.data.Guasto;
      show();
    });
  });

  show = function(par, direction) {
    $scope.guastiTmp = new Array();
    if(direction == 1 && $scope.guasti != null && $scope.guasti.length >= $scope.pos){
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

  $scope.openMap = function(index) {
    var path="./json/comuni.json";
    var address=$scope.guasti[index].indirizzo;
    address=address.replace(' ','+');
    $http.get('./json/comuni.json').success(function(data){
      $scope.comuni = data;
      for(i=0;i<$scope.comuni.length;i++){
        if($scope.comuni[i].codice == $scope.guasti[index].id_comune){
          var city=$scope.comuni[i].nome.split(" ").join("+");
          address+="+"+city;
          break;
        }
      }
      var geoString = '';
      if(ionic.Platform.isIOS()) {
        geoString = 'maps://?q='+address;
      }
      else if(ionic.Platform.isAndroid()) {
        geoString = 'geo://?q='+address;
      }
      window.open(geoString, '_system');
    });
  }

  cambia=function() {
    form.submit();
  }
})
