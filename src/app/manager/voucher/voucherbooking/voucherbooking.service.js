LibraryManagerApp.factory('VoucherbookingService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.AddVoucherBooking = fnAddVoucherBooking;
    service.CLoseVoucherBooking = fnCLoseVoucherBooking;
    service.OpenVoucherBooking = fnOpenVoucherBooking;
    service.GetAllVoucherBooking = fnGetAllVoucherBooking;

    function fnAddVoucherBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/add_voucher_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnCLoseVoucherBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/close_voucher_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnOpenVoucherBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/open_voucher_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetAllVoucherBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_all_voucher_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;    
}]);