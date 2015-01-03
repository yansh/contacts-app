'use strict';

angular.module('myApp', ['ionic',
    'myApp.controllers',
    'myApp.memoryServices'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).config(['$compileProvider', function($compileProvider) {
  //http://stackoverflow.com/questions/22682770/unable-to-display-contact-photo-in-phonegap-through-angularjs
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
}])
.config(function($stateProvider, $urlRouterProvider) {
          $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
              url: "/tab",
              abstract: true,
              templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
              url: '/dash',
              views: {
                'tab-dash': {
                  templateUrl: 'templates/tab-dash.html',
                  controller: 'DashCtrl'
                }
              }
            })

            .state('tab.contacts', {
              url: '/contacts',
              views: {
                'tab-contacts': {
                  templateUrl: 'templates/tab-friends.html',
                  controller: 'ContactListCtrl'
                }
              }
            })
            .state('tab.friend-detail', {
              url: '/contacts/:contactId',
              views: {
                'tab-contacts': {
                  templateUrl: 'templates/friend-detail.html',
                  controller: 'ContactDetailCtrl'
                }
              }
            })
            .state('tab.account', {
              url: '/account',
              views: {
                'tab-account': {
                  templateUrl: 'templates/tab-account.html',
                  controller: 'AccountCtrl'
                }
              }
            });

          // if none of the above states are matched, use this as the fallback
          $urlRouterProvider.otherwise('/tab/contacts');
    });