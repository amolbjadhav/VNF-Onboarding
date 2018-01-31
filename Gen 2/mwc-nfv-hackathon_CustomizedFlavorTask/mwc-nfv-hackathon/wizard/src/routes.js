module.exports = function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  "ngInject";

  //$locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('wizard', {
      url: '/w/',
      component: 'wizard'
    })
    .state('wizard.vnf', {
      url: 'vnf',
      component: 'vnf',
      resolve: {
        pathChanger: function (navigationService) {
          "ngInject";

          navigationService.currPath = 0;
        }
      },
    })
    .state('wizard.nic_definitions', {
      url: 'nic_definitions',
      component: 'nic',
      resolve: {
        pathChanger: function (navigationService) {
          "ngInject";

          navigationService.currPath = 1;
        }
      }
    })
    .state('wizard.scripts', {
      url: 'scripts',
      component: 'scripts',
      resolve: {
        pathChanger: function (navigationService) {
          "ngInject";

          navigationService.currPath = 2;
        }
      }
    })
    .state('wizard.summary', {
      url: 'summary',
      component: 'summary',
      resolve: {
        pathChanger: function (navigationService) {
          "ngInject";

          navigationService.currPath = 3;
        }
      }
    })
    .state('wizard.generate', {
      url: 'generate',
      component: 'generate',
      resolve: {
        pathChanger: function (navigationService) {
          "ngInject";

          navigationService.currPath = 4;
        }
      }
    });

  $urlRouterProvider.otherwise('/w/vnf');
};
