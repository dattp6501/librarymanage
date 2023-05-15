LibraryManagerApp.factory('OrderbookService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.GetAllBookingByDate = fnGetAllBookingByDate;
    service.ConfirmBooking = fnConfirmBooking;
    service.CancelBooking = fnCancelBooking;  
    service.GetListBookingStatus = fnGetListBookingStatus;

    function fnGetAllBookingByDate(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_all_booking_by_date',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnConfirmBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/confirm_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnCancelBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/cancel_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetListBookingStatus(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_list_booking_status',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;
}]);