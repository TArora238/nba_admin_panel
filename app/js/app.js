/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Version: 3.7.5
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

// APP START
// -----------------------------------

(function() {
    'use strict';

    angular
        .module('adminPanel', [
            'app.core',
            'app.routes',
            'app.mainCtrl',
            'app.dashboard',
            'app.customers',
            'app.areas',
            'app.category',
            'app.artists',
            'app.bookings',
            'app.support',
            'app.sidebar',
            'app.elements',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.icons',
            'app.flatdoc',
            'app.notify',
            'app.bootstrapui',
            'app.panels',
            'app.charts',
            'app.forms',
            'app.locale',
            'app.maps',
            'app.pages',
            'app.tables',
            'app.extras',
            'app.mailbox',
            'app.utils',
            'ngDialog',
            'toaster'
        ]);
    // console.log("inside app");
})();


(function() {
    'use strict';

    angular
        .module('app.bootstrapui', []);
})();
(function() {
    'use strict';

    angular
        .module('app.charts', []);
})();
(function() {
    'use strict';

    angular
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ngRoute',
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'ui.utils'
        ]);
    // console.clear();
})();
(function() {
    'use strict';
    angular
        .module('adminPanel').constant("api", {
            // Live
            "url": "https://api.nowbeautyapp.com:4003/"
                // Dev
                // "url": "http://34.217.130.40:3003/"
                // "url": "https://api.nowbeautyapp.com:4003/"
        })
        .filter('underscoreless', function() {
            return function(input) {
                return input.replace(/_/g, ' ');
            };
        })
        .filter('phoneNumber', function() {
            return function(number) {
                if (!number) { return ''; }
                number = String(number);
                //  console.log(number);
                var num = number.split('-');
                //  console.log(num);
                if (num.length > 1) {
                    var code = num[0];
                    number = num[1];
                } else {
                    var code = '';
                    number = num[0];
                }
                number = number.replace(/[^0-9]*/g, '');
                var formattedNumber = number;

                var c = (number[0] == '1') ? '1' : '';
                number = number[0] == '1' ? number.slice(1) : number;
                //  var c = number[0];
                var area = number.substring(0, 3);
                var front = number.substring(3, 6);
                var end = number.substring(6, 10);
                //  console.log(c,area,front,end);
                if (front) {
                    formattedNumber = (code + " (" + area + ") " + front);
                }
                if (end) {
                    formattedNumber += ("-" + end);
                }
                return formattedNumber;
            };
        })
})();
(function() {
    'use strict';

    angular
        .module('app.mainCtrl', []);
})();
(function() {
    'use strict';

    angular
        .module('app.dashboard', []);
})();
(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .directive('flot', flot);

    flot.$inject = ['$http', '$timeout'];

    function flot($http, $timeout) {

        var directive = {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                dataset: '=?',
                options: '=',
                series: '=',
                callback: '=',
                src: '='
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            var height, plot, plotArea, width;
            var heightDefault = 220;

            plot = null;

            width = attrs.width || '100%';
            height = attrs.height || heightDefault;

            plotArea = $(element.children()[0]);
            plotArea.css({
                width: width,
                height: height
            });

            function init() {
                var plotObj;
                if (!scope.dataset || !scope.options) return;
                plotObj = $.plot(plotArea, scope.dataset, scope.options);
                scope.$emit('plotReady', plotObj);
                if (scope.callback) {
                    scope.callback(plotObj, scope);
                }

                return plotObj;
            }

            function onDatasetChanged(dataset) {
                if (plot) {
                    plot.setData(dataset);
                    plot.setupGrid();
                    return plot.draw();
                } else {
                    plot = init();
                    onSerieToggled(scope.series);
                    return plot;
                }
            }
            var $watchOff1 = scope.$watchCollection('dataset', onDatasetChanged, true);

            function onSerieToggled(series) {
                if (!plot || !series) return;
                var someData = plot.getData();
                for (var sName in series) {
                    angular.forEach(series[sName], toggleFor(sName));
                }

                plot.setData(someData);
                plot.draw();

                function toggleFor(sName) {
                    return function(s, i) {
                        if (someData[i] && someData[i][sName])
                            someData[i][sName].show = s;
                    };
                }
            }
            var $watchOff2 = scope.$watch('series', onSerieToggled, true);

            function onSrcChanged(src) {

                if (src) {

                    $http.get(src)
                        .then(function(data) {

                            $timeout(function() {
                                scope.dataset = data.data;
                            });

                        }, function() {
                            $.error('Flot chart: Bad request.');
                        });

                }
            }
            var $watchOff3 = scope.$watch('src', onSrcChanged);

            scope.$on('$destroy', function() {
                // detach watches and scope events
                $watchOff1();
                $watchOff2();
                $watchOff3();
                // destroy chart
                plot.destroy();
            });

        }
    }


})();
(function() {
    'use strict';

    angular
        .module('app.customers', []);
})();
(function() {
    'use strict';

    angular
        .module('app.areas', []);
})();
(function() {
    'use strict';

    angular
        .module('app.artists', []);
})();
(function() {
    'use strict';

    angular
        .module('app.bookings', []);
})();
(function() {
    'use strict';

    angular
        .module('app.category', []);
})();
(function() {
    'use strict';

    angular
        .module('app.support', []);
})();
(function() {
    'use strict';

    angular
        .module('app.extras', []);
})();
(function() {
    'use strict';

    angular
        .module('app.elements', []);
})();
(function() {
    'use strict';

    angular
        .module('app.flatdoc', []);
})();
(function() {
    'use strict';

    angular
        .module('app.forms', []);
})();
(function() {
    'use strict';

    angular
        .module('app.icons', []);
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload', []);
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.locale', []);
})();
(function() {
    'use strict';

    angular
        .module('app.mailbox', []);
})();
(function() {
    'use strict';

    angular
        .module('app.maps', []);
})();
(function() {
    'use strict';

    angular
        .module('app.navsearch', []);
})();
(function() {
    'use strict';

    angular
        .module('app.notify', []);
})();
(function() {
    'use strict';

    angular
        .module('app.pages', []);
})();


(function() {
    'use strict';

    angular
        .module('app.panels', []);
})();
(function() {
    'use strict';

    angular
        .module('app.preloader', []);
})();


(function() {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.tables', []);
})();
(function() {
    'use strict';

    angular
        .module('app.translate', []);
})();
(function() {
    'use strict';

    angular
        .module('app.utils', [
            'app.colors'
        ]);
})();


(function() {
    'use strict';

    angular
        .module('app.bootstrapui')
        .config(bootstrapuiConfig);

    bootstrapuiConfig.$inject = ['$uibTooltipProvider'];

    function bootstrapuiConfig($uibTooltipProvider) {
        $uibTooltipProvider.options({ appendToBody: true });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.colors')
        .constant('APP_COLORS', {
            'primary': '#5d9cec',
            'success': '#27c24c',
            'info': '#23b7e5',
            'warning': '#ff902b',
            'danger': '#f05050',
            'inverse': '#131e26',
            'green': '#37bc9b',
            'pink': '#f532e5',
            'purple': '#7266ba',
            'dark': '#3a3f51',
            'yellow': '#fad732',
            'gray-darker': '#232735',
            'gray-dark': '#3a3f51',
            'gray': '#dde6e9',
            'gray-light': '#e4eaec',
            'gray-lighter': '#edf1f2'
        });
})();
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.colors')
        .service('Colors', Colors);

    Colors.$inject = ['APP_COLORS'];

    function Colors(APP_COLORS) {
        this.byName = byName;

        ////////////////

        function byName(name) {
            return (APP_COLORS[name] || '#fff');
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$animateProvider'];

    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider) {

        var core = angular.module('app.core');
        // registering components after bootstrap
        core.controller = $controllerProvider.register;
        core.directive = $compileProvider.directive;
        core.filter = $filterProvider.register;
        core.factory = $provide.factory;
        core.service = $provide.service;
        core.constant = $provide.constant;
        core.value = $provide.value;

        // Disables animation on items with class .ng-no-animation
        $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

        // Improve performance disabling debugging features
        // $compileProvider.debugInfoEnabled(false);

    }

})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
            'desktopLG': 1200,
            'desktop': 992,
            'tablet': 768,
            'mobile': 480
        });

})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', '$templateCache', 'Colors', '$timeout', 'cfpLoadingBar'];

    function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors, $timeout, cfpLoadingBar) {

        // Hook into ocLazyLoad to setup AngularGrid before inject into the app
        // See "Creating the AngularJS Module" at
        // https://www.ag-grid.com/best-angularjs-data-grid/index.php
        var offevent = $rootScope.$on('ocLazyLoad.fileLoaded', function(e, file) {
            if (file.indexOf('ag-grid.js') > -1) {
                agGrid.initialiseAgGridWithAngular1(angular);
                offevent();
            }
        });
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;

        // console.log(window.location.href);
        var a = window.location.href.split('app/');
        // console.log(a);
        $rootScope.pfTab = 0;
        if (a[1] != "") {
            // console.log(a[1]);
            var a = a[1];
            // console.log(a);
            if (a == 'pfPatients' || a == 'pfPatientProfile' || a == 'pfContractDetails' || a == 'pfFinanceInfo' || a == 'choosePFPlan' || a == 'pfAddPatient' || a == 'pfNewPatient' || a == 'pfAddedPatient' || a == 'pfPatientPayment' || a == 'pfPatientContract') {
                $rootScope.pfTab = 1;
            } else { $rootScope.pfTab = 0; }
        }
        // Uncomment this to disable template cache
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            // if (typeof(toState) !== 'undefined'){
            //   $templateCache.remove(toState.templateUrl);
            // }
            if (toState.name == "app.dashboard" && fromState.name == "login") {
                console.log(localStorage.getItem('adminToken'));
                $timeout.cancel($rootScope.thBar);
                cfpLoadingBar.complete();
                if (localStorage.getItem('adminToken') == null || localStorage.getItem('adminToken') == 'null') {
                    event.preventDefault();
                    $state.go('login');
                    $timeout.cancel($rootScope.thBar);
                    $timeout(function() { cfpLoadingBar.complete(); }, 500);
                }
            }
            if (toState.name == "login" && fromState.name == "app.dashboard") {
                console.log(localStorage.getItem('adminToken'));
                $timeout.cancel($rootScope.thBar);
                cfpLoadingBar.complete();
                if (localStorage.getItem('adminToken') != null && localStorage.getItem('adminToken') != 'null') {
                    event.preventDefault();
                    $state.go('app.dashboard');
                    $timeout.cancel($rootScope.thBar);
                    $timeout(function() { cfpLoadingBar.complete(); }, 500);
                }
            }
            if ($('body').length) // check if bar container exists
                $rootScope.thBar = $timeout(function() {
                cfpLoadingBar.start();
            }, 0);

        });
        // Allows to use branding color with interpolation
        // {{ colorByName('primary') }}
        $rootScope.colorByName = Colors.byName;

        // cancel click event easily
        $rootScope.cancel = function($event) {
            $event.stopPropagation();
        };

        // Hooks Example
        // -----------------------------------

        // Hook not found
        $rootScope.$on('$stateNotFound',
            function(event, unfoundState /*, fromState, fromParams*/ ) {
                console.log(unfoundState.to); // "lazy.state"
                console.log(unfoundState.toParams); // {a:1, b:2}
                console.log(unfoundState.options); // {inherit:false} + default options
            });
        // Hook error
        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error) {
                console.log(error);
            });
        // Hook success
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {
                // display new view from top
                // console.log(toState.name);
                $window.scrollTo(0, 0);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                $timeout.cancel($rootScope.thBar);
                cfpLoadingBar.complete();
                // Save the route title
                $rootScope.currTitle = $state.current.title;
            });

        // Load a title dynamically
        $rootScope.currTitle = $state.current.title;
        $rootScope.pageTitle = function() {
            var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
            document.title = title;
            return title;
        };

    }

})();


(function() {
    'use strict';

    angular
        .module('adminPanel')
        .directive('filestyle', filestyle);

    function filestyle() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            var options = element.data();

            // old usage support
            options.classInput = element.data('classinput') || options.classInput;

            element.filestyle(options);
        }
    }

})();

/**=========================================================
 * Module: skycons.js
 * Include any animated weather icon from Skycons
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.icons')
        .directive('skycon', skycon);

    function skycon() {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var skycons = new Skycons({ 'color': (attrs.color || 'white') });

            element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');

            skycons.add(element.children()[0], attrs.skycon);

            skycons.play();
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];

    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES) {

        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'whirl': ['vendor/whirl/dist/whirl.css'],
                'animo': ['vendor/animo.js/animo.js'],
                'fastclick': ['vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['vendor/modernizr/modernizr.custom.js'],
                'animate': ['vendor/animate.css/animate.min.css'],
                'skycons': ['vendor/skycons/skycons.js'],
                'icons': ['vendor/fontawesome/css/font-awesome.min.css',
                    'vendor/simple-line-icons/css/simple-line-icons.css'
                ],
                'weather-icons': ['vendor/weather-icons/css/weather-icons.min.css',
                    'vendor/weather-icons/css/weather-icons-wind.min.css'
                ],
                'sparklines': ['vendor/sparkline/index.js'],
                'wysiwyg': ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'
                ],
                'slimscroll': ['vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['vendor/screenfull/dist/screenfull.js'],
                'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                    'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'
                ],
                'vector-map-maps': ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                    'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'
                ],
                'loadGoogleMapsJS': ['vendor/load-google-maps/load-google-maps.js'],
                'flot-chart': ['vendor/flot/jquery.flot.js'],
                'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    'vendor/flot/jquery.flot.resize.js',
                    'vendor/flot/jquery.flot.pie.js',
                    'vendor/flot/jquery.flot.time.js',
                    'vendor/flot/jquery.flot.categories.js',
                    'vendor/flot-spline/js/jquery.flot.spline.min.js'
                ],
                'moment': ['vendor/moment/min/moment.min.js', 'vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
                'flatdoc': ['vendor/flatdoc/flatdoc.js'],
                'codemirror': ['vendor/codemirror/lib/codemirror.js',
                    'vendor/codemirror/lib/codemirror.css'
                ],
                // modes for common web files
                'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                    'vendor/codemirror/mode/xml/xml.js',
                    'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    'vendor/codemirror/mode/css/css.js'
                ],
                'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
                ],
                'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'morris': ['vendor/raphael/raphael.js',
                    'vendor/morris.js/morris.js',
                    'vendor/morris.js/morris.css'
                ],
                'loaders.css': ['vendor/loaders.css/loaders.css'],
                'spinkit': ['vendor/spinkit/css/spinkit.css']
            },
            // Angular based script (use the right module name)
            modules: [{
                    name: 'toaster',
                    files: ['vendor/angularjs-toaster/toaster.js',
                        'vendor/angularjs-toaster/toaster.css'
                    ]
                },
                {
                    name: 'localytics.directives',
                    files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                        'vendor/chosen_v1.2.0/chosen.min.css',
                        'vendor/angular-chosen-localytics/dist/angular-chosen.js'
                    ],
                    serie: true
                },
                {
                    name: 'ngDialog',
                    files: ['vendor/ngDialog/js/ngDialog.min.js',
                        'vendor/ngDialog/css/ngDialog.min.css',
                        'vendor/ngDialog/css/ngDialog-theme-default.min.css'
                    ]
                },
                { name: 'ngWig', files: ['vendor/ngWig/dist/ng-wig.min.js'] },
                {
                    name: 'ngTable',
                    files: ['vendor/ng-table/dist/ng-table.min.js',
                        'vendor/ng-table/dist/ng-table.min.css'
                    ]
                },
                { name: 'ngTableExport', files: ['vendor/ng-table-export/ng-table-export.js'] },
                {
                    name: 'angularBootstrapNavTree',
                    files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
                    ]
                },
                {
                    name: 'xeditable',
                    files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                        'vendor/angular-xeditable/dist/css/xeditable.css'
                    ]
                },
                { name: 'angularFileUpload', files: ['vendor/angular-file-upload/dist/angular-file-upload.js'] },
                {
                    name: 'ngImgCrop',
                    files: ['vendor/ng-img-crop/compile/unminified/ext/ng-img-crop.js',
                        'vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
                    ]
                },
                {
                    name: 'uiCropper',
                    files: ['vendor/uiCropper/ui-cropper.js',
                        'vendor/uiCropper/ui-cropper.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: ['vendor/angular-ui-select/dist/select.js',
                        'vendor/angular-ui-select/dist/select.css'
                    ]
                },
                { name: 'ui.codemirror', files: ['vendor/angular-ui-codemirror/ui-codemirror.js'] },
                {
                    name: 'angular-carousel',
                    files: ['vendor/angular-carousel/dist/angular-carousel.css',
                        'vendor/angular-carousel/dist/angular-carousel.js'
                    ]
                },
                { name: 'infinite-scroll', files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js'] },
                {
                    name: 'ui.bootstrap-slider',
                    files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                        'vendor/angular-bootstrap-slider/slider.js'
                    ],
                    serie: true
                },
                {
                    name: 'ui.grid',
                    files: ['vendor/angular-ui-grid/ui-grid.min.css',
                        'vendor/angular-ui-grid/ui-grid.min.js'
                    ]
                },
                {
                    name: 'summernote',
                    files: ['vendor/bootstrap/js/modal.js',
                        'vendor/bootstrap/js/dropdown.js',
                        'vendor/bootstrap/js/tooltip.js',
                        'vendor/summernote/dist/summernote.css',
                        'vendor/summernote/dist/summernote.js',
                        'vendor/angular-summernote/dist/angular-summernote.js'
                    ],
                    serie: true
                },
                {
                    name: 'angular-rickshaw',
                    files: ['vendor/d3/d3.min.js',
                        'vendor/rickshaw/rickshaw.js',
                        'vendor/rickshaw/rickshaw.min.css',
                        'vendor/angular-rickshaw/rickshaw.js'
                    ],
                    serie: true
                },
                {
                    name: 'angular-chartist',
                    files: ['vendor/chartist/dist/chartist.min.css',
                        'vendor/chartist/dist/chartist.js',
                        'vendor/angular-chartist.js/dist/angular-chartist.js'
                    ],
                    serie: true
                },
                { name: 'ui.map', files: ['vendor/angular-ui-map/ui-map.js'] },
                {
                    name: 'datatables',
                    files: ['vendor/datatables/media/css/jquery.dataTables.css',
                        'vendor/datatables/media/js/jquery.dataTables.js',
                        'vendor/datatables-buttons/js/dataTables.buttons.js',
                        //'vendor/datatables-buttons/css/buttons.bootstrap.css',
                        'vendor/datatables-buttons/js/buttons.bootstrap.js',
                        'vendor/datatables-buttons/js/buttons.colVis.js',
                        'vendor/datatables-buttons/js/buttons.flash.js',
                        'vendor/datatables-buttons/js/buttons.html5.js',
                        'vendor/datatables-buttons/js/buttons.print.js',
                        'vendor/angular-datatables/dist/angular-datatables.js',
                        'vendor/angular-datatables/dist/plugins/buttons/angular-datatables.buttons.js'
                    ],
                    serie: true
                },
                {
                    name: 'angular-jqcloud',
                    files: ['vendor/jqcloud2/dist/jqcloud.css',
                        'vendor/jqcloud2/dist/jqcloud.js',
                        'vendor/angular-jqcloud/angular-jqcloud.js'
                    ]
                },
                {
                    name: 'angularGrid',
                    files: ['vendor/ag-grid/dist/styles/ag-grid.css',
                        'vendor/ag-grid/dist/ag-grid.js',
                        'vendor/ag-grid/dist/styles/theme-dark.css',
                        'vendor/ag-grid/dist/styles/theme-fresh.css'
                    ]
                },
                {
                    name: 'ng-nestable',
                    files: ['vendor/ng-nestable/src/angular-nestable.js',
                        'vendor/nestable/jquery.nestable.js'
                    ]
                },
                { name: 'akoenig.deckgrid', files: ['vendor/angular-deckgrid/angular-deckgrid.js'] },
                {
                    name: 'oitozero.ngSweetAlert',
                    files: ['vendor/sweetalert/dist/sweetalert.css',
                        'vendor/sweetalert/dist/sweetalert.min.js',
                        'vendor/angular-sweetalert/SweetAlert.js'
                    ],
                    serie: true
                },
                {
                    name: 'bm.bsTour',
                    files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'
                    ],
                    serie: true
                },
                {
                    name: 'ui.knob',
                    files: ['vendor/angular-knob/src/angular-knob.js',
                        'vendor/jquery-knob/dist/jquery.knob.min.js'
                    ]
                },
                { name: 'easypiechart', files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js'] },
                {
                    name: 'colorpicker.module',
                    files: ['vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js'
                    ]
                },
                {
                    name: 'ui.sortable',
                    files: ['vendor/jquery-ui/jquery-ui.min.js',
                        'vendor/angular-ui-sortable/sortable.js'
                    ],
                    serie: true
                },
                {
                    name: 'ui.calendar',
                    files: ['vendor/jquery-ui/jquery-ui.min.js',
                        'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
                        'vendor/fullcalendar/dist/fullcalendar.min.js',
                        'vendor/fullcalendar/dist/gcal.js',
                        'vendor/fullcalendar/dist/fullcalendar.css',
                        'vendor/angular-ui-calendar/src/calendar.js'
                    ],
                    serie: true
                },
                {
                    name: 'chart.js',
                    files: ['vendor/chart.js/dist/Chart.js',
                        'vendor/angular-chart.js/dist/angular-chart.js'
                    ],
                    serie: true
                },
                { name: 'html2canvas', files: ['vendor/html2canvas/dist/html2canvas.min.js', 'vendor/html2canvas/dist/html2canvas.svg.min.js'] },
                { name: 'pdfMake', files: ['vendor/pdfmake-master/build/pdfmake.min.js', 'vendor/pdfmake-master/build/vfs_fonts.js'], serie: true },
                { name: 'htmlToPdfSave', files: ['vendor/htmlToPdf/htmlToPdf.js'] }
            ]
        });

})();

(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .config(loadingbarConfig);
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];

    function loadingbarConfig(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = false;
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.latencyThreshold = 500;
        // .wrapper > section
        cfpLoadingBarProvider.parentSelector = 'body';
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner">  <div class="sk-wave"><div class="sk-rect ' + 'sk-rect1"></div>' + '<div class="sk-rect sk-rect2"></div>' + '<div class="sk-rect sk-rect3"></div>' + '<div class="sk-rect ' + 'sk-rect4"></div>' + '<div class="sk-rect sk-rect5"></div></div></div>';
    }
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .run(loadingbarRun);
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];

    function loadingbarRun($rootScope, $timeout, cfpLoadingBar) {

        // Loading bar transition
        // -----------------------------------
        $rootScope.thBar;
        $rootScope.$on('$stateChangeStart', function() {
            // if($('body').length) // check if bar container exists
            //   $rootScope.thBar = $timeout(function() {
            //     cfpLoadingBar.start();
            //   }, 0); // sets a latency Threshold
        });
        $rootScope.$on('$stateChangeSuccess', function(event) {
            // event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel($rootScope.thBar);
            cfpLoadingBar.complete();
            // });
        });

    }

})();
(function() {
    'use strict';

    angular
        .module('app.locale')
        .config(localeConfig);
    localeConfig.$inject = ['tmhDynamicLocaleProvider'];

    function localeConfig(tmhDynamicLocaleProvider) {

        tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
        // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }
})();
/**=========================================================
 * Module: locale.js
 * Demo for locale settings
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.locale')
        .controller('LocalizationController', LocalizationController);

    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];

    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {

        activate();

        ////////////////

        function activate() {
            $rootScope.availableLocales = {
                'en': 'English',
                'es': 'Spanish',
                'de': 'German',
                'fr': 'French',
                'ar': 'Arabic',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese'
            };

            $rootScope.model = { selectedLocale: 'en' };

            $rootScope.$locale = $locale;

            $rootScope.changeLocale = tmhDynamicLocale.set;
        }
    }
})();


/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.navsearch')
        .directive('searchOpen', searchOpen)
        .directive('searchDismiss', searchDismiss);

    //
    // directives definition
    //

    function searchOpen() {
        var directive = {
            controller: searchOpenController,
            restrict: 'A'
        };
        return directive;

    }

    function searchDismiss() {
        var directive = {
            controller: searchDismissController,
            restrict: 'A'
        };
        return directive;

    }

    //
    // Contrller definition
    //

    searchOpenController.$inject = ['$scope', '$element', 'NavSearch'];

    function searchOpenController($scope, $element, NavSearch) {
        $element
            .on('click', function(e) { e.stopPropagation(); })
            .on('click', NavSearch.toggle);
    }

    searchDismissController.$inject = ['$scope', '$element', 'NavSearch'];

    function searchDismissController($scope, $element, NavSearch) {

        var inputSelector = '.navbar-form input[type="text"]';

        $(inputSelector)
            .on('click', function(e) { e.stopPropagation(); })
            .on('keyup', function(e) {
                if (e.keyCode === 27) // ESC
                    NavSearch.dismiss();
            });

        // click anywhere closes the search
        $(document).on('click', NavSearch.dismiss);
        // dismissable options
        $element
            .on('click', function(e) { e.stopPropagation(); })
            .on('click', NavSearch.dismiss);
    }

})();


/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.navsearch')
        .service('NavSearch', NavSearch);

    function NavSearch() {
        this.toggle = toggle;
        this.dismiss = dismiss;

        ////////////////

        var navbarFormSelector = 'form.navbar-form';

        function toggle() {
            var navbarForm = $(navbarFormSelector);

            navbarForm.toggleClass('open');

            var isOpen = navbarForm.hasClass('open');

            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
        }

        function dismiss() {
            $(navbarFormSelector)
                .removeClass('open') // Close control
                .find('input[type="text"]').blur() // remove focus
                // .val('') // Empty input
            ;
        }
    }
})();

/**=========================================================
 * Module: notify.js
 * Directive for notify plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.notify')
        .directive('notify', notify);

    notify.$inject = ['$window', 'Notify'];

    function notify($window, Notify) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                options: '=',
                message: '='
            }
        };
        return directive;

        function link(scope, element) {

            element.on('click', function(e) {
                e.preventDefault();
                Notify.alert(scope.message, scope.options);
            });
        }

    }

})();


/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.notify')
        .service('Notify', Notify);

    Notify.$inject = ['$timeout'];

    function Notify($timeout) {

        this.alert = notifyAlert;

        ////////////////

        function notifyAlert(msg, opts) {
            if (msg) {
                $timeout(function() {
                    $.notify(msg, opts || {});
                });
            }
        }
    }

})();

/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function($) {
    'use strict';
    var containers = {},
        messages = {},
        notify = function(options) {
            if ($.type(options) === 'string') {
                options = { message: options };
            }
            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) === 'string' ? { status: arguments[1] } : arguments[1]);
            }
            return (new Message(options)).show();
        },
        closeAll = function(group, instantly) {
            var id;
            if (group) {
                for (id in messages) { if (group === messages[id].group) messages[id].close(instantly); }
            } else {
                for (id in messages) { messages[id].close(instantly); }
            }
        };
    var Message = function(options) {
        // var $this = this;
        this.options = $.extend({}, Message.defaults, options);
        this.uuid = 'ID' + (new Date().getTime()) + 'RAND' + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'
        ].join('')).data('notifyMessage', this);
        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }
        this.group = this.options.group;
        messages[this.uuid] = this;
        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on('click', '.uk-notify-message', function() {
                $(this).data('notifyMessage').close();
            });
        }
    };
    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: '',
        group: false,
        show: function() {
            if (this.element.is(':visible')) return;
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);
            this.element.css({ 'opacity': 0, 'margin-top': -1 * this.element.outerHeight(), 'margin-bottom': 0 }).animate({ 'opacity': 1, 'margin-top': 0, 'margin-bottom': marginbottom }, function() {
                if ($this.options.timeout) {
                    var closefn = function() { $this.close(); };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout); }
                    );
                }
            });
            return this;
        },
        close: function(instantly) {
            var $this = this,
                finalize = function() {
                    $this.element.remove();
                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if (this.timeout) clearTimeout(this.timeout);
            if (instantly) {
                finalize();
            } else {
                this.element.animate({ 'opacity': 0, 'margin-top': -1 * this.element.outerHeight(), 'margin-bottom': 0 }, function() {
                    finalize();
                });
            }
        },
        content: function(html) {
            var container = this.element.find('>div');
            if (!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function(status) {
            if (!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);
            this.currentstatus = status;
            return this;
        }
    });
    Message.defaults = {
        message: '',
        status: 'normal',
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };

    $.notify = notify;
    $.notify.message = Message;
    $.notify.closeAll = closeAll;

    return notify;
}(jQuery));


/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelCollapse', panelCollapse);

    function panelCollapse() {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$element', '$timeout', '$localStorage'];

    function Controller($scope, $element, $timeout, $localStorage) {
        var storageKeyName = 'panelState';

        // Prepare the panel to be collapsible
        var $elem = $($element),
            parent = $elem.closest('.panel'), // find the first parent panel
            panelId = parent.attr('id');

        // Load the saved state if exists
        var currentState = loadPanelState(panelId);
        if (typeof currentState !== 'undefined') {
            $timeout(function() {
                    $scope[panelId] = currentState;
                },
                10);
        }

        // bind events to switch icons
        $element.bind('click', function(e) {
            e.preventDefault();
            savePanelState(panelId, !$scope[panelId]);

        });

        // Controller helpers
        function savePanelState(id, state) {
            if (!id) return false;
            var data = angular.fromJson($localStorage[storageKeyName]);
            if (!data) { data = {}; }
            data[id] = state;
            $localStorage[storageKeyName] = angular.toJson(data);
        }

        function loadPanelState(id) {
            if (!id) return false;
            var data = angular.fromJson($localStorage[storageKeyName]);
            if (data) {
                return data[id];
            }
        }
    }

})();

/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelDismiss', panelDismiss);

    function panelDismiss() {

        var directive = {
            controller: Controller,
            restrict: 'A'
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element', '$q', 'Utils'];

    function Controller($scope, $element, $q, Utils) {
        var removeEvent = 'panel-remove',
            removedEvent = 'panel-removed';

        $element.on('click', function(e) {
            e.preventDefault();

            // find the first parent panel
            var parent = $(this).closest('.panel');

            removeElement();

            function removeElement() {
                var deferred = $q.defer();
                var promise = deferred.promise;

                // Communicate event destroying panel
                $scope.$emit(removeEvent, parent.attr('id'), deferred);
                promise.then(destroyMiddleware);
            }

            // Run the animation before destroy the panel
            function destroyMiddleware() {
                if (Utils.support.animation) {
                    parent.animo({ animation: 'bounceOut' }, destroyPanel);
                } else destroyPanel();
            }

            function destroyPanel() {

                var col = parent.parent();
                parent.remove();
                // remove the parent if it is a row and is empty and not a sortable (portlet)
                col
                    .filter(function() {
                        var el = $(this);
                        return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                    }).remove();

                // Communicate event destroyed panel
                $scope.$emit(removedEvent, parent.attr('id'));

            }

        });
    }
})();



/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelRefresh', panelRefresh);

    function panelRefresh() {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element'];

    function Controller($scope, $element) {
        var refreshEvent = 'panel-refresh',
            whirlClass = 'whirl',
            defaultSpinner = 'standard';

        // catch clicks to toggle panel refresh
        $element.on('click', function(e) {
            e.preventDefault();

            var $this = $(this),
                panel = $this.parents('.panel').eq(0),
                spinner = $this.data('spinner') || defaultSpinner;

            // start showing the spinner
            panel.addClass(whirlClass + ' ' + spinner);

            // Emit event when refresh clicked
            $scope.$emit(refreshEvent, panel.attr('id'));

        });

        // listen to remove spinner
        $scope.$on('removeSpinner', removeSpinner);

        // method to clear the spinner when done
        function removeSpinner(ev, id) {
            if (!id) return;
            var newid = id.charAt(0) === '#' ? id : ('#' + id);
            angular
                .element(newid)
                .removeClass(whirlClass);
        }
    }
})();



/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels.
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('paneltool', paneltool);

    paneltool.$inject = ['$compile', '$timeout'];

    function paneltool($compile, $timeout) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: false
        };
        return directive;

        function link(scope, element, attrs) {

            var templates = {
                /* jshint multistr: true */
                collapse: '<a href="#" panel-collapse="" uib-tooltip="Collapse Panel" ng-click="{{panelId}} = !{{panelId}}"> \
                        <em ng-show="{{panelId}}" class="fa fa-plus ng-no-animation"></em> \
                        <em ng-show="!{{panelId}}" class="fa fa-minus ng-no-animation"></em> \
                      </a>',
                dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
                       <em class="fa fa-times"></em>\
                     </a>',
                refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="Refresh Panel">\
                       <em class="fa fa-refresh"></em>\
                     </a>'
            };

            var tools = scope.panelTools || attrs;

            $timeout(function() {
                element.html(getTemplate(element, tools)).show();
                $compile(element.contents())(scope);

                element.addClass('pull-right');
            });

            function getTemplate(elem, attrs) {
                var temp = '';
                attrs = attrs || {};
                if (attrs.toolCollapse)
                    temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
                if (attrs.toolDismiss)
                    temp += templates.dismiss;
                if (attrs.toolRefresh)
                    temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
                return temp;
            }
        } // link
    }

})();

/**=========================================================
 * Module: demo-panels.js
 * Provides a simple demo for panel actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .controller('PanelsCtrl', PanelsCtrl);

    PanelsCtrl.$inject = ['$scope', '$timeout'];

    function PanelsCtrl($scope, $timeout) {

        activate();

        ////////////////

        function activate() {

            // PANEL COLLAPSE EVENTS
            // -----------------------------------

            // We can use panel id name for the boolean flag to [un]collapse the panel
            $scope.$watch('panelDemo1', function(newVal) {

                console.log('panelDemo1 collapsed: ' + newVal);

            });


            // PANEL DISMISS EVENTS
            // -----------------------------------

            // Before remove panel
            $scope.$on('panel-remove', function(event, id, deferred) {

                console.log('Panel #' + id + ' removing');

                // Here is obligatory to call the resolve() if we pretend to remove the panel finally
                // Not calling resolve() will NOT remove the panel
                // It's up to your app to decide if panel should be removed or not
                deferred.resolve();

            });

            // Panel removed ( only if above was resolved() )
            $scope.$on('panel-removed', function(event, id) {

                console.log('Panel #' + id + ' removed');

            });


            // PANEL REFRESH EVENTS
            // -----------------------------------

            $scope.$on('panel-refresh', function(event, id) {
                var secs = 3;

                console.log('Refreshing during ' + secs + 's #' + id);

                $timeout(function() {
                    // directive listen for to remove the spinner
                    // after we end up to perform own operations
                    $scope.$broadcast('removeSpinner', id);

                    console.log('Refreshed #' + id);

                }, 3000);

            });

            // PANELS VIA NG-REPEAT
            // -----------------------------------

            $scope.panels = [{
                    id: 'panelRepeat1',
                    title: 'Panel Title 1',
                    body: 'Nulla eget lorem leo, sit amet elementum lorem. '
                },
                {
                    id: 'panelRepeat2',
                    title: 'Panel Title 2',
                    body: 'Nulla eget lorem leo, sit amet elementum lorem. '
                },
                {
                    id: 'panelRepeat3',
                    title: 'Panel Title 3',
                    body: 'Nulla eget lorem leo, sit amet elementum lorem. '
                }
            ];
        }

    } //PanelsCtrl

})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('masked', masked);

    function masked() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            var $elem = $(element);
            if ($.fn.inputmask)
                $elem.inputmask();
        }
    }

})();




(function() {
    'use strict';

    angular
        .module('app.preloader')
        .directive('preloader', preloader);

    preloader.$inject = ['$animate', '$timeout', '$q'];

    function preloader($animate, $timeout, $q) {

        var directive = {
            restrict: 'EAC',
            template: '<div class="preloader-progress">' +
                '<div class="preloader-progress-bar" ' +
                'ng-style="{width: loadCounter + \'%\'}"></div>' +
                '</div>',
            link: link
        };
        return directive;

        ///////

        function link(scope, el) {

            scope.loadCounter = 0;

            var counter = 0,
                timeout;

            // disables scrollbar
            angular.element('body').css('overflow', 'hidden');
            // ensure class is present for styling
            el.addClass('preloader');

            appReady().then(endCounter);

            timeout = $timeout(startCounter);

            ///////

            function startCounter() {

                var remaining = 100 - counter;
                counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));
                // counter = counter + 10;

                scope.loadCounter = parseInt(counter, 10);
                // if(scope.loadCounter == 100) endCounter;
                timeout = $timeout(startCounter, 20);
            }

            function endCounter() {
                scope.loadCounter = 100
                $timeout.cancel(timeout);

                scope.loadCounter = 100;

                $timeout(function() {
                    // animate preloader hiding
                    $animate.addClass(el, 'preloader-hidden');
                    // retore scrollbar
                    angular.element('body').css('overflow', '');
                }, 300);
            }

            function appReady() {
                var deferred = $q.defer();
                var viewsLoaded = 0;
                // if this doesn't sync with the real app ready
                // a custom event must be used instead
                var off = scope.$on('$viewContentLoaded', function() {
                    viewsLoaded++;
                    // we know there are at least two views to be loaded
                    // before the app is ready (1-index.html 2-app*.html)
                    if (viewsLoaded === 2) {
                        // with resolve this fires only once
                        $timeout(function() {
                            deferred.resolve();
                        }, 3000);

                        off();
                    }

                });

                return deferred.promise;
            }

        } //link
    }

})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils'];

    function SidebarController($rootScope, $scope, $state, SidebarLoader, Utils) {

        activate();

        ////////////////

        function activate() {
            var collapseList = [];

            // demo: when switch from collapse to hover, close all items
            var watchOff1 = $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal) {
                if (newVal === false && oldVal === true) {
                    closeAllBut(-1);
                }
            });


            // Load menu from json file
            // -----------------------------------

            SidebarLoader.getMenu(sidebarReady);

            function sidebarReady(items) {
                $scope.menuItems = items.data;
            }

            // Handle sidebar and collapse items
            // ----------------------------------

            $scope.getMenuItemPropClasses = function(item) {
                return (item.heading ? 'nav-heading' : '') +
                    (isActive(item) ? ' active' : '');
            };

            $scope.addCollapse = function($index, item) {
                collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
            };

            $scope.isCollapse = function($index) {
                return (collapseList[$index]);
            };

            $scope.toggleCollapse = function($index, isParentItem) {

                // collapsed sidebar doesn't toggle drodopwn
                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

                // make sure the item index exists
                if (angular.isDefined(collapseList[$index])) {
                    if (!$scope.lastEventFromChild) {
                        collapseList[$index] = !collapseList[$index];
                        closeAllBut($index);
                    }
                } else if (isParentItem) {
                    closeAllBut(-1);
                }

                $scope.lastEventFromChild = isChild($index);

                return true;

            };

            // Controller helpers
            // -----------------------------------

            // Check item and children active state
            function isActive(item) {

                if (!item) return;

                if (!item.sref || item.sref === '#') {
                    var foundActive = false;
                    angular.forEach(item.submenu, function(value) {
                        if (isActive(value)) foundActive = true;
                    });
                    return foundActive;
                } else
                    return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
                index += '';
                for (var i in collapseList) {
                    if (index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
            }

            function isChild($index) {
                /*jshint -W018*/
                return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }

            $scope.$on('$destroy', function() {
                watchOff1();
            });

        } // activate
    }

})();



/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            element.on('click', function(e) {
                if (element.is('a')) e.preventDefault();
                var uri = attrs.loadCss,
                    link;

                if (uri) {
                    link = createLink(uri);
                    if (!link) {
                        $.error('Error creating stylesheet link element.');
                    }
                } else {
                    $.error('No stylesheet location defined.');
                }

            });
        }

        function createLink(uri) {
            var linkId = 'autoloaded-stylesheet',
                oldLink = $('#' + linkId).attr('id', linkId + '-old');

            $('head').append($('<link/>').attr({
                'id': linkId,
                'rel': 'stylesheet',
                'href': uri
            }));

            if (oldLink.length) {
                oldLink.remove();
            }

            return $('#' + linkId);
        }
    }

})();

/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('now', now);

    now.$inject = ['dateFilter', '$interval'];

    function now(dateFilter, $interval) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
            var format = attrs.format;

            function updateTime() {
                var dt = dateFilter(new Date(), format);
                element.text(dt);
            }

            updateTime();
            var intervalPromise = $interval(updateTime, 1000);

            scope.$on('$destroy', function() {
                $interval.cancel(intervalPromise);
            });

        }
    }

})();



/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Utils', Utils);

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];

    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element('html'),
            $win = angular.element($window),
            $body = angular.element('body');

        return {
            // DETECTION
            support: {
                transition: (function() {
                    var transitionEnd = (function() {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            },
                            name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && { end: transitionEnd };
                })(),
                animation: (function() {

                    var animationEnd = (function() {

                        var element = document.body || document.documentElement,
                            animEndEventNames = {
                                WebkitAnimation: 'webkitAnimationEnd',
                                MozAnimation: 'animationend',
                                OAnimation: 'oAnimationEnd oanimationend',
                                animation: 'animationend'
                            },
                            name;

                        for (name in animEndEventNames) {
                            if (element.style[name] !== undefined) return animEndEventNames[name];
                        }
                    }());

                    return animationEnd && { end: animationEnd };
                })(),
                requestAnimationFrame: window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    function(callback) { window.setTimeout(callback, 1000 / 60); },
                /*jshint -W069*/
                touch: (
                    ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                    (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                    (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                    false
                ),
                mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
            },
            // UTILITIES
            isInView: function(element, options) {
                /*jshint -W106*/
                var $element = $(element);

                if (!$element.is(':visible')) {
                    return false;
                }

                var window_left = $win.scrollLeft(),
                    window_top = $win.scrollTop(),
                    offset = $element.offset(),
                    left = offset.left,
                    top = offset.top;

                options = $.extend({ topoffset: 0, leftoffset: 0 }, options);

                if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                    left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                    return true;
                } else {
                    return false;
                }
            },

            langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

            isTouch: function() {
                return $html.hasClass('touch');
            },

            isSidebarCollapsed: function() {
                return $body.hasClass('aside-collapsed') || $body.hasClass('aside-collapsed-text');
            },

            isSidebarToggled: function() {
                return $body.hasClass('aside-toggled');
            },

            isMobile: function() {
                return $win.width() < APP_MEDIAQUERY.tablet;
            }

        };
    }
})();

(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'adminPanel',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();

// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('Controller', Controller);

    Controller.$inject = ['$log', 'toaster'];

    function Controller($log, toaster) {
        // for controllerAs syntax
        // var vm = this;

        activate();

        ////////////////

        function activate() {
            $log.log('I\'m a line from custom.js');
        }
    }
})();