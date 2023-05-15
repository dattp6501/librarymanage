LibraryManagerApp.controller('HistoryTransactionCtrl', ['$scope','$rootScope','$location','$cookies','HistoryTransactionService','NgTableParams','$filter','ProfileService','CartService',
function($scope,$rootScope,$location,$cookies,HistoryTransactionService,NgTableParams,$filter,ProfileService,CartService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile(function(respData){
            if(respData.code == 200){
                // chung
                $scope.modelDate = new Date();
                fnGetHistoryTransaction(function(){

                });

                if ($rootScope.profile.mem_group == 'customer') {
                    fnInitCustomer();
                } else if ($rootScope.profile.mem_group == 'admin') {
                    fnInitAdmin();
                }
            }
        });
        $rootScope.user_name = $cookies.get("user_name");
    })();
    function fnInitAdmin(){


    }
    function fnInitCustomer(){
        
        fnGetCart();
    }

    function fnProfile(callback){
        var reqData = {};
        reqData.session = $cookies.get("session");
        ProfileService.Profile(reqData,function(respData){
            if(respData.code == 200){
                $rootScope.profile = respData.result.member;
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
            callback(respData);
        });
    }
    function fnGetCart() {
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetCart(reqData, function (respData) {
            if (respData.code == 200) {
                $rootScope.cart = respData.result.cart;
            } else if (respData.code == 700) {
                alert(respData.description);
                $location.path("/login");
            } else if (respData.code == 500) {
                $location.path("/login");
            } else {
                toastr.error(respData.description);
            }
        });
    }

    
    function fnGetHistoryTransaction(callback){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.date_from = moment($scope.modelDate).format("YYYY-MM-DD");
        HistoryTransactionService.GetHistoryTransaction(reqData,function(respData){
            if(respData.code == 200){
                $scope.tableDataHistoryTransaction = respData.list;
                $scope.tableParamsHistoryTransaction.page(1);
                $scope.tableParamsHistoryTransaction.reload();
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
            callback(respData);
        });

    }
    $scope.tableDataHistoryTransaction = [];
    $scope.tableDisplayHistoryTransaction = [];
    $scope.tableParamsHistoryTransaction = new NgTableParams({
        page: 1, // show first page
        count: 20, // count per page
        sorting: {},
        filter: {}
    }, {
        counts:[],
        total:1,
        // total: $scope.tableDataHistoryTransaction.length, // length of data
        getData: function($defer, params) {
            if ($scope.tableDataHistoryTransaction != true) {
                var filteredData = params.filter() ?
                    $filter('filter')(($scope.tableDataHistoryTransaction), params.filter()) :
                    $scope.tableDataHistoryTransaction;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.tableDataHistoryTransaction;
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.tableDisplayHistoryTransaction = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        }
    });
    $scope.DetailHistoryTrasaction = fnDetailHistoryTrasaction;
    function fnDetailHistoryTrasaction(HT){
        var reqData = JSON.parse(JSON.stringify(HT));
        reqData.session = $cookies.get("session");
        reqData.booking_id = reqData.booking_id+"";
        HistoryTransactionService.GetHistoryTransactionDetail(reqData,function(respData){
            if(respData.code == 200){
                $scope.modelHistoryTransactionSelected = respData.result;
                $scope.modelHistoryTransactionSelected.logo_bank = "/src/app/assets/images/logo_ncb_bank.jpg";
                $("#modalHistoryTransactionDetail").modal("show");
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }

    $scope.FomatDate = fnFomatDate;
    function fnFomatDate(dateStr){
        return moment(new Date(dateStr)).format("Do, MMMM, YYYY HH:mm:ss A");
    }
}]);