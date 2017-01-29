// (function () {

// directive to set title tag in main
// function bePageTitle($rootScope, $timeout) {
//     return {
//         link: function(scope, element) {
//             var listener = function(event, toState, toParams, fromState, fromParams) {
//                 // site title
//                 var title = "Jean Pierre Blanchette - Portfolio";
//                 if (toState.data) {
//                     if (toState.data.pageTitle) {
//                         title = toState.data.pageTitle + " - " + title;
//                     }
//                     if (toState.data.navbar) {
//                         $rootScope.navbar = toState.data.navbar;
//                     }
//                 }
//                 $timeout(function() {
//                     element.text(title);
//                 });
//             };
//             $rootScope.$on('$stateChangeStart', listener);
//         }
//     }
// };

// Pass all functions into module
// angular
// .module('port')
// .directive('bePageTitle', bePageTitle)
// ;

// })();
