(function () {

var MainCtrl = function($rootScope, $scope, $http) {
    var main = this;

    Init();

    function Init() {
        main.loaded = false;
        $rootScope.projects = [];
        $rootScope.selectedCat = null;
        $rootScope.selectedSite = null;

        $http.get('/api/projects.js')
        .then(function successCallback(response) {
            $rootScope.projects = angular.copy(response.data.projects, []);
            main.loaded = true;
            // console.log('GetProjectData', $rootScope.projects);

        }, function errorCallback(response) {
            $rootScope.NetworkError(data, status, headers, config);
        });
    }

    main.checkAccess = function() {
        // console.log('checkAccess allowAccess', $rootScope.access);
        return $rootScope.access;
    };
};
MainCtrl.$inject = ['$rootScope', '$scope', '$http'];


var UnlockCrtl = function($rootScope, $scope, $state) {
    var vm = this;

    Init();

    function Init() {
        $rootScope.access = true;
        // console.log('UnlockCrtl allowAccess', $rootScope.access);
        $state.go('index');
    }
};
UnlockCrtl.$inject = ['$rootScope', '$scope', '$state'];


var SitesCrtl = function($rootScope, $scope, $state, $stateParams) {
    var vm = this;

    Init();

    function Init() {
        // projects
        vm.projects = $rootScope.projects;

        // category
        if ($stateParams.categoryID) {
            $rootScope.selectedCat = $stateParams.categoryID;
        } else {
            $rootScope.selectedCat = null;
        }
        vm.selectedCat = $rootScope.selectedCat;

        // project
        if ($stateParams.projectID) {
            vm.selectedSiteOption = $stateParams.projectID;
            for (var i = 0, max = vm.projects.length; i < max; i++) {
                if (vm.projects[i].project == $stateParams.projectID) {
                    $rootScope.selectedSite = vm.projects[i];
                }
            }
        } else {
            vm.selectedSiteOption = null;
            $rootScope.selectedSite = null;
        }
        vm.selectedSite = $rootScope.selectedSite;
    }

    vm.categoryClass = function(cat) {
        var ret = 'fa fa-folder-o'; // closed
        if (cat === $rootScope.selectedCat) {
            ret = 'fa fa-folder-open-o'; // opened
        }
        return ret;
    };

    vm.isCategorySelected = function(cat) {
        var ret = false;
        if (cat === $rootScope.selectedCat) {
            ret = true;
        }
        return ret;
    };

    vm.setProjectSelected = function(cat, project) {
        // console.log('setProjectSelected', cat, project);
        $state.go('sites', { 'categoryID': cat, 'projectID': project });
    };

    vm.getNumberArray = function(num) {
        return new Array(num);
    };

};
SitesCrtl.$inject = ['$rootScope', '$scope', '$state', '$stateParams'];

// Pass all functions into module
angular
.module('port')
.controller('MainCtrl', MainCtrl)
.controller('UnlockCrtl', UnlockCrtl)
.controller('SitesCrtl', SitesCrtl)
;

})();
