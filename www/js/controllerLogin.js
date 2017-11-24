angular.module('starter.controllers')

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

.controller('loginCtrl', function($scope,$http,$rootScope,Salvataggio,$localStorage)
{

  Salva = function()
  {
    $scope.$storage = $localStorage.$default({
    save : Salvataggio.getSalvataggio()

});
  // }

$rootScope.isAuthenticated = null;
console.log("Id controller "+ $rootScope.isAuthenticated);
};

   $scope.loginData = {};

   // $scope.register = function() {
   //       var linkRegister = "http://segnalazioneguasti.altervista.org/insert.php";
   //       // $scope.register = null;
   //       // if($scope.loginData.name1 === null || $scope.loginData.lastname === null || $scope.loginData.mail === null || $scope.loginData.username1 === null || $scope.loginData.password1 === null)
   //       // {
   //       //   linkRegister = null;
   //       //   $scope.register = null;
   //       //   console.log($scope.Utente);
   //       // }
   //       // else
   //        // {
   //         $http({
   //           url : linkRegister,
   //           method : 'POST',
   //           data: {
   //              t: 'Utente',
   //              nome: $scope.loginData.name1,
   //              cognome: $scope.loginData.lastname,
   //              email: $scope.loginData.mail,
   //              username: $scope.loginData.username1,
   //              password: $scope.loginData.password1
   //           }
   //
   //           })
   //           .then(function(response){
   //             // $scope.register = response.data.Utente;
   //             console.log($scope.Utente);
   //           }).catch(function(error){
   //             console.log(error);
   //           })
   //       // }
   //
   //     };


    $scope.doLogin = function(){
      var link = "http://segnalazioneguasti.altervista.org/login.php";
      // var accessoGuasti = "#/app/guasti"
      var key = CryptoJS.enc.Hex.parse('bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3');
      var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
      var str = $scope.loginData.username + ";" + $scope.loginData.password+ ";";
      var encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv });
      encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    console.log(encrypted);
     $http.get(link,{
       params: {
        str : encrypted
       }
     }).then(function(response){
       $scope.utenti = response.data.Utente;
       console.log(response);

     // $http({
     //     url: 'http://segnalazioneguasti.altervista.org/login.php',
     //     method: "POST",
     //     data: { str : encrypted }
     // })
     // .then(function(response) {
     //   $scope.utenti = response.data.Utente;
     //     console.log(response);
     // },
     // function(response) { // optional
     //       console.log('Failed');
     // });
       //solo se login ok

        $rootScope.isAuthenticated = null;
       $rootScope.isAuthenticated = response.data.id;
       if (response.data.id > -1 && response.data.id != null)
       {
        console.log("Entrato");
        // $rootScope.isAuthenticated = response.data.id;

         $rootScope.isAuthenticated = response.data.id;
        $localStorage.save = new Array(
          {user: response.data.username,
          password: response.data.password,
          id_User: response.data.id
        }
        );
        Salvataggio.setSalvataggio ($localStorage.save[0].user+$localStorage.save[0].password+$localStorage.save[0].id_User);
        // console.log("ID:"+$localStorage.save);
        //$rootScope.isAuthenticated = $localStorage.save[0].id_User;
        console.log("DATI:"+$localStorage.save[0].user+$localStorage.save[0].password+$localStorage.save[0].id_User);
        // $scope.voceMenu = $localStorage.save[0].user;
        console.log("Credenziali "+ $scope.loginData.username + ";" + $scope.loginData.password);

        if(document.getElementById("Ricordami").checked)
          $scope.save = Salvataggio.getSalvataggio() + $scope.Salva1;


        $scope.voceMenu = $localStorage.save;
          console.log("voce menu"+$scope.voceMenu);

        var usernameParam=$localStorage.save[0].user;

        location.replace("#/app/areaPersonale/"+usernameParam);
       }
        else
       {
          console.log("Non entrato");
          alert("Le credenziali inserite non sono corrette!");
       }
     }).catch(function(error){
       console.log(error);
     });
   };
 });
