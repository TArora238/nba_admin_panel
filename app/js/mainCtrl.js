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

            // Stripe.setPublishableKey(data.stripe_pk);
            $timeout(function() {
              $rootScope.messageList = data.popup;

              // $rootScope.$emit('init');
            });
            $rootScope.profile = {};
            // $rootScope.checkDoctorToken();
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

      }
      vm.loginRedirect = function() {
        localStorage.removeItem('adminToken');
        $state.go('login');
      }
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
          if (!localStorage.getItem('adminToken') || localStorage.getItem('adminToken') == null) {
              localStorage.removeItem('adminToken');
              $state.go('login');
              return false;
          }
      };

      if ($state.current.name.indexOf('app')!==-1&&!localStorage.getItem('profileData')) {
        $state.go('login')
      } else if (localStorage.getItem('profileData')) {
        vm.admin_profile = JSON.parse(localStorage.getItem('profileData'));
        if (vm.admin_profile.plan_id) {

          if (vm.admin_profile.plan_id.indexOf('2') > -1) {
            vm.showPFMenu = 1;
          } else {
            vm.showPFMenu = 0;
          }

        }
        if (vm.admin_profile.is_pdp == 0) {
          vm.showPDPMenu = 0;
        } else {
          vm.showPDPMenu = 1;
        }
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


      
        vm.flagPopUps = function (flag, error) {
            cfpLoadingBar.complete();
            vm.hitInProgress = false;
            if (!$rootScope.messageList || $rootScope.messageList.length == 0) {
                $rootScope.get_settings();
                return false;
            }
            else {
                if ($rootScope.messageList[flag]) {
                    if (error == 1) toaster.pop('error', $rootScope.messageList[flag].text, '');
                    else toaster.pop('success', $rootScope.messageList[flag].text, '');
                }
                else {
                    if (error == 1) toaster.pop('error', 'Something went wrong', '');
                    else toaster.pop('success', 'Success', '');
                }
                vm.hitInProgress = false;
            }
        }
      vm.EmailAvailable = false;
      vm.PhoneAvailable = false;
      vm.check_email = function(id, email) {

        if (email) {
          $.post(api.url + 'check_admin_email', {
              admin_email: email,
              admin_id: id
            })
            .success(function(data, status) {
              if (typeof data === 'string')
                var data = JSON.parse(data);
              // console.log(data);
              vm.flagPopUps(data.flag,data.is_error);
              if (data.is_error == 0) {
                vm.EmailAvailable = false;
              } else {
                vm.EmailAvailable = true;
              }
            });
        } else {
          toaster.pop('error', 'Enter a valid email');
          return false;
        }

      }
      vm.check_mobile = function(id, mobile) {
        console.log(mobile);
        if (mobile) {
          var mob = mobile.replace(/[^0-9]/g, "");

          $.post(api.url + 'check_admin_mobile', {
              admin_mobile: '+1-'+mobile,
              admin_id: id
            })
            .success(function(data, status) {
              if (typeof data === 'string')
                var data = JSON.parse(data);
              // console.log(data);
              vm.flagPopUps(data.flag,data.is_error);
              if (data.is_error == 0) {
                vm.PhoneAvailable = false;
              } else {
                vm.PhoneAvailable = true;
              }
            });
        }
        // else{
        //   toaster.pop('error','Enter a valid mobile');
        //   return false;
        // }

      }
      vm.check_patient_email = function(id, email) {
        console.log(email);
        if (email) {
          $.post(api.url + 'check_patient_email', {
              patient_email: email,
              patient_id: id
            })
            .success(function(data, status) {
              if (typeof data === 'string')
                var data = JSON.parse(data);
              // console.log(data);
              vm.flagPopUps(data.flag,data.is_error);
              if (data.is_error == 0) {
                vm.EmailAvailable = false;
              } else {
                vm.EmailAvailable = true;
              }
            });
        }

      }
      vm.check_patient_mobile = function(id, mobile, code) {
        if (mobile) {
          $.post(api.url + 'check_patient_mobile', {
              patient_mobile: '+' + code.Code + '-' + mobile.replace(/[^0-9]/g, ""),
              patient_id: id
            })

            .success(function(data, status) {
              if (typeof data === 'string')
                var data = JSON.parse(data);
              // console.log(data);
              vm.flagPopUps(data.flag,data.is_error);
              if (data.is_error == 0) {
                vm.PhoneAvailable = false;
              } else {
                vm.PhoneAvailable = true;
              }
            });
        }
      }
      vm.states=[];
      vm.getLocation = function(query) {
        // console.log(query);
        if(query.length<4)return false;
        return $.post(api.url + 'get_zipcode', {
          zipcode: query
        }).then(function(data, status) {
          if (typeof data === 'string')
            var data = JSON.parse(data);
          // console.log(data);
          if (data.is_error == 0) {
            // return vm.items=data.zip_info;
            // console.log(data);
            vm.states = data.zip_info;
            // vm.$apply();
            // if(vm.states.length>0)$('typeahead-popup').css('display','block');
            $timeout(function() {
              return vm.states;
            })
            // querySearch(query);
          }

        });
      }
      vm.changePasswordFn = function() {
        vm.change = {};
        vm.ngDialogPop('change_password_modal', 'bigPop');
      }
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
          vm.flagPopUps(data.flag,data.is_error);

          if (data.is_error == 0) ngDialog.close();
        });
      }
      vm.checkDoctorToken = function(login) {
        // vm.freshUser = localStorage.getItem('freshUser')||0;
        // localStorage.setItem('freshUser',vm.freshUser);

        // console.log(localStorage.getItem('adminToken'));
        // console.log("asdf");
        if (!localStorage.getItem('adminToken')) {
          localStorage.removeItem('adminToken')
          $state.go('login');
          // vm.openToast('warning','Access token has expired, please Login to continue','');
        } else {
          // console.log(localStorage.getItem('adminToken'));
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
              vm.flagPopUps(data.flag,data.is_error);
              if (data.show_plan_screen == 1 || data.show_location_screen == 1 || data.show_bank_screen == 1 || data.show_payment_screen == 1 || data.show_practice_screen == 1) {
                vm.setLoginData(data);
                // if ($state.current.name != "app.dashboard") $state.go("app.dashboard");
                // else $state.reload();
                vm.checkBankScreen();
                if (login == 'register') $state.go('addData');
                if (login == 'bank') $state.reload();
              } else if (data.is_error == 0) {
                vm.setLoginData(data, login);
                vm.checkBankScreen();
              }
            });
        }
      }
      vm.dtOptions = {
        "scrollX": true
      }

      vm.setLoginData = function(data, login) {

        $timeout(function() {
          vm.profile = {};
          if (data.admin_profile && data.admin_profile.access_token) {
              localStorage.setItem('adminToken', data.admin_profile.access_token);
          }
          if(data.admin_profile){
            vm.admin_profile = data.admin_profile;
            localStorage.setItem('profileData', JSON.stringify(data.admin_profile));
          }
          if (data.access_token) localStorage.setItem('adminToken', data.access_token);
          
          vm.admin_notifications = [];
          if(data.admin_notifications)vm.admin_notifications = data.admin_notifications;
          if (data.admin_profile.admin_image)
            vm.profilePicThumb = data.admin_profile.admin_image;
          else vm.profilePicThumb = 'app/img/SVG/profile_placeholder.svg';
          localStorage.setItem('profilePicThumb', vm.profilePicThumb);
          vm.profile.profileData = data.admin_profile;
          localStorage.setItem('admin_name', data.admin_profile.admin_first_name.toString() + ' ' + data.admin_profile.admin_last_name.toString());
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
        vm.select_area = function (a) {
            vm.selected_area = a.area_name;
            vm.area_id = a.area_id;
            localStorage.setItem('selected_area', vm.selected_area);
            localStorage.setItem('area_id', vm.area_id);
            $state.reload();
        };
        vm.serving_area_list = [];
        vm.serving_areas = function () {
            console.log("sd");
            $.post(api.url + "serving_areas", {
                access_token: localStorage.getItem('adminToken')
            })
                .success(function (data, status) {
                    if (typeof data === 'string')
                        var data = JSON.parse(data);
                    // console.log(data);
                    vm.serving_area_list = data.serving_areas;
                    // console.log(vm.serving_area_list);
                });
        };
      vm.admin_name = localStorage.getItem('admin_name');
      vm.profilePicThumb = localStorage.getItem('profilePicThumb');



      vm.logout = function() {
        cfpLoadingBar.start();
          $.post(api.url + "admin_logout", {
              access_token: localStorage.getItem('adminToken'),
              device_type: 0,
              device_id: localStorage.getItem('user')
          })
              .success(function (data, status) {
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
        console.log(file);
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

      }

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
      }



    }
  }
})();
