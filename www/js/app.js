// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
  url: '/app',
  abstract: true,
  templateUrl: 'templates/menu.html',
  controller: 'AppCtrl'
})

.state('app.segnala', {
  url: '/segnala',
  views: {
    'menuContent': {
      templateUrl: 'templates/segnala.html',
      controller: 'segnalaCtrl'

    }
  }
})

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

.state('app.mappa', {
  url: '/mappa',
  views: {
    'menuContent': {
      templateUrl: 'templates/mappa.html',
      controller: 'MappaCtrl'
    }
  }
})

  .state('app.registrazione', {
    url: '/registrazione',
    views: {
      'menuContent': {
        templateUrl: 'templates/registrazione.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

    .state('app.utenti', {
      url: '/utenti',
      views: {
        'menuContent': {
          templateUrl: 'templates/utenti.html',
          controller: 'utentiCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/dettaglio/:guastoId',
      views: {
        'menuContent': {
          templateUrl: 'templates/dettaglio.html',
          controller: 'DettaglioCtrl'
        }
      }
    })

    .state('app.double', {
      url: '/areaPersonale/:idUte',
      views: {
        'menuContent': {
          templateUrl: 'templates/areaPersonale.html',
          controller: 'areaPersonaleCtrl'
        }
      }
    })

  .state('app.dettaglio', {
    url: '/dettaglio',
    views: {
      'menuContent': {
        templateUrl: 'templates/dettaglio.html',
        controller: 'DettaglioCtrl'               //Aggiunto il 16/11/2017
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
