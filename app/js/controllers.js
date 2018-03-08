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
                    // $scope.mCtrl.checkAdminToken(1);
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
                        cfpLoadingBar.complete();
                        $scope.mCtrl.hitInProgress = false;
                        if (data.flag != 9) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        else toaster.pop("error", "Email and Password don't match", "");
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

    DashboardController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'Colors', 'uiCalendarConfig', '$interval'];

    function DashboardController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, Colors, uiCalendarConfig, $interval) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();
            vm.dashboard = {};

            vm.init = function() {
                $.post(api.url + "dashboard", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        // $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.dashboard = {
                                highly_rated_artists: data.highly_rated_artists,
                                last_5_bookings_made: data.last_5_bookings_made,
                                most_availed_services: data.most_availed_services,
                                most_paid_artists: data.most_paid_artists,
                                number_of_artists: data.number_of_artists,
                                number_of_users: data.number_of_users,
                                recent_5_end_bookings: data.recent_5_end_bookings,
                                upcoming_5_bookings: data.upcoming_5_bookings,
                                number_of_bookings: data.number_of_bookings,
                                number_of_unverified_artists: data.number_of_unverified_artists
                            };
                            for (var i = 0; i < 5; i++) {
                                if (vm.dashboard.last_5_bookings_made[i] && vm.dashboard.last_5_bookings_made[i].local_start_time) {
                                    vm.dashboard.last_5_bookings_made[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.dashboard.last_5_bookings_made[i].local_start_time, vm.dashboard.last_5_bookings_made[i].offset)
                                }
                                if (vm.dashboard.recent_5_end_bookings[i] && vm.dashboard.recent_5_end_bookings[i].local_start_time) {
                                    vm.dashboard.recent_5_end_bookings[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.dashboard.recent_5_end_bookings[i].local_start_time, vm.dashboard.recent_5_end_bookings[i].offset)
                                }
                                if (vm.dashboard.upcoming_5_bookings[i] && vm.dashboard.upcoming_5_bookings[i].local_start_time) {
                                    vm.dashboard.upcoming_5_bookings[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.dashboard.upcoming_5_bookings[i].local_start_time, vm.dashboard.upcoming_5_bookings[i].offset)
                                }
                            }
                            console.log(vm.dashboard)
                        })
                    });
            };
            vm.init();
            // $interval(function () { vm.init(); },20000);
            vm.viewArtistDetails = function(id) {
                localStorage.setItem("fromDashboard", 1);
                localStorage.setItem("artist_id", id);
                $state.go("app.artistProfile");
            };
            vm.viewCustomerDetails = function(id) {
                localStorage.setItem("fromDashboard", 1);
                localStorage.setItem("customer_id", id);
                $state.go("app.profile");
            };

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
            $scope.mCtrl.checkAdminToken();
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
            $scope.mCtrl.checkAdminToken();


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
            vm.pageChanged = function(currentPage) {
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

                $.post(api.url + "user_list", {
                        access_token: localStorage.getItem('adminToken'),
                        limit: 10,
                        offset: vm.skip
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.customers = data.all_users;
                            vm.totalItems = data.all_users.length;
                            console.log(vm.customers);
                        })
                    });
            };
            vm.initTable();

            vm.blockConfirm = function(id, is_blocked) {
                vm.is_blocked = is_blocked;
                vm.id = id;
                if (is_blocked) {
                    vm.blocked = "unblock";
                } else {
                    vm.blocked = "block";
                }
                vm.ngDialogPop('block_user_modal', 'smallPop');
            };

            vm.block_user = function() {
                cfpLoadingBar.start();
                if (vm.is_blocked)
                    vm.is_blocked = 0;
                else
                    vm.is_blocked = 1;

                $.post(api.url + 'block_unblock_user', {
                    access_token: localStorage.getItem('adminToken'),
                    user_id: vm.id,
                    block_unblock: vm.is_blocked
                }).success(function(data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    console.log(data);
                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                    if (data.is_error == 0) {
                        ngDialog.close();
                        $state.reload();
                    }
                });

            };
            vm.viewDetails = function(id) {
                localStorage.setItem("fromDashboard", 0);
                localStorage.setItem("customer_id", id);
                $state.go("app.profile");
            }
        }
    }
})();




/**=========================================================
 * Module: Customer Profile
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.customers')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function CustomerProfileController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument: false
                }).then(function(value) {}, function(reason) {});

            };
            vm.id = localStorage.getItem("customer_id");
            $.post(api.url + 'user_detail', {
                access_token: localStorage.getItem('adminToken'),
                user_id: vm.id
            }).success(function(data, status) {
                if (typeof data === 'string')
                    var data = JSON.parse(data);
                console.log(data);
                vm.profile = {};
                $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                if (data.is_error == 0) {
                    vm.cards = data.user_cards;
                    vm.addresses = data.user_address;
                    vm.last_booking = [];
                    if (angular.equals(data.last_booking, {})) {} else vm.last_booking.push(data.last_booking);
                    vm.not_rated = data.not_rated;
                    vm.past_booking = data.past_booking;
                    vm.ongoing = data.ongoing;
                    vm.upcoming = data.upcoming;
                    vm.in_dispute = data.in_dispute;
                    vm.profile = data.user_profile;
                    console.log(vm.profile);
                    vm.profile.mobile = vm.profile.user_mobile.split("-");
                    vm.profile.countryCode = vm.profile.mobile[0];
                    vm.profile.user_mobile = vm.profile.mobile[1];
                    if (!vm.profile.user_image || vm.profile.user_image == null) vm.profile.profilePic = 'app/img/SVG/avatar.svg';
                    else vm.profile.profilePic = vm.profile.user_image;
                }
            });
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.fileToBeCropped = '';
                    vm.myCroppedImage = '';
                    vm.myImage = '';
                    var reader = new FileReader(); // instance of the FileReader
                    reader.readAsDataURL(files[0]); // read the local file
                    vm.profile.fileName = files[0].name;
                    reader.onloadend = function() {
                        var f = this.result;
                        $timeout(function() {
                            vm.myImage = f;
                            vm.profileEdit = true;
                            vm.ngDialogPop("imageCropPopUp", "bigPop");
                        });
                    };
                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.saveCroppedPic = function() {
                ngDialog.close();
                var blob = $scope.mCtrl.dataURItoBlob(vm.myCroppedImage);
                console.log(blob);
                vm.file = blob;
                console.log(vm.file);
                vm.profile.file = vm.file;
                $timeout(function() {
                    console.log(vm.profile.file);
                    if (!vm.profile.file) {
                        vm.profile.file = vm.file;
                    }
                    console.log(vm.profile.file);
                    vm.saveProfileData(vm.profile.file);
                }, 1000);
            };
            vm.profileEdit = false;
            vm.profileEditFn = function() {
                vm.profileEdit = true;
            };
            vm.saveProfileData = function(f) {
                console.log(f);
                if (vm.profile.user_name.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid name', '');
                    return false;
                }
                if (!vm.profile.user_mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else var mobile = vm.profile.user_mobile.replace(/[^0-9]/g, "");
                if (mobile.length < 9) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                }
                // var mobile='';
                if (!mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else {
                    mobile = vm.profile.user_mobile.replace(/[^0-9]/g, "");
                    if (mobile.length < 9) {
                        toaster.pop('warning', 'Enter a valid mobile', '');
                        return false;
                    }
                }
                if (!vm.profile.user_email || vm.profile.user_email.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid email', '');
                    return false;
                }
                var form = new FormData();
                cfpLoadingBar.start();
                form.append('access_token', localStorage.getItem("adminToken"));
                form.append('user_email', vm.profile.user_email);
                form.append('user_name', vm.profile.user_name);
                form.append('user_id', vm.id);
                form.append('user_mobile', vm.profile.countryCode + '-' + vm.profile.user_mobile.replace(/[^0-9]/g, ""));
                if (vm.profile.file) form.append("user_image", vm.profile.file);
                $http({
                        url: api.url + 'edit_user',
                        method: 'POST',
                        data: form,
                        transformRequest: false,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        console.log(data);
                        var data = data.data;
                        cfpLoadingBar.complete();
                        if (data.is_error == 0) {
                            $state.reload();
                        }
                    });
            }
            vm.back = function() {
                if (localStorage.getItem("fromDashboard") == 1) {
                    $state.go("app.dashboard");
                } else $state.go("app.customers");
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
            $scope.mCtrl.checkAdminToken();


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
            vm.pageChanged = function(currentPage) {
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

                $.post(api.url + "artist_list", {
                        access_token: localStorage.getItem('adminToken'),
                        limit: 10,
                        offset: vm.skip
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.artists = data.all_artists;
                            for (var i = 0; i < vm.artists.length; i++) {
                                if (vm.artists[i].stripe_account_id == null) {
                                    vm.artists[i].bank_added = 0;
                                } else vm.artists[i].bank_added = 1;
                            }
                            vm.totalItems = data.all_artists.length;
                            console.log(vm.artists)
                        })
                    });
            };
            vm.initTable();

            vm.blockConfirm = function(id, is_blocked) {
                vm.is_blocked = is_blocked;
                vm.id = id;
                if (is_blocked) {
                    vm.blocked = "unblock";
                } else {
                    vm.blocked = "block";
                }
                vm.ngDialogPop('block_artist_modal', 'smallPop');
            };

            vm.block_artist = function() {
                cfpLoadingBar.start();
                if (vm.is_blocked)
                    vm.is_blocked = 0;
                else
                    vm.is_blocked = 1;

                $.post(api.url + 'block_unblock_artist', {
                    access_token: localStorage.getItem('adminToken'),
                    artist_id: vm.id,
                    block_unblock: vm.is_blocked
                }).success(function(data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    console.log(data);
                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                    if (data.is_error == 0) {
                        ngDialog.close();
                        $state.reload();
                    }
                });

            };
            vm.viewDetails = function(id) {

                localStorage.setItem("fromDashboard", 0);
                localStorage.setItem("artist_id", id);
                $state.go("app.artistProfile");
            };
            vm.addBank = function(a) {
                localStorage.setItem("artist_id", a.artist_id);
                localStorage.setItem("artist_verified", 1);
                $state.go("app.artistBank");
            }
        }
    }
})();



/**=========================================================
 * Module: Customer Profile
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.artists')
        .controller('ArtistProfileController', ArtistProfileController);

    ArtistProfileController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function ArtistProfileController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument: false
                }).then(function(value) {}, function(reason) {});

            };
            vm.id = localStorage.getItem("artist_id");
            vm.profile = {};
            $.post(api.url + 'artist_detail', {
                access_token: localStorage.getItem('adminToken'),
                artist_id: vm.id
            }).success(function(data, status) {
                if (typeof data === 'string')
                    var data = JSON.parse(data);
                console.log(data);

                $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                if (data.is_error == 0) {
                    vm.last_booking = [];

                    vm.cancelled_booking = data.cancelled_booking;
                    vm.past_booking = data.past_booking;
                    vm.finished_booking = data.finished_booking;
                    vm.started = data.started;
                    vm.to_be_accepted = data.to_be_accepted;
                    vm.upcoming = data.upcoming;

                    vm.total_earned_amount = data.total_earned_amount;

                    vm.profile = data.artist_profile;
                    console.log(vm.profile);
                    vm.profile.mobile = vm.profile.artist_mobile.split("-");
                    vm.profile.countryCode = vm.profile.mobile[0];
                    vm.profile.artist_mobile = vm.profile.mobile[1];
                    vm.profile.experience_type = vm.profile.artist_experience;
                    console.log(vm.profile.artist_experience);

                    vm.selected = vm.profile.artist_skills.split(",");
                    // console.log(vm.selected);
                    for (var i = 0; i < vm.selected.length; i++) {
                        vm.selected[i] = parseInt(vm.selected[i]);
                    }
                    if (!vm.profile.artist_image || vm.profile.artist_image == null) vm.profile.profilePic = 'app/img/SVG/avatar.svg';
                    else vm.profile.profilePic = vm.profile.artist_image;
                }
            });
            vm.selected = [];
            vm.toggleMultiple = function(item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                // console.log(vm.selected);
            };
            vm.exists = function(item) {
                // console.log(item);
                // console.log(vm.selected.indexOf(parseInt(item)) > -1);
                return vm.selected.indexOf(parseInt(item)) > -1;
            };
            vm.experienceSelect = function(sT) {
                vm.profile.artist_experience = sT;
            };
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };

            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.fileToBeCropped = '';
                    vm.myCroppedImage = '';
                    vm.myImage = '';
                    var reader = new FileReader(); // instance of the FileReader
                    reader.readAsDataURL(files[0]); // read the local file
                    vm.profile.fileName = files[0].name;
                    reader.onloadend = function() {
                        var f = this.result;
                        $timeout(function() {
                            vm.myImage = f;
                            vm.profileEdit = true;
                            vm.ngDialogPop("imageCropPopUp", "bigPop");
                        });
                    };
                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.saveCroppedPic = function() {
                ngDialog.close();
                var blob = $scope.mCtrl.dataURItoBlob(vm.myCroppedImage);
                console.log(blob);
                vm.file = blob;
                console.log(vm.file);
                vm.profile.file = vm.file;
                $timeout(function() {
                    console.log(vm.profile.file);
                    if (!vm.profile.file) {
                        vm.profile.file = vm.file;
                    }
                    console.log(vm.profile.file);
                    vm.saveProfileData(vm.profile.file);
                }, 1000);
            };
            vm.profileEdit = false;
            vm.profileEditFn = function() {
                vm.profileEdit = true;
            };
            vm.saveProfileData = function(f) {
                console.log(f);
                if (vm.profile.artist_name.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid name', '');
                    return false;
                }
                if (!vm.profile.artist_mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else var mobile = vm.profile.artist_mobile.replace(/[^0-9]/g, "");
                if (mobile.length < 9) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                }
                // var mobile='';
                if (!mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else {
                    mobile = vm.profile.artist_mobile.replace(/[^0-9]/g, "");
                    if (mobile.length < 9) {
                        toaster.pop('warning', 'Enter a valid mobile', '');
                        return false;
                    }
                }
                if (!vm.profile.artist_email || vm.profile.artist_email.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid email', '');
                    return false;
                }
                if (!vm.profile.artist_experience) {
                    toaster.pop('warning', 'Enter a valid experience', '');
                    return false;
                }
                if (vm.selected.length == 0) {
                    toaster.pop('warning', 'Select at least one skill', '');
                    return false;
                }
                var form = new FormData();
                cfpLoadingBar.start();
                vm.profile.artistSkills = '';
                for (var i = 0; i < vm.selected.length; i++) {
                    vm.profile.artistSkills += vm.selected[i].toString();
                    if (i < vm.selected.length - 1) vm.profile.artistSkills += ',';
                }
                console.log(vm.profile.artistSkills);
                form.append('access_token', localStorage.getItem("adminToken"));
                form.append('artist_email', vm.profile.artist_email);
                form.append('artist_name', vm.profile.artist_name);
                form.append('artist_experience', vm.profile.artist_experience);
                form.append('artist_about', vm.profile.artist_about);
                form.append('serving_areas', vm.profile.serving_areas);
                form.append('artist_skills', vm.profile.artistSkills);
                form.append('artist_id', vm.id);
                form.append('artist_mobile', vm.profile.countryCode + '-' + vm.profile.artist_mobile.replace(/[^0-9]/g, ""));
                if (vm.profile.file) form.append("artist_image", vm.profile.file);
                $http({
                        url: api.url + 'edit_artist',
                        method: 'POST',
                        data: form,
                        transformRequest: false,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        console.log(data);
                        var data = data.data;
                        cfpLoadingBar.complete();
                        if (data.is_error == 0) {
                            $state.reload();
                        }
                    });
            };
            vm.back = function() {
                if (localStorage.getItem("fromDashboard") == 1) {
                    $state.go("app.dashboard");
                } else $state.go("app.verifiedArtists");
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
            $scope.mCtrl.checkAdminToken();


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
            vm.pageChanged = function(currentPage) {
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
                $.post(api.url + "get_admin_skills", {
                        access_token: localStorage.getItem("adminToken")
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.skills = data.skills;
                            console.log(vm.skills)
                            $.post(api.url + "unverified_artist_list", {
                                    access_token: localStorage.getItem('adminToken'),
                                    limit: 10,
                                    offset: vm.skip
                                })
                                .success(function(data, status) {
                                    cfpLoadingBar.complete();
                                    if (typeof data === 'string') data = JSON.parse(data);
                                    console.log(data);
                                    if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                                    $timeout(function() {
                                        vm.artists = data.all_artists;
                                        for (var i = 0; i < vm.artist.length; i++) {
                                            if (vm.artists[i].stripe_account_id == null) {
                                                vm.artists[i].bank_added = 0;
                                            } else vm.artists[i].bank_added = 1;
                                        }
                                        for (var i = 0; i < vm.artists.length; i++) {
                                            vm.artists[i].skills = '';
                                            vm.artistSkills = vm.artists[i].artist_skills.split(",");
                                            for (var j = 0; j < vm.artistSkills.length; j++) {
                                                for (var k = 0; k < vm.skills.length; k++)
                                                    if (vm.artistSkills[j] == vm.skills[k].skill_id) {
                                                        vm.artists[i].skills += vm.skills[k].skill + ' , ';
                                                    }
                                            }
                                            vm.artists[i].skills = vm.artists[i].skills.slice(0, -2);
                                            console.log(vm.artists[i].skills);
                                        }
                                        vm.totalItems = data.all_artists.length;
                                        console.log(vm.customers)
                                    })
                                });
                        })
                    });


                $.post(api.url + "serving_areas", {
                        access_token: localStorage.getItem('adminToken')
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.areaList = data.serving_areas;
                            console.log(vm.areaList);
                            vm.selectedArea = [];
                            vm.areaCheck = [];
                            for (var i = 0; i < vm.areaList; i++) {
                                vm.areaCheck[i] = false;
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

            vm.addBank = function(a) {
                localStorage.setItem("artist_id", a.artist_id);
                localStorage.setItem("artist_verified", 0);
                $state.go("app.artistBank");
            };
            vm.verifyArtist = function(data) {
                vm.artist = data;
                //     vm.ngDialogPop('verify_artist_modal','bigPop');
                // };
                // vm.verifyFn = function () {
                //   if(vm.selectedArea.length==0){
                //       toaster.pop("warning","Choose at least one area for the artist to serve in.","");
                //       return false;
                //   }
                vm.areas = '';
                //   for (var i=0;i<vm.selectedArea.length;i++){
                //       vm.areas+=vm.selectedArea[i];
                //       if(i!=vm.selectedArea.length-1)vm.areas+=',';
                //   }
                $.post(api.url + "verify_artist", {
                        access_token: localStorage.getItem('adminToken'),
                        artist_id: vm.artist.artist_id,
                        serving_areas: vm.areas || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            if (data.is_error == 0) {
                                ngDialog.close();
                                $state.reload();
                            }
                        })
                    });
            };
            vm.addArtistPop = function() {
                vm.ngDialogPop("add_artist_modal", "bigPop");
                vm.profile = {};
                if (localStorage.getItem('area_id') == 1)
                    vm.profile.countryCode = "+44";
                else vm.profile.countryCode = "+91";
            };
            vm.selected = [];
            vm.toggleMultiple = function(item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                // console.log(vm.selected);
            };
            vm.exists = function(item) {
                // console.log(item);
                // console.log(vm.selected.indexOf(parseInt(item)) > -1);
                return vm.selected.indexOf(parseInt(item)) > -1;
            };
            vm.experienceSelect = function(sT) {
                vm.profile.artist_experience = sT;
            };
            vm.uploadFile = function() {
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.fileToBeCropped = '';
                    vm.myCroppedImage = '';
                    vm.myImage = '';
                    var reader = new FileReader(); // instance of the FileReader
                    reader.readAsDataURL(files[0]); // read the local file
                    vm.profile.fileName = files[0].name;
                    reader.onloadend = function() {
                        var f = this.result;
                        $timeout(function() {
                            vm.myImage = f;
                            vm.ngDialogPop("imageCropPopUp", "bigPop");
                        });
                    };
                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.saveCroppedPic = function() {
                // ngDialog.close("ngdialog4");
                var blob = $scope.mCtrl.dataURItoBlob(vm.myCroppedImage);
                console.log(blob);
                vm.file = blob;
                console.log(vm.file);
                vm.profile.file = vm.file;
                $timeout(function() {
                    console.log(vm.profile.file);
                    if (!vm.profile.file) {
                        vm.profile.file = vm.file;
                    }
                    console.log(vm.profile.file);
                }, 1000);
            };
            vm.addArtistFn = function() {

                if (vm.profile.artist_name.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid name', '');
                    return false;
                }
                if (!vm.profile.artist_mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else var mobile = vm.profile.artist_mobile.replace(/[^0-9]/g, "");
                if (mobile.length < 9) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                }
                // var mobile='';
                if (!mobile) {
                    toaster.pop('warning', 'Enter a valid mobile', '');
                    return false;
                } else {
                    mobile = vm.profile.artist_mobile.replace(/[^0-9]/g, "");
                    if (mobile.length < 9) {
                        toaster.pop('warning', 'Enter a valid mobile', '');
                        return false;
                    }
                }
                if (!vm.profile.artist_email || vm.profile.artist_email.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid email', '');
                    return false;
                }
                if (!vm.profile.artist_experience) {
                    toaster.pop('warning', 'Enter a valid experience', '');
                    return false;
                }
                if (vm.selected.length == 0) {
                    toaster.pop('warning', 'Select at least one skill', '');
                    return false;
                }
                if (!vm.profile.file) {
                    toaster.pop('warning', 'Select a profile pic', '');
                    return false;
                }
                var form = new FormData();
                cfpLoadingBar.start();
                vm.profile.artistSkills = '';
                for (var i = 0; i < vm.selected.length; i++) {
                    vm.profile.artistSkills += vm.selected[i].toString();
                    if (i < vm.selected.length - 1) vm.profile.artistSkills += ',';
                }
                console.log(vm.profile.artistSkills);
                form.append('access_token', localStorage.getItem("adminToken"));
                form.append('artist_email', vm.profile.artist_email);
                form.append('artist_name', vm.profile.artist_name);
                form.append('artist_experience', vm.profile.artist_experience);
                form.append('artist_about', vm.profile.artist_about);
                // form.append('serving_areas', vm.profile.serving_areas);
                form.append('artist_skills', vm.profile.artistSkills);
                form.append('artist_mobile', vm.profile.countryCode + '-' + vm.profile.artist_mobile.replace(/[^0-9]/g, ""));
                if (vm.profile.file) form.append("artist_image", vm.profile.file);
                $http({
                        url: api.url + 'add_artist',
                        method: 'POST',
                        data: form,
                        transformRequest: false,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        console.log(data);
                        var data = data.data;
                        cfpLoadingBar.complete();
                        if (data.is_error == 0) {
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
        .controller('ArtistBankController', ArtistBankController);

    ArtistBankController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function ArtistBankController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();

            vm.ngDialogPop = function(template, className) {
                vm.visible = true;
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument: false
                }).then(function(value) {}, function(reason) {});

            };
            vm.artist = {
                address: {}
            };
            vm.artist_id = localStorage.getItem("artist_id");

            vm.locations = [];
            vm.createToken = function() {
                console.log(vm.address);

                if (vm.invalidDate) {
                    toaster.pop('warning', 'Enter a valid date of birth', '');
                    return false;
                }
                if (!vm.artist.artist_first_name || vm.artist.artist_first_name.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid first name', '');
                    return false;
                }
                if (!vm.artist.artist_last_name || vm.artist.artist_last_name.trim().length == 0) {
                    toaster.pop('warning', 'Enter a valid last name', '');
                    return false;
                }

                if (!vm.artist.routing_number || vm.artist.routing_number.trim().length < 6) {
                    toaster.pop('warning', 'Enter a valid routing number', '');
                    return false;
                }
                if (vm.artist.routing_number != vm.artist.confirm_routing_number) {
                    toaster.pop('error', "Routing numbers don't match", '');
                    return false;
                }
                if (!vm.artist.account_number || vm.artist.account_number.trim().length < 8) {
                    toaster.pop('warning', 'Enter a valid account number', '');
                    return false;
                }

                if (vm.artist.account_number != vm.artist.confirm_account_number) {
                    toaster.pop('error', "Account numbers don't match", '');
                    return false;
                }

                $scope.mCtrl.hitInProgress = true;
                cfpLoadingBar.start();
                Stripe.bankAccount.createToken({
                    country: 'GB',
                    currency: "GBP",
                    routing_number: vm.artist.routing_number,
                    account_number: vm.artist.account_number,
                    account_holder_name: vm.artist.artist_first_name + " " + vm.artist.artist_last_name,
                    account_holder_type: "individual"
                }, stripeResponseHandler);

                function stripeResponseHandler(status, response) {
                    console.log(response);
                    if (response.id) {

                        var form = new FormData();
                        // form.append('access_token', localStorage.getItem('doctorToken'));
                        // form.append('artist_id', vm.artist_id);
                        // form.append('artist_first_name', vm.artist.artist_first_name);
                        // form.append('artist_last_name', vm.artist.artist_last_name);
                        // form.append('address', JSON.stringify(vm.address));
                        // form.append('stripe_token', response.id);
                        // form.append('date_of_birth', moment(vm.artist.dob_date).format('DD-MM-YYYY'));
                        var d = {
                            access_token: localStorage.getItem('adminToken'),
                            artist_id: vm.artist_id,
                            artist_first_name: vm.artist.artist_first_name,
                            artist_last_name: vm.artist.artist_last_name,
                            address: JSON.stringify(vm.address),
                            stripe_token: response.id,
                            date_of_birth: moment(vm.artist.dob_date).format('DD-MM-YYYY')
                        };
                        $.post(api.url + "add_artist_payment", d)
                            .success(function(data, status) {
                                if (typeof data === 'string')
                                    var data = JSON.parse(data);
                                else var data = data;
                                console.log(data);
                                if (data.is_error == 0) {
                                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                                    if (localStorage.getItem("artist_verified") == 1) {
                                        $state.go("app.verifiedArtists");
                                    } else $state.go("app.unverifiedArtists");
                                } else {
                                    $scope.mCtrl.hitInProgress = false;
                                    $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                                }

                            })
                    } else {
                        cfpLoadingBar.complete();
                        $scope.mCtrl.hitInProgress = false;
                        toaster.pop('error', 'Invalid Account or Routing Number', '');
                    }

                }
            };
            vm.artist.dob = {
                month: '',
                day: '',
                year: ''
            };
            vm.invalidDate = true;
            vm.artist.dob_date = '';
            console.log(vm.artist.dob);
            vm.check_date = function(dob) {
                console.log(dob);
                if (!dob.day || !dob.month || !dob.year) {
                    vm.invalidDate = true;
                    return false;
                }
                vm.artist.dob_temp = new Date(dob.year, dob.month.month - 1, dob.day);
                // console.log(vm.artist.dob_temp.getTime() > $rootScope.today.getTime());
                // console.log(vm.artist.dob_temp);
                // console.log($rootScope.today);
                if (dob.year % 4 != 0 && dob.month.month == 2 && dob.day > 29) {
                    toaster.pop('error', 'Please enter a valid date', '');
                    vm.invalidDate = true;
                    return false;
                } else if (dob.month.month == 4 || dob.month.month == 6 || dob.month.month == 9 || dob.month.month == 11) {
                    if (dob.day > 30) {
                        toaster.pop('error', 'Please enter a valid date', '');
                        vm.invalidDate = true;
                        return false;
                    }
                    if (vm.artist.dob_temp.getTime() > $rootScope.today.getTime()) {
                        // console.log("Enter a valid Birthdate");
                        vm.invalidDate = true;
                        toaster.pop('error', 'Enter a valid Birthdate', '');
                        // console.log("3");
                        return false;
                    } else {
                        vm.invalidDate = false;
                        // console.log("4");
                        vm.artist.dob_date = new Date(dob.year, dob.month.month - 1, dob.day)
                    }
                } else if (vm.artist.dob_temp.getTime() > $rootScope.today.getTime()) {
                    // console.log("Enter a valid Birthdate");
                    vm.invalidDate = true;
                    toaster.pop('error', 'Enter a valid Birthdate', '');
                    return false;
                } else {
                    vm.invalidDate = false;
                    vm.artist.dob_date = new Date(dob.year, dob.month.month - 1, dob.day)
                }
                console.log(vm.invalidDate);
                console.log(vm.artist.dob_date);
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
            $scope.mCtrl.checkAdminToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "serving_areas", {
                        access_token: localStorage.getItem('adminToken')
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
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
            $scope.mCtrl.checkAdminToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "cancelled_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.cancelledList = data.all_bookings;
                            for (var i = 0; i < vm.cancelledList.length; i++) {
                                vm.cancelledList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_start_time, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_date_booked, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_end_time, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_accepted_at = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_accepted_at, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_started_at = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_started_at, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_ended_at = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_ended_at, vm.cancelledList[i].offset);
                                vm.cancelledList[i].local_rated_at = $scope.mCtrl.utc_to_local_time(vm.cancelledList[i].local_rated_at, vm.cancelledList[i].offset);
                            }
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
            $scope.mCtrl.checkAdminToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "finished_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.finishedList = data.all_bookings;
                            for (var i = 0; i < vm.finishedList.length; i++) {
                                vm.finishedList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_start_time, vm.finishedList[i].offset);
                                vm.finishedList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_date_booked, vm.finishedList[i].offset);
                                vm.finishedList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_end_time, vm.finishedList[i].offset);
                                vm.finishedList[i].local_accepted_at = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_accepted_at, vm.finishedList[i].offset);
                                vm.finishedList[i].local_started_at = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_started_at, vm.finishedList[i].offset);
                                vm.finishedList[i].local_ended_at = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_ended_at, vm.finishedList[i].offset);
                                vm.finishedList[i].local_rated_at = $scope.mCtrl.utc_to_local_time(vm.finishedList[i].local_rated_at, vm.finishedList[i].offset);
                            }
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
            $scope.mCtrl.checkAdminToken();
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

                $.post(api.url + "ongoing_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.ongoingList = data.all_bookings;
                            for (var i = 0; i < vm.ongoingList.length; i++) {
                                vm.ongoingList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.ongoingList[i].local_start_time, vm.ongoingList[i].offset);
                                vm.ongoingList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.ongoingList[i].local_date_booked, vm.ongoingList[i].offset);
                                vm.ongoingList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.ongoingList[i].local_end_time, vm.ongoingList[i].offset);
                                vm.ongoingList[i].local_accepted_at = $scope.mCtrl.utc_to_local_time(vm.ongoingList[i].local_accepted_at, vm.ongoingList[i].offset);
                                vm.ongoingList[i].local_started_at = $scope.mCtrl.utc_to_local_time(vm.ongoingList[i].local_started_at, vm.ongoingList[i].offset);
                            }
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.ongoingList)
                        })
                    });
            };
            vm.initTable();
            vm.cancelBooking = function(b, c) {
                console.log("sdf");
                vm.booking = b;
                vm.booking_id = b.booking_id;
                vm.cancelled_type = c;
                vm.ngDialogPop("cancelBookingConfirmFirst", 'smallPop');
            };
            vm.cancelBookingYes = function() {
                console.log("sdfsdf");
                $.post(api.url + 'cancel_booking_admin', {
                        access_token: localStorage.getItem("adminToken"),
                        booking_id: vm.booking_id,
                        cancelled_type: vm.cancelled_type
                    })
                    .success(function(data, status) {
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
            $scope.mCtrl.checkAdminToken();


            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "paid_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.paidList = data.all_bookings;
                            for (var i = 0; i < vm.paidList.length; i++) {
                                vm.paidList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_start_time, vm.paidList[i].offset);
                                vm.paidList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_date_booked, vm.paidList[i].offset);
                                vm.paidList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_end_time, vm.paidList[i].offset);
                                vm.paidList[i].local_accepted_at = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_accepted_at, vm.paidList[i].offset);
                                vm.paidList[i].local_started_at = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_started_at, vm.paidList[i].offset);
                                vm.paidList[i].local_ended_at = $scope.mCtrl.utc_to_local_time(vm.paidList[i].local_ended_at, vm.paidList[i].offset);
                            }
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
            $scope.mCtrl.checkAdminToken();
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

                $.post(api.url + "tobeaccepted_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.tobeAcceptedList = data.all_bookings;
                            for (var i = 0; i < vm.tobeAcceptedList.length; i++) {
                                vm.tobeAcceptedList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.tobeAcceptedList[i].local_start_time, vm.tobeAcceptedList[i].offset);
                                vm.tobeAcceptedList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.tobeAcceptedList[i].local_date_booked, vm.tobeAcceptedList[i].offset);
                                vm.tobeAcceptedList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.tobeAcceptedList[i].local_end_time, vm.tobeAcceptedList[i].offset);
                            }
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.tobeAcceptedList)

                        })
                    });
            };
            vm.initTable();

            vm.cancelBooking = function(b, c) {
                console.log("sdf");
                vm.booking = b;
                vm.booking_id = b.booking_id;
                vm.cancelled_type = c;
                vm.ngDialogPop("cancelBookingConfirmFirst", 'smallPop');
            };
            vm.cancelBookingYes = function() {
                console.log("sdfsdf");
                $.post(api.url + 'cancel_booking_admin', {
                        access_token: localStorage.getItem("adminToken"),
                        booking_id: vm.booking_id,
                        cancelled_type: vm.cancelled_type
                    })
                    .success(function(data, status) {
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
            vm.editBooking = function(b) {
                vm.booking = b;
                vm.booking_id = b.booking_id;
                vm.booking.mobile = vm.booking.booking_user_mobile.split("-");
                vm.booking.countryCode = vm.booking.mobile[0];
                vm.booking.user_mobile = vm.booking.mobile[1];
                vm.ngDialogPop("editBookingPop", 'bigPop');
            };
            vm.editBookingFn = function() {


                var data = {
                    access_token: localStorage.getItem("adminToken"),
                    booking_id: vm.booking_id,
                    booking_user_name: vm.booking.booking_user_name,
                    booking_user_mobile: vm.booking.countryCode + "-" + vm.booking.user_mobile.replace(/[^0-9]/g, ""),
                    user_email: vm.booking.user_email

                };
                $.post(api.url + 'edit_booking', data)
                    .success(function(data, status) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();
                        } else {}
                    });
            }

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
            $scope.mCtrl.checkAdminToken();
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

                $.post(api.url + "upcoming_bookings", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.upcomingList = data.all_bookings;
                            for (var i = 0; i < vm.upcomingList.length; i++) {
                                vm.upcomingList[i].local_start_time = $scope.mCtrl.utc_to_local_time(vm.upcomingList[i].local_start_time, vm.upcomingList[i].offset);
                                vm.upcomingList[i].local_date_booked = $scope.mCtrl.utc_to_local_time(vm.upcomingList[i].local_date_booked, vm.upcomingList[i].offset);
                                vm.upcomingList[i].local_end_time = $scope.mCtrl.utc_to_local_time(vm.upcomingList[i].local_end_time, vm.upcomingList[i].offset);
                                vm.upcomingList[i].local_accepted_at = $scope.mCtrl.utc_to_local_time(vm.upcomingList[i].local_accepted_at, vm.upcomingList[i].offset);
                            }
                            vm.totalItems = data.all_bookings.length;
                            console.log(vm.upcomingList)
                        })
                    });
            };
            vm.initTable();
            vm.cancelBooking = function(b, c) {
                console.log("sdf");
                vm.booking = b;
                vm.booking_id = b.booking_id;
                vm.cancelled_type = c;
                vm.ngDialogPop("cancelBookingConfirmFirst", 'smallPop');
            };
            vm.cancelBookingYes = function() {
                console.log("sdfsdf");
                $.post(api.url + 'cancel_booking_admin', {
                        access_token: localStorage.getItem("adminToken"),
                        booking_id: vm.booking_id,
                        cancelled_type: vm.cancelled_type
                    })
                    .success(function(data, status) {
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
            $scope.mCtrl.checkAdminToken();
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

                $.post(api.url + "categories_list", {
                        access_token: localStorage.getItem('adminToken'),
                        area_id: localStorage.getItem('area_id') || '2'
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.categories = data.categories;
                            vm.totalItems = vm.categories.length;
                            console.log(vm.categories);
                        })
                    });
            };
            vm.initTable();

            vm.viewServices = function(data) {
                localStorage.setItem("cat_id", data.category_id);
                $state.go("app.services");
            };
            vm.selected = [];
            vm.toggleSingle = function(item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected[0] = item;
                }
                console.log(vm.selected);
            };
            vm.exists = function(item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.addEditCategory = function(mode, d) {
                vm.selected = [];
                vm.cat = d || {};
                if (vm.cat.area_id) vm.selected.push(vm.cat.area_id);
                if (vm.cat.order_id) vm.cat.order = vm.cat.order_id;
                else vm.cat.order = 'Order ID';
                vm.mode = mode;
                vm.ngDialogPop("addEditCatModal", 'biggerPop orderPop');
            };
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.fileToBeCropped = '';
                    vm.myCroppedImage = '';
                    vm.myImage = '';
                    var reader = new FileReader(); // instance of the FileReader
                    reader.readAsDataURL(files[0]); // read the local file
                    vm.cat.fileName = files[0].name;
                    reader.onloadend = function() {
                        var f = this.result;
                        $timeout(function() {
                            vm.myImage = f;
                            vm.ngDialogPop("imageCropPopUp", "bigPop");
                        });
                    };
                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.saveCroppedPic = function() {
                // ngDialog.close();
                var blob = $scope.mCtrl.dataURItoBlob(vm.myCroppedImage);
                console.log(blob);
                vm.file = blob;
                console.log(vm.file);
                vm.cat.file = vm.file;
                $timeout(function() {
                    console.log(vm.cat.file);
                    if (!vm.cat.file) {
                        vm.cat.file = vm.file;
                    }
                    console.log(vm.cat.file);
                }, 1000);
            };
            vm.orderSelect = function(o) {
                vm.cat.order = o;
            };
            vm.addEditCategoryFn = function(mode) {
                if (!vm.cat.category_name) {
                    toaster.pop("error", "Enter the category name", "");
                    return false;
                }
                if (!vm.cat.category_description) {
                    toaster.pop("error", "Enter the category description", "");
                    return false;
                }
                // if (vm.selected.length == 0) {
                //     toaster.pop("error", "Select an area", "");
                //     return false;
                // }
                if (mode == 'Add' && !vm.cat.file) {
                    toaster.pop("error", "Choose a category image", "");
                    return false;
                }
                if (vm.categories.length > 0 && vm.cat.order == 'Order ID') {
                    toaster.pop("error", "Choose a category order", "");
                    return false;
                }

                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_category';
                else modeUrl = 'edit_category';
                var form = new FormData();
                var selected_area = '';
                // for(var i=0;i<vm.selected.length;i++){
                //     selected_area+=vm.selected[i];
                //     if(i<vm.selected.length-1)selected_area+=','
                // }
                vm.cat.order_id = vm.cat.order;
                if (vm.categories.length == 0) {
                    vm.cat.order_id = 1;
                }
                form.append("access_token", localStorage.getItem('adminToken'));
                form.append("area_id", selected_area || '2');
                form.append("category_name", vm.cat.category_name);
                form.append("category_description", vm.cat.category_description);
                form.append("order_id", vm.cat.order_id);
                if (mode == 'Add') form.append("category_image", vm.cat.file);
                if (mode == 'Edit') {
                    if (vm.cat.file) form.append("category_image", vm.cat.file);
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
                    .then(function(data, status) {
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
            vm.enableDisableCat = function(i, id) {
                vm.block_id = id;
                vm.blockMode = i;
                if (i == 1) {
                    vm.block = "Block";
                } else vm.block = "Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst", 'smallPop');
            };
            vm.enableDisableYes = function() {
                cfpLoadingBar.start();
                $.post(api.url + 'block_unblock_category', {
                        access_token: localStorage.getItem("adminToken"),
                        category_id: vm.block_id,
                        is_blocked: vm.blockMode
                    })
                    .success(function(data, status) {
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
            vm.setOrder = function() {
                localStorage.setItem("orderMode", "Categories");
                localStorage.setItem("orderData", JSON.stringify(vm.categories));
                $state.go("app.order");
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
            $scope.mCtrl.checkAdminToken();

            $scope.mCtrl.artistLists();

            vm.ngDialogPop = function(template, className, f) {
                if (f) {
                    ngDialog.openConfirm({
                        template: template,
                        className: 'ngdialog-theme-default ' + className,
                        scope: $scope,
                        closeByEscape: false,
                        closeByDocument: false,
                        showClose: false,
                    }).then(function(value) {}, function(reason) {});
                } else {
                    ngDialog.openConfirm({
                        template: template,
                        className: 'ngdialog-theme-default ' + className,
                        scope: $scope,
                        closeByEscape: false,
                        closeByDocument: false
                    }).then(function(value) {}, function(reason) {});
                }

            }
            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "services_list", {
                        access_token: localStorage.getItem('adminToken'),
                        category_id: localStorage.getItem('cat_id')
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.services = data.services;
                            vm.totalItems = vm.services.length;
                            console.log(vm.services);
                        })
                    });
            };
            vm.initTable();
            vm.viewAddServices = function(data) {
                localStorage.setItem("catServ_id", data.service_id);
                $state.go("app.additionalServices");
            };
            vm.selected = [];
            vm.toggleMultiple = function(item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                console.log(vm.selected);
            };
            vm.exists = function(item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.addEditService = function(mode, d) {
                vm.selected = [];
                vm.serv = d || {};
                if (vm.serv.order_id) vm.serv.order = vm.serv.order_id;
                else vm.serv.order = 'Order ID';
                if (vm.serv.skills_required) {
                    vm.serv.skills = vm.serv.skills_required.split(', ');
                    console.log(vm.serv.skills);
                    for (var i = 0; i < vm.serv.skills.length; i++)
                        for (var j = 0; j < $scope.mCtrl.skills.length; j++) {
                            if (vm.serv.skills[i] == $scope.mCtrl.skills[j].skill)
                                vm.selected.push($scope.mCtrl.skills[j].skill_id);
                        }
                }
                vm.mode = mode;
                vm.ngDialogPop("addEditServModal", 'biggerPop orderPop', 1);
            };
            vm.uploadFile = function() {
                vm.manualEnter = 0;
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    $timeout(function() {
                        vm.serv.fileName = files[0].name;
                        vm.serv.file = files[0];
                    });


                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.uploadFileThumb = function() {
                vm.manualEnter = 0;
                $('.fileUploadThumb').trigger('click');
            };
            $scope.thumbFileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    // vm.fileToBeCropped = '';
                    // vm.myCroppedImage = '';
                    // vm.myImage = '';
                    // var reader = new FileReader(); // instance of the FileReader
                    // reader.readAsDataURL(files[0]); // read the local file
                    // vm.serv.thumbFileName = files[0].name;
                    // reader.onloadend = function() {
                    //     var f = this.result;
                    //     $timeout(function() {
                    //         vm.myImage = f;
                    //         vm.ngDialogPop("imageCropPopUp", "bigPop");
                    //     });
                    // };
                    $timeout(function() {
                        vm.serv.thumbFileName = files[0].name;
                        vm.serv.fileThumb = files[0];
                    });
                } else {
                    toaster.pop('error', 'Please choose a file', '');

                }
            };
            vm.saveCroppedPic = function() {
                // ngDialog.close();
                var blob = $scope.mCtrl.dataURItoBlob(vm.myCroppedImage);
                console.log(blob);
                vm.file = blob;
                console.log(vm.file);
                vm.serv.fileThumb = vm.file;
                $timeout(function() {
                    console.log(vm.serv.fileThumb);
                    if (!vm.serv.fileThumb) {
                        vm.serv.fileThumb = vm.file;
                    }
                    console.log(vm.serv.fileThumb);
                }, 1000);
            };
            vm.orderSelect = function(o) {
                vm.serv.order = o;
            };
            vm.addEditServiceFn = function(mode) {
                if (!vm.serv.service_name) {
                    toaster.pop("error", "Enter the service name", "");
                    return false;
                }
                if (!vm.serv.service_description) {
                    toaster.pop("error", "Enter the service description", "");
                    return false;
                }

                if (mode == 'Add' && !vm.serv.file) {
                    toaster.pop("error", "Choose a service image", "");
                    return false;
                }
                if (mode == 'Add' && !vm.serv.fileThumb) {
                    toaster.pop("error", "Choose a service thumb image", "");
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
                if (vm.services.length > 0 && vm.serv.order == 'Order ID') {
                    toaster.pop("error", "Choose a service order", "");
                    return false;
                }


                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_service';
                else modeUrl = 'edit_service';
                var form = new FormData();
                var skills = '';
                for (var i = 0; i < vm.selected.length; i++) {
                    skills += vm.selected[i];
                    if (i < vm.selected.length - 1) skills += ','
                }
                vm.serv.order_id = vm.serv.order;
                if (vm.services.length == 0) {
                    console.log("Asfdbf");
                    vm.serv.order_id = 1;
                }
                form.append("access_token", localStorage.getItem('adminToken'));
                form.append("category_id", localStorage.getItem("cat_id"));
                form.append("service_name", vm.serv.service_name);
                form.append("service_description", vm.serv.service_description);
                form.append("order_id", vm.serv.order_id);
                form.append("skills_required", skills || 1);
                form.append("service_price", vm.serv.service_price);
                form.append("service_time", vm.serv.service_time);
                form.append("service_commission", vm.serv.service_commission);
                if (mode == 'Add') {
                    form.append("service_image", vm.serv.file);
                    form.append("thumb_pic", vm.serv.fileThumb);
                }
                if (mode == 'Edit') {
                    if (vm.serv.file) form.append("service_image", vm.serv.file);
                    if (vm.serv.fileThumb) form.append("thumb_pic", vm.serv.fileThumb);
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
                    .then(function(data, status) {
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
            vm.enableDisableCatServ = function(i, id) {
                vm.block_id = id;
                vm.blockMode = i;
                if (i == 1) {
                    vm.block = "Block";
                } else vm.block = "Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst", 'smallPop');
            };
            vm.enableDisableYes = function() {
                cfpLoadingBar.start();
                $.post(api.url + 'block_unblock_service', {
                        access_token: localStorage.getItem("adminToken"),
                        service_id: vm.block_id,
                        is_blocked: vm.blockMode
                    })
                    .success(function(data, status) {
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
            vm.setOrder = function() {
                localStorage.setItem("orderMode", "Services");
                localStorage.setItem("orderData", JSON.stringify(vm.services));
                $state.go("app.order");
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
            $scope.mCtrl.checkAdminToken();

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
                $.post(api.url + "as_type_list", {
                        access_token: localStorage.getItem("adminToken")
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.as_types = data.as_type;
                            console.log(vm.as_types);
                            $.post(api.url + "as_list", {
                                    access_token: localStorage.getItem('adminToken'),
                                    service_id: localStorage.getItem('catServ_id')
                                })
                                .success(function(data, status) {
                                    cfpLoadingBar.complete();
                                    if (typeof data === 'string') data = JSON.parse(data);
                                    console.log(data);
                                    if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                                    $timeout(function() {
                                        vm.additionalServices = data.additional_services;
                                        vm.totalItems = vm.additionalServices.length;
                                        for (var j = 0; j < vm.additionalServices.length; j++) {
                                            for (var i = 0; i < vm.as_types.length; i++) {
                                                if (vm.additionalServices[j].type == vm.as_types[i].type) {
                                                    vm.additionalServices[j].type_name = vm.as_types[i].type_name;
                                                }
                                            }
                                        }
                                        console.log(vm.additionalServices);
                                    })
                                });
                        })
                    });


            };
            vm.initTable();
            vm.selected = [];
            vm.toggleMultiple = function(item) {
                var idx = vm.selected.indexOf(item);
                if (idx > -1) {
                    vm.selected.splice(idx, 1);
                } else {
                    vm.selected.push(item);
                }
                console.log(vm.selected);
            };
            vm.exists = function(item) {
                return vm.selected.indexOf(item) > -1;
            };
            vm.orderSelect = function(o) {
                vm.addServ.order = o;
            };
            vm.typeSelect = function(o) {
                vm.addServ.type = o.type;
                vm.addServ.type_name = o.type_name;
            };
            vm.addEditAddService = function(mode, d) {
                vm.selected = [];
                vm.addServ = d || {};

                if (vm.addServ.type) {
                    vm.addServ.type = vm.addServ.type;

                } else {
                    vm.addServ.type_name = 'Select Type';
                }
                if (vm.addServ.order_id) vm.addServ.order = vm.addServ.order_id;
                else vm.addServ.order = 'Order ID';
                vm.mode = mode;
                vm.ngDialogPop("addEditAddServModal", 'biggerPop orderPop');
            };
            vm.addEditAddServiceFn = function(mode) {
                console.log(vm.addServ);
                if (!vm.addServ.as_name) {
                    toaster.pop("error", "Enter the additional service name", "");
                    return false;
                }
                if (!vm.addServ.as_description) {
                    toaster.pop("error", "Enter the additional service description", "");
                    return false;
                }
                if (vm.addServ.as_price < 0) {
                    toaster.pop("error", "Enter the additional service price", "");
                    return false;
                }
                if (vm.addServ.as_time < 0) {
                    toaster.pop("error", "Enter the additional service time", "");
                    return false;
                }
                if (vm.additionalServices.length > 0 && vm.addServ.order == 'Order ID') {
                    toaster.pop("error", "Choose a service order", "");
                    return false;
                }
                if (vm.addServ.type == '' || vm.addServ.type_name == 'Select Type') {
                    toaster.pop("error", "Choose a service type", "");
                    return false;
                }
                // if (!vm.addServ.as_commission) {
                //     toaster.pop("error", "Enter the additional service commission", "");
                //     return false;
                // }


                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_additional_service';
                else modeUrl = 'edit_additional_service';
                var form = new FormData();
                var skills = '';
                for (var i = 0; i < vm.selected.length; i++) {
                    skills += vm.selected[i];
                    if (i < vm.selected.length - 1) skills += ','
                }
                cfpLoadingBar.start();
                var data = {
                    access_token: localStorage.getItem("adminToken"),
                    service_id: localStorage.getItem("catServ_id"),
                    as_name: vm.addServ.as_name,
                    as_description: vm.addServ.as_description,
                    order_id: vm.addServ.order || 1,
                    type: vm.addServ.type,
                    // skills_required:vm.addServ.skills||1,
                    as_price: vm.addServ.as_price,
                    as_time: vm.addServ.as_time
                        // as_commission:vm.addServ.as_commission
                };
                if (mode == 'Edit') data.as_id = vm.addServ.as_id;
                $.post(api.url + modeUrl, data)
                    .success(function(data, status) {
                        console.log(data);
                        // return false;
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();

                        } else {

                        }
                    });
            };
            vm.enableDisableAddServ = function(i, id) {
                vm.block_id = id;
                vm.blockMode = i;
                if (i == 1) {
                    vm.block = "Block";
                } else vm.block = "Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst", 'smallPop');
            };
            vm.enableDisableYes = function() {
                cfpLoadingBar.start();
                $.post(api.url + 'block_unblock_aservice', {
                        access_token: localStorage.getItem("adminToken"),
                        as_id: vm.block_id,
                        is_blocked: vm.blockMode
                    })
                    .success(function(data, status) {
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
            vm.setOrder = function() {
                localStorage.setItem("orderMode", "Additional Services");
                localStorage.setItem("orderData", JSON.stringify(vm.additionalServices));
                $state.go("app.order");
            }
        }
    }
})();



/**=========================================================
 * Module: Additional Service Type List
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('ASTypesController', ASTypesController);

    ASTypesController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function ASTypesController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();

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
            vm.as_types = [];
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "as_type_list", {
                        access_token: localStorage.getItem("adminToken")
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.as_types = data.as_type;
                            console.log(vm.as_types)
                        })
                    });
            };
            vm.initTable();

            vm.addEditType = function(mode, d) {
                vm.type = d || {};
                vm.mode = mode;
                vm.ngDialogPop("addEditTypeModal", 'smallPop');
            };
            vm.addEditTypeFn = function(mode) {
                if (!vm.type.type_name) {
                    toaster.pop("error", "Enter the a valid skill name", "");
                    return false;
                }

                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_as_type';
                else modeUrl = 'edit_as_type';

                cfpLoadingBar.start();
                var data = {
                    access_token: localStorage.getItem("adminToken"),
                    type_name: vm.type.type_name,
                    can_select_multiple: vm.type.can_select_multiple ? 1 : 0
                };
                if (mode == 'Edit') data.as_type_id = vm.type.as_type_id;
                $.post(api.url + modeUrl, data)
                    .success(function(data, status) {
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
            vm.enableDisableType = function(i, id) {
                vm.block_id = id;
                vm.blockMode = i;
                if (i == 0) {
                    vm.block = "Block";
                } else vm.block = "Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst", 'smallPop');
            };
            vm.enableDisableYes = function() {
                $.post(api.url + 'enable_disable_as_type', {
                        access_token: localStorage.getItem("adminToken"),
                        as_type_id: vm.block_id,
                        is_active: vm.blockMode
                    })
                    .success(function(data, status) {
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
 * Module: Skills List
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
            $scope.mCtrl.checkAdminToken();

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

                $.post(api.url + "get_admin_skills", {
                        access_token: localStorage.getItem("adminToken")
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.skills = data.skills;
                            console.log(vm.skills)
                        })
                    });
            };
            vm.initTable();

            vm.addEditSkill = function(mode, d) {
                vm.skill = d || {};
                vm.mode = mode;
                vm.ngDialogPop("addEditSkillModal", 'bigPop');
            };
            vm.addEditSkillFn = function(mode) {
                if (!vm.skill.skill) {
                    toaster.pop("error", "Enter the a valid skill name", "");
                    return false;
                }

                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_skill';
                else modeUrl = 'edit_skill';

                cfpLoadingBar.start();
                var data = {
                    access_token: localStorage.getItem("adminToken"),
                    skill: vm.skill.skill
                };
                if (mode == 'Edit') data.skill_id = vm.skill.skill_id;
                $.post(api.url + modeUrl, data)
                    .success(function(data, status) {
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
            vm.enableDisableSkill = function(i, id) {
                vm.block_id = id;
                vm.blockMode = i;
                if (i == 0) {
                    vm.block = "Block";
                } else vm.block = "Unblock";
                vm.ngDialogPop("enableDisableConfirmFirst", 'smallPop');
            };
            vm.enableDisableYes = function() {
                $.post(api.url + 'enable_disable_skill', {
                        access_token: localStorage.getItem("adminToken"),
                        skill_id: vm.block_id,
                        is_active: vm.blockMode
                    })
                    .success(function(data, status) {
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
 * Module: Feedback Controller
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
            $scope.mCtrl.checkAdminToken();

            vm.dtOptions = {
                "scrollX": true
            };
            vm.initTable = function() {
                cfpLoadingBar.start();

                $.post(api.url + "feedback_list", {
                        access_token: localStorage.getItem('adminToken')
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.feedbackList = data.all_feedback;
                        })
                    });
            };
            vm.initTable();
        }
    }
})();


/**=========================================================
 * Module: Feedback Controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('BlogController', BlogController);

    BlogController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function BlogController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();
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

                $.post(api.url + "get_blog", {
                        access_token: localStorage.getItem('adminToken')
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        if (data.is_error == 1) $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        $timeout(function() {
                            vm.blogList = data.blogs;
                            for (var i = 0; i < vm.blogList.length; i++) {
                                vm.blogList[i].date_created = $scope.mCtrl.utc_to_local(vm.blogList[i].date_created);
                                vm.blogList[i].last_modified = $scope.mCtrl.utc_to_local(vm.blogList[i].last_modified);
                            }
                        })
                    });
            };
            vm.initTable();
            vm.deleteBlog = function(i, id) {
                vm.blog_id = id;
                vm.ngDialogPop("deleteConfirmFirst", 'smallPop');
            };
            vm.deleteBlogFn = function() {
                cfpLoadingBar.start();
                $.post(api.url + 'delete_blog', {
                        access_token: localStorage.getItem("adminToken"),
                        blog_id: vm.blog_id
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        else var data = data;
                        console.log(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();
                        } else {}
                    });
            }
            vm.addEditBlog = function(mode, d) {
                vm.blog = d || {};
                vm.mode = mode;
                vm.ngDialogPop("addEditBlogModal", 'bigPop');
            };
            vm.addEditBlogFn = function(mode) {
                vm.blog.content = '<div>Hi</div>';
                if (!vm.blog.title) {
                    toaster.pop('warning', 'Enter a valid title', '');
                    return false;
                }
                if (!vm.blog.author) {
                    toaster.pop('warning', 'Enter a valid author', '');
                    return false;
                }
                if (!vm.blog.short_desc) {
                    toaster.pop('warning', 'Enter a valid short description', '');
                    return false;
                }
                if (!vm.blog.content) {
                    toaster.pop('warning', 'Enter a valid content', '');
                    return false;
                }
                if (mode == 'Add') {
                    if (!vm.blog.file) {
                        toaster.pop('warning', 'Choose a thumbnail', '');
                        return false;
                    }
                }
                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_blog';
                else {
                    modeUrl = 'edit_blog';
                }
                var form = new FormData();
                cfpLoadingBar.start();
                form.append('access_token', localStorage.getItem("adminToken"));
                form.append('title', vm.blog.title);
                form.append('author', vm.blog.author);
                form.append('content', vm.blog.content);
                form.append('short_desc', vm.blog.short_desc);
                if (vm.blog.file) form.append("thumb_pic", vm.blog.file);
                if (modeUrl == 'edit_blog') {
                    form.append('blog_id', vm.blog.blog_id);
                }
                $http({
                        url: api.url + modeUrl,
                        method: 'POST',
                        data: form,
                        transformRequest: false,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                        console.log(data);
                        var data = data.data;
                        cfpLoadingBar.complete();
                        if (data.is_error == 0) {
                            ngDialog.close();
                            $state.reload();
                        }
                    });
            }
            vm.uploadFile = function() {
                $('.fileUpload').trigger('click');
            };
            $scope.fileUpload = function(files) {
                if (files.length > 0) {
                    console.log(files);
                    vm.fileToBeCropped = '';
                    vm.myCroppedImage = '';
                    vm.myImage = '';
                    // var reader = new FileReader(); // instance of the FileReader
                    // reader.readAsDataURL(files[0]); // read the local file
                    $timeout(function() {
                        vm.blog.fileName = files[0].name;
                        vm.blog.file = files[0];
                    });
                    // reader.onloadend = function() {
                    //     var f = this.result;
                    //     $timeout(function() {
                    //         vm.myImage = f;
                    //         vm.profileEdit = true;

                    //     });
                    // };
                } else {
                    toaster.pop('error', 'Please choose a file', '');
                }
            };
        }
    }
})();



/**=========================================================
 * Module: Order Controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('OrderController', OrderController);

    OrderController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function OrderController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();

            vm.sortableOptions = {
                placeholder: 'box-placeholder m0'
            };
            vm.orderMode = localStorage.getItem("orderMode");
            vm.orderData = JSON.parse(localStorage.getItem("orderData"));
            console.log(vm.orderMode);
            console.log(vm.orderData);
            vm.cancelSave = function() {
                if (vm.orderMode == 'Categories') $state.go("app.categories");
                if (vm.orderMode == 'Services') $state.go("app.services");
                if (vm.orderMode == 'Additional Services') $state.go("app.additionalServices");
            };
            vm.saveOrder = function() {
                console.log(vm.orderData);
                // return false;
                if (vm.orderMode == 'Categories') {
                    cfpLoadingBar.start();
                    vm.category_ids = '';
                    for (var i = 0; i < vm.orderData.length; i++) {
                        vm.category_ids += vm.orderData[i].category_id;
                        if (i < vm.orderData.length - 1) vm.category_ids += ',';
                    }
                    $.post(api.url + "order_categories", {
                            access_token: localStorage.getItem('adminToken'),
                            area_id: '2',
                            category_ids: vm.category_ids
                        })
                        .success(function(data, status) {
                            cfpLoadingBar.complete();
                            if (typeof data === 'string') data = JSON.parse(data);
                            console.log(data);
                            $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                            $timeout(function() {
                                $state.go("app.categories");
                            })
                        });
                }
                if (vm.orderMode == 'Services') {
                    cfpLoadingBar.start();
                    vm.service_ids = '';
                    for (var i = 0; i < vm.orderData.length; i++) {
                        vm.service_ids += vm.orderData[i].service_id;
                        if (i < vm.orderData.length - 1) vm.service_ids += ',';
                    }
                    $.post(api.url + "order_services", {
                            access_token: localStorage.getItem('adminToken'),
                            category_id: localStorage.getItem('cat_id'),
                            service_ids: vm.service_ids
                        })
                        .success(function(data, status) {
                            cfpLoadingBar.complete();
                            if (typeof data === 'string') data = JSON.parse(data);
                            console.log(data);
                            $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                            $timeout(function() {
                                $state.go("app.services");
                            })
                        });
                }
                if (vm.orderMode == 'Additional Services') {
                    cfpLoadingBar.start();
                    vm.as_ids = '';
                    for (var i = 0; i < vm.orderData.length; i++) {
                        vm.as_ids += vm.orderData[i].as_id;
                        if (i < vm.orderData.length - 1) vm.as_ids += ',';
                    }
                    $.post(api.url + "order_additional_services", {
                            access_token: localStorage.getItem('adminToken'),
                            service_id: localStorage.getItem('catServ_id'),
                            as_ids: vm.as_ids
                        })
                        .success(function(data, status) {
                            cfpLoadingBar.complete();
                            if (typeof data === 'string') data = JSON.parse(data);
                            console.log(data);
                            $scope.mCtrl.flagPopUps(data.flag, data.is_error);
                            $timeout(function() {
                                $state.go("app.additionalServices");
                            })
                        });
                }
            };
        }
    }
})();



/**=========================================================
 * Module: Promo Code
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('PromoController', PromoController);

    PromoController.$inject = ['$http', '$state', '$rootScope', 'toaster', '$scope', 'cfpLoadingBar', 'api', '$timeout', 'ngDialog'];

    function PromoController($http, $state, $rootScope, toaster, $scope, cfpLoadingBar, api, $timeout, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $scope.mCtrl.checkToken();
            $scope.mCtrl.checkAdminToken();

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
                $.post(api.url + "get_promo_types", {
                        access_token: localStorage.getItem("adminToken")
                    })
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.promoTypes = data.promo_types;
                            $.post(api.url + "get_promo_code", {
                                    access_token: localStorage.getItem("adminToken")
                                })
                                .success(function(data, status) {
                                    cfpLoadingBar.complete();
                                    if (typeof data === 'string') data = JSON.parse(data);
                                    console.log(data);
                                    $timeout(function() {
                                        vm.promos = data.data;
                                        console.log(vm.promos)
                                    })
                                });

                        })
                    });
            };
            vm.initTable();

            vm.addEditPromo = function(mode, d) {
                vm.promo = d || {};
                if (d) {
                    vm.promo.promo_type_name = d.promo_type;
                    for (var i = 0; i < vm.promoTypes.length; i++) {
                        if (d.promo_type == vm.promoTypes[i].pt_name) {
                            vm.promo.promo_type = vm.promoTypes[i].pt_id;
                        }
                    }
                } else {
                    vm.promo.promo_type_name = "Select promo type";
                    vm.promo.promo_type = "";
                    vm.promo.no_end_date = true;
                    vm.promo.infinite = false;
                }
                vm.mode = mode;
                vm.ngDialogPop("addEditPromoModal", 'bigPop');
            };
            vm.choosePromoType = function(pT) {
                vm.promo.promo_type = pT.pt_id;
                vm.promo.promo_type_name = pT.pt_name;
            };
            vm.addEditPromoFn = function(mode) {
                if (!vm.promo.promo_code) {
                    toaster.pop("error", "Enter a promo name");
                    return false;
                }
                if (!vm.promo.description) {
                    toaster.pop("error", "Enter a promo description");
                    return false;
                }
                if (!vm.promo.promo_type) {
                    toaster.pop("error", "Choose a promo type");
                    return false;
                }
                if (!vm.promo.start_date) {
                    toaster.pop("error", "Choose a promo start date");
                    return false;
                }
                if (!vm.promo.no_end_date && !vm.promo.end_date) {
                    toaster.pop("error", "Choose a promo end date");
                    return false;
                }
                if (!vm.promo.infinite && !vm.promo.number_issued) {
                    toaster.pop("error", "Choose a promo use limit");
                    return false;
                }

                var modeUrl = '';
                if (mode == 'Add') modeUrl = 'add_promo_code';
                else modeUrl = 'edit_promo_code';

                cfpLoadingBar.start();
                var data = {
                    access_token: localStorage.getItem("adminToken"),
                    promo_code: vm.promo.promo_code,
                    description: vm.promo.description,
                    promo_value: vm.promo.promo_value,
                    promo_type: vm.promo.promo_type,
                    start_date: moment(vm.promo.start_date).format("YYYY-MM-DD HH:MM:SS"),
                    area_id: 1



                };
                if (vm.promo.infinite) {
                    data.infinite = 1;
                    data.number_issued = 1;
                } else {
                    data.infinite = 0;
                    data.number_issued = vm.promo.number_issued;
                }
                if (vm.promo.no_end_date) {
                    data.no_end_date = 1;
                    data.end_date = moment(vm.promo.start_date).format("YYYY-MM-DD HH:MM:SS");
                } else {
                    data.no_end_date = 0;
                    data.end_date = moment(vm.promo.end_date).format("YYYY-MM-DD HH:MM:SS");
                }

                if (mode == 'Edit') data.promo_id = vm.promo.promo_id;
                $.post(api.url + modeUrl, data)
                    .success(function(data, status) {
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
            vm.deletePromo = function(i, id) {
                vm.pc_id = id;
                vm.blockMode = i;
                if (i == 0) {
                    vm.block = "Delete";
                } else vm.block = "";
                vm.ngDialogPop("deleteConfirmFirst", 'smallPop');
            };
            vm.deletePromoYes = function() {
                $.post(api.url + 'delete_promo_code', {
                        access_token: localStorage.getItem("adminToken"),
                        pc_id: vm.pc_id
                    })
                    .success(function(data, status) {
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