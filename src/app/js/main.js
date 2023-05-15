var LibraryManagerApp = angular.module('LibraryManagerApp',[
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'ngSanitize',
    'uiRouterStyles',
    'ngCookies',
    'ngTable'
]);
LibraryManagerApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
       
    });
}]);

LibraryManagerApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

LibraryManagerApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    var app = '/src/app';
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state("login", {
        url: "/login",
        templateUrl: app+'/login/login.view.html',
        data: {
            pageTitle: 'Login',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "LoginCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/login/login.controller.js',
                        app+'/login/login.service.js'
                    ]
                });
            }]
        }
    })
    .state("dashboard", {
        url: "/dashboard",
        templateUrl: app+'/dashboard/dashboard.view.html',
        data: {
            pageTitle: 'Dashboard',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "DashboardCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/dashboard/dashboard.controller.js',
                        app+'/dashboard/dashboard.service.js'
                    ]
                });
            }]
        }
    })
    .state("book", {
        url: "/manager/book",
        templateUrl: app+'/manager/book/book.view.html',
        data: {
            pageTitle: 'Book',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "BookCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/manager/book/book.controller.js',
                        app+'/manager/book/book.service.js',
                        app+'/login/login.controller.js',
                    ]
                });
            }]
        }
    })
    .state("orderbook-admin", {
        url: "/manager/orderbook",
        templateUrl: app+'/manager/orderbook/orderbook.view.html',
        data: {
            pageTitle: 'Orderbook',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "OrderbookCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/manager/orderbook/orderbook.controller.js',
                        app+'/manager/orderbook/orderbook.service.js',
                        app+'/login/login.controller.js',
                    ]
                });
            }]
        }
    })
    .state("voucherbooking", {
        url: "/manager/voucherbooking",
        templateUrl: app+'/manager/voucher/voucherbooking/voucherbooking.view.html',
        data: {
            pageTitle: 'Voucherbooking',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "VoucherbookingCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/manager/voucher/voucherbooking/voucherbooking.controller.js',
                        app+'/manager/voucher/voucherbooking/voucherbooking.service.js',
                        app+'/login/login.controller.js',
                    ]
                });
            }]
        }
    })
    .state("order", {
        url: "/order",
        templateUrl: app+'/order/order.view.html',
        data: {
            pageTitle: 'Order',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "OrderCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/order/order.controller.js',
                        app+'/order/order.service.js',
                        app+'/login/login.controller.js',
                    ]
                });
            }]
        }
    })
    .state("book-detail", {
        url: "/book-detail",
        templateUrl: app+'/bookdetail/bookdetail.view.html',
        data: {
            pageTitle: 'Bookdetail',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "BookdetailCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/bookdetail/bookdetail.controller.js',
                        // app+'/bookdetail/bookdetail.service.js'
                    ]
                });
            }]
        }
    })
    .state("register", {
        url: "/register",
        templateUrl: app+'/register/register.view.html',
        data: {
            pageTitle: 'Register',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "RegisterCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/register/register.controller.js',
                        app+'/register/register.service.js'
                    ]
                });
            }]
        }
    })
    .state("profile", {
        url: "/profile",
        templateUrl: app+'/profile/profile.view.html',
        data: {
            pageTitle: 'Profile',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "ProfileCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/profile/profile.controller.js',
                        app+'/profile/profile.service.js'
                    ]
                });
            }]
        }
    })
    .state("cart", {
        url: "/cart",
        templateUrl: app+'/cart/cart.view.html',
        data: {
            pageTitle: 'Cart',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "CartCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/cart/cart.controller.js',
                        app+'/cart/cart.service.js'
                    ]
                });
            }]
        }
    })
    .state("stats", {
        url: "/stats/area",
        templateUrl: app+'/stats/area/area.view.html',
        data: {
            pageTitle: 'StatsArea',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "StatsAreaCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/stats/area/area.controller.js',
                        app+'/stats/area/area.service.js'
                    ]
                });
            }]
        }
    })
    .state("history", {
        url: "/history/transaction",
        templateUrl: app+'/history/historytransaction/historytransaction.view.html',
        data: {
            pageTitle: 'HistoryTransaction',
            css: [`${app}/assets/css/custom.css`]
        },
        controller: "HistoryTransactionCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'LibraryManagerApp',
                    files: [
                        app+'/history/historytransaction/historytransaction.controller.js',
                        app+'/history/historytransaction/historytransaction.service.js'
                    ]
                });
            }]
        }
    });
}]);

LibraryManagerApp.controller('AppController',['$scope','$rootScope','$location','$cookies','LoginService',
function ($scope,$rootScope,$location,$cookies,LoginService) {
    (function initController() {
        $rootScope.sh_header = false;
    })();
    $scope.Logout = fnLogout;
    function fnLogout(){
        // $("#md_load").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        if(reqData.session==undefined || reqData.session==null || reqData.session==''){
            alert("Người dùng chưa đăng nhập!");
        }
        LoginService.Logout(reqData,function(respData){
            // $("#md_load").modal("hide");
            if(respData.code == 200){
                document.getElementById('logout-close').click();
                // offcanvasDarkNavbar
                resetCookies()
                $location.path("/login");
            }else if(respData.code == 700){
                alert(respData.description);
                resetCookies();
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }
    function resetCookies(){
        $cookies.remove("session");
        $cookies.remove("user_name");
        $cookies.remove("book_id");
    }
}]);

LibraryManagerApp.run(["$rootScope", function ($rootScope) {
    // $rootScope.hostname = "http://localhost/librarymanagerapi";
    $rootScope.hostname = "http://localhost:8080/librarymanagerapi";
    // $rootScope.hostname = "http://192.168.0.103:80/librarymanagerapi";
    // $rootScope.hostname = "https://librarymanagerapi.herokuapp.com/";
}]);