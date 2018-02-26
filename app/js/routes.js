/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider);

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];

    function RouteHelpersProvider(APP_REQUIRES) {

        /* jshint validthis:true */
        return {
            // provider access level
            basepath: basepath,
            resolveFor: resolveFor,
            // controller access level
            $get: function() {
                return {
                    basepath: basepath,
                    resolveFor: resolveFor
                };
            }
        };

        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for (var i = 0, len = _args.length; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg === 'function')
                            return promise.then(_arg);
                        else
                            return promise.then(function() {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load(whatToLoad);
                            });
                    }
                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (APP_REQUIRES.modules)
                            for (var m in APP_REQUIRES.modules)
                                if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                                    return APP_REQUIRES.modules[m];
                        return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
                    }

                }]
            };
        } // resolveFor

    }


})();


/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        // $locationProvider.html5Mode(false);
        $locationProvider.html5Mode(false).hashPrefix('');
        // defaults to dashboard
        $urlRouterProvider.otherwise('/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
        // .state('page', {
        //       url: '',
        //       templateUrl: 'app/pages/page.html',
        //       resolve: helper.resolveFor('modernizr', 'icons'),
        //       controller: ['$rootScope', function($rootScope) {
        //           $rootScope.app.layout.isBoxed = false;
        //       }]
        //   })
            .state('main', {
                url: '',
                abstract: true,
                resolve: helper.resolveFor('modernizr', 'icons', 'moment', 'ngDialog', 'toaster'),
                controller: 'mainController'
            })
            .state('login', {
                url: '/login',
                title: 'Login',
                resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit'),
                templateUrl: 'app/pages/login.html'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                resolve: helper.resolveFor('modernizr', 'inputmask', 'ngDialog', 'icons', 'animo', 'toaster', 'loaders.css', 'spinkit', 'easypiechart')
                    // 'fastclick','screenfull','sparklines', 'slimscroll', 'easypiechart','whirl',
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html'),
                resolve: helper.resolveFor('ngDialog', 'easypiechart', 'flot-chart', 'flot-chart-plugins', 'ui.calendar')
            })
            .state('app.customers', {
                url: '/customers',
                templateUrl: helper.basepath('customers.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.verifiedArtists', {
                url: '/verifiedArtists',
                templateUrl: helper.basepath('verifiedArtists.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.artistProfile', {
                url: '/artistProfile',
                templateUrl: helper.basepath('artistProfile.html'),
                resolve: helper.resolveFor('uiCropper')
            })
            .state('app.unverifiedArtists', {
                url: '/unverifiedArtists',
                templateUrl: helper.basepath('unverifiedArtists.html'),
                resolve: helper.resolveFor('datatables', 'uiCropper')
            })
            .state('app.artistBank', {
                url: '/artistBank',
                templateUrl: helper.basepath('artistBank.html'),
                resolve: helper.resolveFor('ui.select')
            })
            .state('app.areas', {
                url: '/areas',
                templateUrl: helper.basepath('areas.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.cancelledBookings', {
                url: '/cancelledBookings',
                templateUrl: helper.basepath('cancelledBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.finishedBookings', {
                url: '/finishedBookings',
                templateUrl: helper.basepath('finishedBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.ongoingBookings', {
                url: '/ongoingBookings',
                templateUrl: helper.basepath('ongoingBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.paidBookings', {
                url: '/paidBookings',
                templateUrl: helper.basepath('paidBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.tbaBookings', {
                url: '/tbaBookings',
                templateUrl: helper.basepath('tbaBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.upcomingBookings', {
                url: '/upcomingBookings',
                templateUrl: helper.basepath('upcomingBookings.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.order', {
                url: '/order',
                templateUrl: helper.basepath('order.html'),
                resolve: helper.resolveFor('datatables', 'ui.sortable')
            })
            .state('app.categories', {
                url: '/categories',
                templateUrl: helper.basepath('categories.html'),
                resolve: helper.resolveFor('datatables', 'uiCropper')
            })
            .state('app.services', {
                url: '/services',
                templateUrl: helper.basepath('catServices.html'),
                resolve: helper.resolveFor('datatables', 'uiCropper')
            })
            .state('app.additionalServices', {
                url: '/additionalServices',
                templateUrl: helper.basepath('additionalServices.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.astypes', {
                url: '/astypes',
                templateUrl: helper.basepath('astypes.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.skills', {
                url: '/skills',
                templateUrl: helper.basepath('skills.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.feedback', {
                url: '/feedback',
                templateUrl: helper.basepath('feedback.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.promo', {
                url: '/promo',
                templateUrl: helper.basepath('promo.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.profile', {
                url: '/profile',
                templateUrl: helper.basepath('customerProfile.html'),
                resolve: helper.resolveFor('uiCropper')
            })

    }
})();