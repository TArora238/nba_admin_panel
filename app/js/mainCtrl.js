// ========================================================
// *   Run Function for Main Ctrl
// *   Main configs needed before everything
// ========================================================
(function() {
    'use strict';

    angular
        .module('adminPanel')
        .run(mainRun)

    mainRun.$inject = ['$http', '$state', '$timeout', 'api', 'cfpLoadingBar', '$interval', '$rootScope'];

    function mainRun($http, $state, $timeout, api, cfpLoadingBar, $interval, $rootScope) {
        // console.log("execution");
        // console.log('inside main run');
        var aT = window.location.href.split("token=");
        if (aT[1])
            localStorage.setItem('adminToken', aT[1]);
        if (typeof localStorage === 'object') {
            try {
                localStorage.setItem('localStorage', 1);
                localStorage.removeItem('localStorage');
            } catch (e) {
                Storage.prototype._setItem = Storage.prototype.setItem;
                Storage.prototype.setItem = function() {};
                alert('Your web browser does not support storing settings locally, most common cause of this is using "Private Browsing Mode". Some settings may not work properly for you. Please switch to normal browsing mode.');
            }
        }

        // if (!localStorage.getItem('adminToken')) {
        //   localStorage.removeItem('adminToken');
        //   $state.go('login');
        // }
        $('input').attr('autocomplete', 'new-password');
        $rootScope.get_settings = function() {

            if (localStorage.getItem('user')) {
                $.post(api.url + "get_settings", {
                        device_type: 0,
                        app_type: 0,
                        server_type: 0,
                        app_version: 100,
                        device_id: localStorage.getItem('user')
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        // console.log(api.url);
                        api.url = data.port + '/';
                        // console.log(api.url);

                        Stripe.setPublishableKey(data.stripe_key);
                        $timeout(function() {
                            $rootScope.messageList = data.popup;

                            // $rootScope.$emit('init');
                        });
                        $rootScope.profile = {};
                        // $rootScope.checkAdminToken();
                    });

            } else {
                $rootScope.deviceId();
            }

        }
        $rootScope.deviceId = function() {
            new Fingerprint2().get(function(result, components) {
                var hash = result;
                localStorage.setItem('user', hash);
                $rootScope.get_settings();
            });
        };
        $rootScope.deviceId();

        $rootScope.days = [];
        $rootScope.months = [];
        $rootScope.birthYears = [];
        $rootScope.newYears = [];
        var d = new Date();
        $rootScope.today = new Date();
        // console.log($rootScope.today);
        $rootScope.next_month_date = new Date();
        $rootScope.next_month_date.setDate(7);
        $rootScope.next_month_date.setMonth($rootScope.next_month_date.getMonth() + 1);
        $rootScope.next_month_date = moment($rootScope.next_month_date).format('MMM DD, YYYY');
        // console.log($rootScope.next_month_date);
        d.getYear();
        // console.log(d.getYear());
        for (var i = 0; i < 31; i++) {
            $rootScope.days[i] = i + 1;
        }
        for (var j = 0; j < 12; j++) {
            // console.log($rootScope.months[j]);
            $rootScope.months[j] = {
                month: '',
                month_name: ''
            };
            if (j + 1 == 1) $rootScope.months[j].month_name = 'January';
            if (j + 1 == 2) $rootScope.months[j].month_name = 'February';
            if (j + 1 == 3) $rootScope.months[j].month_name = 'March';
            if (j + 1 == 4) $rootScope.months[j].month_name = 'April';
            if (j + 1 == 5) $rootScope.months[j].month_name = 'May';
            if (j + 1 == 6) $rootScope.months[j].month_name = 'June';
            if (j + 1 == 7) $rootScope.months[j].month_name = 'July';
            if (j + 1 == 8) $rootScope.months[j].month_name = 'August';
            if (j + 1 == 9) $rootScope.months[j].month_name = 'September';
            if (j + 1 == 10) $rootScope.months[j].month_name = 'October';
            if (j + 1 == 11) $rootScope.months[j].month_name = 'November';
            if (j + 1 == 12) $rootScope.months[j].month_name = 'December';
            $rootScope.months[j].month = j + 1;
        }
        var currentYear = 1900 + d.getYear();
        var cY = currentYear - 13;
        // console.log(cY);
        for (var i = cY; i > 1900; i--) {
            $rootScope.birthYears[cY - i] = i;
        }
        for (var i = currentYear; i < 2100; i++) {
            $rootScope.newYears[i - currentYear] = i;
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
        .module('app.mainCtrl')
        .controller('mainController', mainController)

    mainController.$inject = ['$http', '$state', '$scope', '$timeout', 'api', 'cfpLoadingBar', '$interval', '$rootScope', 'ngDialog', 'toaster'];
    // 'toaster', 'toastrConfig',
    // toaster, toastrConfig,
    function mainController($http, $state, $scope, $timeout, api, cfpLoadingBar, $interval, $rootScope, ngDialog, toaster) {
        var vm = this;

        // $rootScope.$on('init', function() {
        activate();
        // });
        ////////////////

        function activate() {
            $rootScope.$on("$locationChangeSuccess", function() {
                $timeout(function() {
                    $(window).scrollTop(0);
                    window.scrollTo(0, 0);
                    ngDialog.close();
                    $('.modal-backdrop').remove();
                });
            });
            // console.log(api.url);

            vm.emailPattern = /^[a-z0-9A-Z]+[a-zA-Z0-9.+_]+@[a-z0-9A-Z.-]+\.[a-zA-Z]{2,7}$/;
            vm.namePattern = /^[a-zA-Z 0-9]*$/;
            vm.amountPattern = /^\d+(\.\d{1,2})?$/;

            vm.today = new Date();
            vm.headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
            vm.ngDialogPop = function(template, className) {
                ngDialog.openConfirm({
                    template: template,
                    className: 'ngdialog-theme-default ' + className,
                    scope: $scope
                }).then(function(value) {}, function(reason) {});

            };
            vm.utc_to_local = function(a, b) {
                if (a == null) return '';
                vm.local = '';
                vm.local = new Date(a);
                vm.local = new Date(vm.local.getTime() - parseInt(b) * 60 * 1000);
                return vm.local;
            };
            vm.loginRedirect = function() {
                localStorage.removeItem('adminToken');
                $state.go('login');
            };
            vm.continueToDashboard = function(a) {
                // ngDialog.close();
                // $rootScope.get_settings();
                //
                // if (localStorage.getItem('bankFromFinance') != 1) $state.go('app.dashboard');
                // else $state.go('app.pfFinanceInfo');
                // if(a!=1){
                //     $timeout(function () {
                //       $rootScope.tourGuide();
                //     },200);
                // }
            }




            vm.checkToken = function() {
                cfpLoadingBar.complete();
                if (!localStorage.getItem('adminToken') || localStorage.getItem('adminToken') == null || localStorage.getItem('adminToken') == 'null') {
                    localStorage.removeItem('adminToken');
                    toaster.pop("error", "Your session has expired", "");
                    $state.go('login');
                    event.preventDefault();
                    return false;
                }
            };

            if ($state.current.name.indexOf('app') !== -1 && !localStorage.getItem('profileData')) {
                $state.go('login')
            } else if (localStorage.getItem('profileData')) {
                vm.admin_profile = JSON.parse(localStorage.getItem('profileData'));
            }

            vm.hitInProgress = false;
            vm.countNotfs = function() {
                vm.unreadNotfs = 0;
                for (var i = 0; i < vm.admin_notifications.length; i++) {
                    if (vm.admin_notifications[i].read_at == null) {
                        vm.unreadNotfs++;
                    }
                }
            }
            vm.get_notifications = function() {
                    if (!localStorage.getItem('adminToken') || localStorage.getItem('adminToken') == null) {
                        return false;
                    } else {
                        vm.admin_notifications = [];
                    }
                    $.post(api.url + "get_notifications", {
                            device_type: 0,
                            app_type: 2,
                            app_version: 100,
                            device_id: localStorage.getItem('user'),
                            access_token: localStorage.getItem('adminToken'),
                        })
                        .success(function(data, status) {
                            if (typeof data === 'string')
                                var data = JSON.parse(data);
                            if (data.flag == 4) {
                                $interval.cancel(notfInterval);
                            }
                            $timeout(function() {
                                vm.admin_notifications = data.admin_notifications;
                                vm.countNotfs();
                            });
                        });
                }
                // vm.get_notifications();
            var notfInterval = $interval(function() {
                // vm.get_notifications();
            }, 60000);
            vm.read_notification = function(id, index) {
                vm.admin_notifications = [];
                $.post(api.url + "read_notification", {
                        device_type: 0,
                        app_type: 2,
                        app_version: 100,
                        device_id: localStorage.getItem('user'),
                        access_token: localStorage.getItem('adminToken'),
                        dn_id: id
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);

                        $timeout(function() {

                            vm.admin_notifications = data.admin_notifications;
                            vm.countNotfs();
                        })
                    });
            }
            vm.acceptProspect = function(id, index) {
                vm.admin_notifications = [];
                $.post(api.url + "accept_prospect", {
                        device_type: 0,
                        app_type: 2,
                        app_version: 100,
                        device_id: localStorage.getItem('user'),
                        access_token: localStorage.getItem('adminToken'),
                        dn_id: id
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        vm.read_notification(id);
                    });
            }
            vm.rejectProspect = function(id, index) {
                vm.admin_notifications = [];
                $.post(api.url + "reject_prospect", {
                        device_type: 0,
                        app_type: 2,
                        app_version: 100,
                        device_id: localStorage.getItem('user'),
                        access_token: localStorage.getItem('adminToken'),
                        dn_id: id
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        vm.read_notification(id);
                    });
            }



            vm.flagPopUps = function(flag, error) {
                cfpLoadingBar.complete();
                vm.hitInProgress = false;
                if (flag == 4 || flag == 5 || flag == 1) {
                    localStorage.removeItem('adminToken');
                    $state.go('login');
                    cfpLoadingBar.complete();
                    return false;
                }
                if (!$rootScope.messageList || $rootScope.messageList.length == 0) {
                    $rootScope.get_settings();
                    return false;
                } else {
                    if ($rootScope.messageList[flag]) {
                        if (error == 1) toaster.pop('error', $rootScope.messageList[flag].text, '');
                        else toaster.pop('success', $rootScope.messageList[flag].text, '');
                    } else {
                        if (error == 1) toaster.pop('error', 'Something went wrong', '');
                        else toaster.pop('success', 'Success', '');
                    }
                    vm.hitInProgress = false;
                }
            }

            vm.states = [];
            vm.getLocation = function(query) {
                if (query.length < 4) return false;
                return $.post(api.url + 'get_zipcode', {
                    zipcode: query
                }).then(function(data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    if (data.is_error == 0) {
                        vm.states = data.zip_info;
                        $timeout(function() {
                            return vm.states;
                        })
                    }
                });
            };
            vm.changePasswordFn = function() {
                vm.change = {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
                vm.ngDialogPop('change_password_modal', 'bigPop');
            };
            vm.changePasswordApi = function() {
                if (!vm.change.oldPassword || vm.change.oldPassword.trim().length == 0 || !vm.change.newPassword || vm.change.newPassword.trim().length == 0) {
                    vm.openToast('warning', 'Enter a valid password', '');
                    return false;
                }

                cfpLoadingBar.start();
                $.post(api.url + "change_password", {
                    access_token: localStorage.getItem('adminToken'),
                    old_password: vm.change.oldPassword,
                    new_password: vm.change.newPassword,
                    device_type: 0,
                    app_type: 2,
                    app_version: 100,
                    device_id: localStorage.getItem('user')
                }).success(function(data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    // console.log(data);
                    // vm.flagPopUps(data.flag, data.is_error);

                    if (data.is_error == 0) {
                        cfpLoadingBar.complete();
                        toaster.pop('success', 'Password changed successfully', '');
                        ngDialog.close();
                    } else {
                        cfpLoadingBar.complete();
                        if (data.flag == 20)
                            toaster.pop('error', 'Old Password is incorrect', '');
                    }
                });
            };
            vm.checkAdminToken = function(login) {
                console.log(localStorage.getItem('adminToken'));
                if (!localStorage.getItem('adminToken') || localStorage.getItem('adminToken') == null || localStorage.getItem('adminToken') == 'null') {
                    localStorage.removeItem('adminToken');
                    toaster.pop("error", "Your session has expired", "");
                    $state.go('login');
                } else {
                    $.post(api.url + "access_token_login", {
                            access_token: localStorage.getItem('adminToken'),
                            device_type: 0,
                            app_type: 2,
                            app_version: 100,
                            device_id: localStorage.getItem('user')
                        })
                        .success(function(data, status) {
                            if (typeof data === 'string')
                                var data = JSON.parse(data);
                            console.log(data);
                            // vm.flagPopUps(data.flag,data.is_error);
                            if (data.is_error == 0) {
                                vm.setLoginData(data, login);
                            }
                        });
                }
            };
            vm.dtOptions = {
                "scrollX": true
            };

            vm.setLoginData = function(data, login) {

                $timeout(function() {
                    vm.profile = {};
                    if (data.admin_profile) {
                        vm.admin_profile = data.admin_profile[0];
                        localStorage.setItem('profileData', JSON.stringify(vm.admin_profile));
                        localStorage.setItem('adminToken', vm.admin_profile.access_token);
                    }
                    console.log(vm.admin_profile);
                    vm.admin_notifications = [];
                    if (data.admin_notifications) vm.admin_notifications = data.admin_notifications;
                    if (vm.admin_profile.admin_image)
                        vm.profilePicThumb = vm.admin_profile.admin_image;
                    else vm.profilePicThumb = 'app/img/SVG/profile_placeholder.svg';
                    localStorage.setItem('profilePicThumb', vm.profilePicThumb);
                    vm.profile.profileData = vm.admin_profile;
                    localStorage.setItem('admin_name', vm.admin_profile.admin_name.toString());
                    vm.admin_name = localStorage.getItem('admin_name');
                    vm.profilePicThumb = localStorage.getItem('profilePicThumb');
                    if (login == 1) {
                        vm.serving_areas();
                        $state.go('app.dashboard');
                    } else if (login == 2) {
                        vm.serving_areas();
                        $state.go('app.dashboard');
                    }
                });
            };
            if (localStorage.getItem('selected_area'))
                vm.selected_area = localStorage.getItem('selected_area');
            else
                vm.selected_area = 'Select Area';
            vm.select_area = function(a) {
                vm.selected_area = a.area_name;
                vm.area_id = a.area_id;
                localStorage.setItem('selected_area', vm.selected_area);
                localStorage.setItem('area_id', vm.area_id);
                $state.reload();
            };
            vm.serving_area_list = [];
            vm.serving_areas = function() {
                console.log("sd");
                $.post(api.url + "serving_areas", {
                        access_token: localStorage.getItem('adminToken')
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);
                        // console.log(data);
                        vm.serving_area_list = data.serving_areas;
                        // console.log(vm.serving_area_list);
                    });
            };
            vm.artistLists = function() {
                $.get(api.url + "get_artist_lists")
                    .success(function(data, status) {
                        cfpLoadingBar.complete();
                        if (typeof data === 'string') data = JSON.parse(data);
                        console.log(data);
                        $timeout(function() {
                            vm.document_types = data.document_types;
                            vm.experience_types = data.experience_types;
                            vm.skills = data.skills;
                            console.log(data)
                        })
                    });

            };
            vm.artistLists();

            vm.admin_name = localStorage.getItem('admin_name');
            vm.profilePicThumb = localStorage.getItem('profilePicThumb');



            vm.logout = function() {
                cfpLoadingBar.start();
                $.post(api.url + "admin_logout", {
                        access_token: localStorage.getItem('adminToken'),
                        device_type: 0,
                        device_id: localStorage.getItem('user')
                    })
                    .success(function(data, status) {
                        if (typeof data === 'string')
                            var data = JSON.parse(data);

                        console.log(data);
                        ngDialog.close();
                        localStorage.removeItem('adminToken');
                        toaster.pop('success', 'Logged Out Successfully', '');
                        $state.go('login');
                        cfpLoadingBar.complete();
                    });
            };

            vm.dataURItoBlob = function(dataURI, id) {
                var byteString = atob(dataURI.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var blob = new Blob([ab], {
                    type: 'image/jpeg'
                });
                console.log(blob);
                return blob;
            };


            vm.processfile = function(file) {
                // console.log(file);
                if (!(/image/i).test(file.type)) {
                    alert("File " + file.name + " is not an image.");
                    return false;
                }
                var blob = '';
                // read the files
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function(event) {
                    var blob = new Blob([event.target.result]);
                    window.URL = window.URL || window.webkitURL;
                    var blobURL = window.URL.createObjectURL(blob);
                    var image = new Image();
                    image.src = blobURL;
                    image.onload = function() {
                        var resized = vm.resizeMe(image);
                        // console.log(resized);
                        blob = vm.dataURItoBlob(resized);
                        console.log(blob);
                        vm.file = blob;
                        console.log(vm.file);
                    }
                };
            };

            vm.resizeMe = function(img) {

                var canvas = document.createElement('canvas');

                var width = img.width;
                var height = img.height;
                var max_width = 1024;
                var max_height = 720;
                if (width > height) {
                    if (width > max_width) {
                        height = Math.round(height *= max_width / width);
                        width = max_width;
                    }
                } else {
                    if (height > max_height) {
                        width = Math.round(width *= max_height / height);
                        height = max_height;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                return canvas.toDataURL("image/jpeg", 0.7);
            };



            vm.clear = function() {
                vm.dt = null;
            };

            // Disable weekend selection
            vm.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };
            vm.toggleMin = function() {
                vm.minDate = vm.minDate ? null : new Date();
            };
            vm.toggleMin();

            vm.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                vm.opened = true;
            };
            vm.open1 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                vm.opened1 = true;
            };
            vm.format = "dd MMM, yyyy";
            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };


        }
    }
})();