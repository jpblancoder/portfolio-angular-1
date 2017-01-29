(function () {

function configStates($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'view/page/about.html'
        })
        .state('unlock', {
            url: '/unlock',
            templateUrl: 'view/page/unlock.html',
            controller: 'UnlockCrtl as vm'
        })
        .state('sites', {
            url: '/sites/:categoryID/:projectID?',
            templateUrl: 'view/page/sites.html',
            controller: 'SitesCrtl as vm'
        })
        ;
}

function run($rootScope, $state) {
    $rootScope.$state = $state;
    $rootScope.access = false;

    // for ajax errors
    $rootScope.NetworkError = function(data, status, headers, config) {
        console.log("NetworkError: " + status + ", config: ", config);
    };
}

// template cache concated in via gulpfile
angular.module('templates', []);

// config and run!
angular.module('port')
.config(configStates)
.run(run);

})();
