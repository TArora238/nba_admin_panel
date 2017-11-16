/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.pages')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout'];

  function LoginController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      // bind here all data from the form
      if (localStorage.getItem('adminToken')) {
        if ($state.current.name == "login") {
          // $scope.mCtrl.checkDoctorToken(1);
          // $state.go('app.prospects');
        }
      }
      vm.login = {};
      vm.loginAdmin = function(form) {
        console.log(vm.login.admin_email, vm.login.admin_password);
        if (!vm.login.admin_email || vm.login.admin_email.trim().length == 0) {
          toaster.pop('warning', 'Enter a valid email', '');
          return false;
        }
        if (!vm.login.admin_password || vm.login.admin_password.trim().length == 0) {
          toaster.pop('warning', 'Enter a valid password', '');
          return false;
        }
        $scope.mCtrl.hitInProgress = true;
        cfpLoadingBar.start();
        $.post(api.url + "email_login", {
            admin_email: vm.login.admin_email.replace(/\s/g, '').toLowerCase(),
            admin_password: vm.login.admin_password,
            device_type: 0,
            device_id: localStorage.getItem('user')
          })
          .success(function(data, status) {
              if (typeof data === 'string')
                  var data = JSON.parse(data);
              if(data.flag!=9)$scope.mCtrl.flagPopUps(data.flag,data.is_error);
              else toaster.pop("error","Email and Password don't match","");
              if (data.is_error == 0) {
                      $scope.mCtrl.setLoginData(data, 1);
                  }
           })
      };
    }
  }
})();



/**=========================================================
 * Module: Dashboard
=========================================================*/

(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout','Colors','uiCalendarConfig'];

  function DashboardController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout,Colors,uiCalendarConfig) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      $scope.mCtrl.checkToken();
      $scope.mCtrl.checkDoctorToken();
      vm.dashboard = {};



    }
  }
})();


/**=========================================================
 * Module: Support
=========================================================*/

(function() {
  'use strict';

  angular
    .module('app.support')
    .controller('SupportController', SupportController);

  SupportController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout'];

  function SupportController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      $scope.mCtrl.checkToken();
      $scope.mCtrl.checkDoctorToken();
      vm.support = {};

    }
  }
})();


/**=========================================================
 * Module: Customer List
=========================================================*/

(function() {
  'use strict';

  angular
    .module('app.customers')
    .controller('CustomersController', CustomersController);

    CustomersController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

  function CustomersController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      $scope.mCtrl.checkToken();
      $scope.mCtrl.checkDoctorToken();


      vm.dtOptions = {
        "scrollX": true
      };
      vm.ngDialogPop = function(template, className) {
        ngDialog.openConfirm({
          template: template,
          className: 'ngdialog-theme-default ' + className,
          scope: $scope,
          closeByEscape: false,
          closeByDocument: false
        }).then(function(value) {}, function(reason) {});

      };
        vm.currentPage = 1;
        vm.itemsPerPage = 10;
        vm.maxSize = 5;
        vm.skip = 0;
        vm.pageChanged = function (currentPage) {
            vm.currentPage = currentPage;
            for (var i = 1; i <= vm.totalItems / 10 + 1; i++) {
                if (vm.currentPage == i) {
                    vm.skip = 10 * (i - 1);
                }
            }
            vm.customers = [];
            vm.initTable();
        };
      vm.initTable = function() {
        cfpLoadingBar.start();

        $.post(api.url + "user_list",{
            access_token: localStorage.getItem('adminToken'),
            limit: 10,
            offset: vm.skip
        })
          .success(function(data, status) {
                  cfpLoadingBar.complete();
            if (typeof data === 'string') data = JSON.parse(data);
            console.log(data);
            $scope.mCtrl.flagPopUps(data.flag, data.is_error);
            $timeout(function () {
                vm.customers = data.all_users;
                vm.totalItems = data.all_users.length;
                console.log(vm.customers)
            })
          });
      };
      vm.initTable();

        vm.blockConfirm = function (id, is_blocked) {
            vm.is_blocked = is_blocked;
            vm.id = id;
            if (is_blocked) {
                vm.blocked = "unblock";
            } else {
                vm.blocked = "block";
            }
            vm.ngDialogPop('block_user_modal','smallPop');
        };

        vm.block_user = function () {
            cfpLoadingBar.start();
            if (vm.is_blocked)
                vm.is_blocked = 0;
            else
                vm.is_blocked = 1;

            $.post(api.url + 'block_unblock_user', {
                access_token: localStorage.getItem('adminToken'),
                user_id: vm.id,
                block_unblock: vm.is_blocked
            }).success(function (data, status) {
                if (typeof data === 'string')
                    var data = JSON.parse(data);
                console.log(data);
                $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                if (data.is_error == 0) {
                    ngDialog.close();
                    $state.reload();
                }
            });

        }
    }
  }
})();

/**=========================================================
 * Module: Verified Artists List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.artists')
        .controller('VerifiedArtistsController', VerifiedArtistsController);

    VerifiedArtistsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function VerifiedArtistsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument: false
                }).then(function(value) {}, function(reason) {});

            };
            vm.currentPage = 1;
            vm.itemsPerPage = 10;
            vm.maxSize = 5;
            vm.skip = 0;
            vm.pageChanged = function (currentPage) {
                vm.currentPage = currentPage;
                for (var i = 1; i <= vm.totalItems / 10 + 1; i++) {
                    if (vm.currentPage == i) {
                        vm.skip = 10 * (i - 1);
                    }
                }
                vm.customers = [];
                vm.initTable();
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "artist_list",{
                    access_token: localStorage.getItem('adminToken'),
                    limit: 10,
                    offset: vm.skip
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.artists = data.all_artists;
                            vm.totalItems = data.all_artists.length;
                            console.log(vm.customers)
                        })
                    });
            };
            vm.initTable();

            vm.blockConfirm = function (id, is_blocked) {
                vm.is_blocked = is_blocked;
                vm.id = id;
                if (is_blocked) {
                    vm.blocked = "unblock";
                } else {
                    vm.blocked = "block";
                }
                vm.ngDialogPop('block_artist_modal','smallPop');
            };

            vm.block_artist = function () {
                cfpLoadingBar.start();
                if (vm.is_blocked)
                    vm.is_blocked = 0;
                else
                    vm.is_blocked = 1;

                $.post(api.url + 'block_unblock_artist', {
                    access_token: localStorage.getItem('adminToken'),
                    artist_id: vm.id,
                    block_unblock: vm.is_blocked
                }).success(function (data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    console.log(data);
                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                    if (data.is_error == 0) {
                        ngDialog.close();
                        $state.reload();
                    }
                });

            }
        }
    }
})();



/**=========================================================
 * Module: Unverified Artists List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.artists')
        .controller('UnverifiedArtistsController', UnverifiedArtistsController);

    UnverifiedArtistsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function UnverifiedArtistsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument: false
                }).then(function(value) {}, function(reason) {});

            };
            vm.currentPage = 1;
            vm.itemsPerPage = 10;
            vm.maxSize = 5;
            vm.skip = 0;
            vm.pageChanged = function (currentPage) {
                vm.currentPage = currentPage;
                for (var i = 1; i <= vm.totalItems / 10 + 1; i++) {
                    if (vm.currentPage == i) {
                        vm.skip = 10 * (i - 1);
                    }
                }
                vm.customers = [];
                vm.initTable();
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "unverified_artist_list",{
                    access_token: localStorage.getItem('adminToken'),
                    limit: 10,
                    offset: vm.skip
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.artists = data.all_artists;
                            vm.totalItems = data.all_artists.length;
                            console.log(vm.customers)
                        })
                    });

                $.post(api.url + "serving_areas",{
                    access_token: localStorage.getItem('adminToken')
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.areaList = data.serving_areas;
                            console.log(vm.areaList);
                            vm.selectedArea = [];
                            vm.areaCheck = [];
                            for(var i=0;i<vm.areaList;i++){
                                vm.areaCheck[i]=false;
                            }
                        })
                    });
            };
            vm.initTable();
            vm.chooseArea = function(area, index) {
                console.log(area, index);
                console.log(vm.areaCheck[index]);

                if (vm.areaCheck[index]) {
                    if (vm.selectedArea.indexOf(area) == -1)
                        vm.selectedArea.push(area);

                } else {
                    vm.selectedArea.splice(vm.selectedArea.indexOf(area), 1)
                }


                console.log(vm.selectedArea);
                console.log(vm.areaCheck);
            };
            vm.verifyArtist = function (data) {
                vm.artist=data;
                vm.ngDialogPop('verify_artist_modal','bigPop');
            };
            vm.verifyFn = function () {
              if(vm.selectedArea.length==0){
                  toaster.pop("warning","Choose at least one area for the artist to serve in.","");
                  return false;
              }
              vm.areas='';
              for (var i=0;i<vm.selectedArea.length;i++){
                  vm.areas+=vm.selectedArea[i];
                  if(i!=vm.selectedArea.length-1)vm.areas+=',';
              }
                $.post(api.url + "verify_artist",{
                    access_token: localStorage.getItem('adminToken'),
                    artist_id: vm.artist.artist_id,
                    serving_areas:vm.areas
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            if (data.is_error == 0) {
                                ngDialog.close();
                                $state.reload();
                            }
                        })
                    });
            }
        }
    }
})();



/**=========================================================
 * Module: Areas List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.areas')
        .controller('AreasController', AreasController);

    AreasController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function AreasController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "serving_areas",{
                    access_token: localStorage.getItem('adminToken')
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.areaList = data.serving_areas;
                            console.log(vm.customers)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();

/**=========================================================
 * Module: Cancelled List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('CancelledBookingsController', CancelledBookingsController);

    CancelledBookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function CancelledBookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "cancelled_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.cancelledList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.cancelledList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();



/**=========================================================
 * Module: Finished List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('FinishedBookingsController', FinishedBookingsController);

    FinishedBookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function FinishedBookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "finished_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.finishedList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.finishedList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();


/**=========================================================
 * Module: Ongoing List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('OngoingBookingsController', OngoingBookingsController);

    OngoingBookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function OngoingBookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "ongoing_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.ongoingList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.ongoingList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();


/**=========================================================
 * Module: Paid List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('PaidBookingsController', PaidBookingsController);

    PaidBookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function PaidBookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "paid_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.paidList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.paidList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();


/**=========================================================
 * Module: To Be Accepted List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('TBABookingsController', TBABookingsController);

    TBABookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function TBABookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "tobeaccepted_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.tobeAcceptedList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.tobeAcceptedList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();


/**=========================================================
 * Module: Upcoming List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bookings')
        .controller('UpcomingBookingsController', UpcomingBookingsController);

    UpcomingBookingsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function UpcomingBookingsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "upcoming_bookings",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.upcomingList = data.all_bookings;
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.upcomingList)
                        })
                    });
            };
            vm.initTable();

        }
    }
})();


/**=========================================================
 * Module: Category List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function CategoryController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();
            $scope.mCtrl.serving_areas();
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope
                }).then(function(value) {}, function(reason) {});

            };

            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "categories_list",{
                    access_token: localStorage.getItem('adminToken'),
                    area_id: localStorage.getItem('area_id')||1
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.categories = data.categories;
                            vm.totalItems = vm.categories.length;
                            console.log(vm.categories);
                        })
                    });
            };
            vm.initTable();

            vm.viewServices = function (data) {
                localStorage.setItem("cat_id",data.category_id);
                $state.go("app.services");
            };
            vm.selected = [];
            vm.toggleSingle = function (item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected[0]=item;
                }
                console.log(vm.selected);
            };
            vm.exists = function (item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.addEditCategory = function (mode,d) {
                vm.selected = [];
                vm.cat = d||{};
                if(vm.cat.area_id)vm.selected.push(vm.cat.area_id);
                if(vm.cat.order_id)vm.cat.order=vm.cat.order_id;
                else vm.cat.order='Order ID';
                vm.mode = mode;
                vm.ngDialogPop("addEditCatModal",'biggerPop orderPop');
            };
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.cat.file = $scope.mCtrl.processfile(files[0]);
                    vm.cat.fileName = files[0].name;
                    $timeout(function () {
                        console.log(vm.cat.file);
                        if(!vm.cat.file){
                            vm.cat.file = $scope.mCtrl.file;
                            console.log(vm.cat.file);
                        }
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.orderSelect = function (o) {
              vm.cat.order=o;
            };
            vm.addEditCategoryFn = function (mode) {
                if (!vm.cat.category_name) {
                    toaster.pop("error", "Enter the category name", "");
                    return false;
                }
                if (!vm.cat.category_description) {
                    toaster.pop("error", "Enter the category description", "");
                    return false;
                }
                if (vm.selected.length == 0) {
                    toaster.pop("error", "Select an area", "");
                    return false;
                }
                if (mode == 'Add'&&!vm.cat.file) {
                    toaster.pop("error", "Choose a category image", "");
                    return false;
                }
                if(vm.cat.order=='Order ID'){
                    toaster.pop("error", "Choose a category order", "");
                    return false;
                }
                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_category';
                else modeUrl = 'edit_category';
                var form = new FormData();
                var selected_area = '';
                for(var i=0;i<vm.selected.length;i++){
                    selected_area+=vm.selected[i];
                    if(i<vm.selected.length-1)selected_area+=','
                }
                vm.cat.order_id = vm.cat.order;
                form.append("access_token", localStorage.getItem('adminToken'));
                form.append("area_id", selected_area);
                form.append("category_name", vm.cat.category_name);
                form.append("category_description", vm.cat.category_description);
                form.append("order_id", vm.cat.order_id);
                if(mode == 'Add')form.append("category_image", vm.cat.file);
                if(mode == 'Edit'){
                    if(vm.cat.file)form.append("category_image", vm.cat.file);
                    form.append("category_id", vm.cat.category_id);
                }
                cfpLoadingBar.start();
                $http({
                    url: api.url + modeUrl,
                    method: 'POST',
                    data: form,
                    transformRequest: false,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function (data, status) {
                    if (typeof data === 'string') data = JSON.parse(data.data);
                    else var data = data.data;
                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                    if (data.is_error == 0) {
                        ngDialog.close();
                        $state.reload();
                    } else {

                    }
                });
            };
            vm.enableDisableCat = function(i,id){
                vm.block_id=id;
                vm.blockMode=i;
                if(i==1){
                    vm.block="Block";
                }
                else vm.block="Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst",'smallPop');
            };
            vm.enableDisableYes = function () {
                $.post(api.url + 'blockUnblockCategory',{
                    access_token:localStorage.getItem("adminToken"),
                    category_id:vm.block_id,
                    is_blocked:vm.blockMode
                })
                    .success(function (data, status) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            }

        }
    }
})();



/**=========================================================
 * Module: Category Service List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('CategoryServicesController', CategoryServicesController);

    CategoryServicesController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function CategoryServicesController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();

            vm.artistLists();
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope
                }).then(function(value) {}, function(reason) {});

            };
            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "services_list",{
                    access_token: localStorage.getItem('adminToken'),
                    category_id: localStorage.getItem('cat_id')
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.services = data.services;
                            vm.totalItems = vm.services.length;
                            console.log(vm.services);
                        })
                    });
            };
            vm.initTable();
            vm.viewAddServices = function (data) {
                localStorage.setItem("catServ_id",data.service_id);
                $state.go("app.additionalServices");
            };
            vm.selected = [];
            vm.toggleMultiple = function (item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                console.log(vm.selected);
            };
            vm.exists = function (item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.addEditService = function (mode,d) {
                vm.selected = [];
                vm.serv = d||{};
                if(vm.serv.order_id)vm.serv.order=vm.serv.order_id;
                else vm.serv.order='Order ID';
                if(vm.serv.skills_required){
                    vm.serv.skills = vm.serv.skills_required.split(', ');
                    console.log(vm.serv.skills);
                    for(var i=0;i<vm.serv.skills.length;i++)
                    for(var j=0;j<$scope.mCtrl.skills.length;j++)
                    {
                        if(vm.serv.skills[i]==$scope.mCtrl.skills[j].skill)
                        vm.selected.push($scope.mCtrl.skills[j].skill_id);
                    }
                }
                vm.mode = mode;
                vm.ngDialogPop("addEditServModal",'biggerPop orderPop');
            };
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.serv.file = $scope.mCtrl.processfile(files[0]);
                    vm.serv.fileName = files[0].name;
                    $timeout(function () {
                        console.log(vm.serv.file);
                        if(!vm.serv.file){
                            vm.serv.file = $scope.mCtrl.file;
                            console.log(vm.serv.file);
                        }
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.addEditServiceFn = function (mode) {
                if (!vm.serv.service_name) {
                    toaster.pop("error", "Enter the service name", "");
                    return false;
                }
                if (!vm.serv.service_description) {
                    toaster.pop("error", "Enter the service description", "");
                    return false;
                }

                if (mode == 'Add'&&!vm.serv.file) {
                    toaster.pop("error", "Choose a category image", "");
                    return false;
                }
                if (!vm.serv.service_price) {
                    toaster.pop("error", "Enter the service price", "");
                    return false;
                }
                if (!vm.serv.service_time) {
                    toaster.pop("error", "Enter the service time", "");
                    return false;
                }
                if (!vm.serv.service_commission) {
                    toaster.pop("error", "Enter the service commission", "");
                    return false;
                }
                if(vm.serv.order=='Order ID'){
                    toaster.pop("error", "Choose a category order", "");
                    return false;
                }
                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_service';
                else modeUrl = 'edit_service';
                var form = new FormData();
                var skills = '';
                for(var i=0;i<vm.selected.length;i++){
                    skills+=vm.selected[i];
                    if(i<vm.selected.length-1)skills+=','
                }
                vm.serv.order_id = vm.serv.order;
                form.append("access_token", localStorage.getItem('adminToken'));
                form.append("category_id", localStorage.getItem("cat_id"));
                form.append("service_name", vm.serv.service_name);
                form.append("service_description", vm.serv.service_description);
                form.append("order_id", vm.serv.order_id);
                form.append("skills_required", skills||'1');
                form.append("service_price", vm.serv.service_price);
                form.append("service_time", vm.serv.service_time);
                form.append("service_commission", vm.serv.service_commission);
                if(mode == 'Add')form.append("service_image", vm.serv.file);
                if(mode == 'Edit'){
                    if(vm.serv.file)form.append("service_image", vm.serv.file);
                    form.append("service_id", vm.serv.service_id);
                }
                cfpLoadingBar.start();
                $http({
                    url: api.url + modeUrl,
                    method: 'POST',
                    data: form,
                    transformRequest: false,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                    .then(function (data, status) {
                        if (typeof data === 'string') data = JSON.parse(data.data);
                        else var data = data.data;
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            }
        }
    }
})();


/**=========================================================
 * Module: Additional Service List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('AdditionalServicesController', AdditionalServicesController);

    AdditionalServicesController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function AdditionalServicesController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();

            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope
                }).then(function(value) {}, function(reason) {});

            };

            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "as_list",{
                    access_token: localStorage.getItem('adminToken'),
                    service_id: localStorage.getItem('catServ_id')
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.additionalServices = data.additional_services;
                            vm.totalItems = vm.additionalServices.length;
                            console.log(vm.additionalServices);
                        })
                    });
            };
            vm.initTable();
            vm.selected = [];
            vm.toggleMultiple = function (item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                console.log(vm.selected);
            };
            vm.exists = function (item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.addEditAddService = function (mode,d) {
                vm.selected = [];
                vm.addServ = d||{};
                vm.mode = mode;
                vm.ngDialogPop("addEditAddServModal",'biggerPop orderPop');
            };
            vm.addEditAddServiceFn = function (mode) {
                if (!vm.addServ.as_name) {
                    toaster.pop("error", "Enter the additional service name", "");
                    return false;
                }
                if (!vm.addServ.as_description) {
                    toaster.pop("error", "Enter the additional service description", "");
                    return false;
                }
                if (!vm.addServ.as_price) {
                    toaster.pop("error", "Enter the additional service price", "");
                    return false;
                }
                if (!vm.addServ.as_time) {
                    toaster.pop("error", "Enter the additional service time", "");
                    return false;
                }
                if (!vm.addServ.as_commission) {
                    toaster.pop("error", "Enter the additional service commission", "");
                    return false;
                }


                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_additional_service';
                else modeUrl = 'edit_additional_service';
                var form = new FormData();
                var skills = '';
                for(var i=0;i<vm.selected.length;i++){
                    skills+=vm.selected[i];
                    if(i<vm.selected.length-1)skills+=','
                }
                cfpLoadingBar.start();
                var data ={
                  access_token : localStorage.getItem("adminToken"),
                  service_id : localStorage.getItem("catServ_id"),
                  as_name:vm.addServ.as_name,
                  as_description:vm.addServ.as_description,
                  order_id:vm.addServ.order_id||1,
                  // skills_required:vm.addServ.skills||1,
                  as_price:vm.addServ.as_price,
                  as_time:vm.addServ.as_time
                  // as_commission:vm.addServ.as_commission
                };
                if(mode=='Edit')data.as_id=vm.addServ.as_id;
                $.post(api.url + modeUrl,data)
                    .success(function (data, status) {
                        if (typeof data === 'string') data = JSON.parse(data.data);
                        else var data = data.data;
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            }
        }
    }
})();



/**=========================================================
 * Module: Additional Service List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('SkillsController', SkillsController);

    SkillsController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function SkillsController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();

            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope
                }).then(function(value) {}, function(reason) {});

            };

            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "getAdminSkills",{
                    access_token : localStorage.getItem("adminToken")
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function () {
                            vm.skills = data.skills;
                            console.log(vm.skills)
                        })
                    });
            };
            vm.initTable();

            vm.addEditSkill = function (mode,d) {
                vm.skill = d||{};
                vm.mode = mode;
                vm.ngDialogPop("addEditSkillModal",'bigPop');
            };
            vm.addEditSkillFn = function (mode) {
                if (!vm.skill.skill) {
                    toaster.pop("error", "Enter the a valid skill name", "");
                    return false;
                }

                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_skill';
                else modeUrl = 'edit_skill';

                cfpLoadingBar.start();
                var data ={
                    access_token : localStorage.getItem("adminToken"),
                    skill: vm.skill.skill
                };
                if(mode=='Edit')data.skill_id=vm.skill.skill_id;
                $.post(api.url + modeUrl,data)
                    .success(function (data, status) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            };
            vm.enableDisableSkill = function(i,id){
                vm.block_id=id;
                vm.blockMode=i;
                if(i==0){
                    vm.block="Block";
                }
                else vm.block="Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst",'smallPop');
            };
            vm.enableDisableYes = function () {
                $.post(api.url + 'enableDisableSkill',{
                    access_token:localStorage.getItem("adminToken"),
                    skill_id:vm.block_id,
                    is_active:vm.blockMode
                })
                    .success(function (data, status) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            }
        }
    }
})();

/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function FeedbackController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkDoctorToken();

            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "feedback_list",{
                    access_token: localStorage.getItem('adminToken')
                })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function () {
                            vm.feedbackList = data.all_feedback;
                        })
                    });
            };
            vm.initTable();
        }
    }
})();

