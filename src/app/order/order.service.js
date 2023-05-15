LibraryManagerApp.factory('OrderService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.GetBooking = fnGetBooking;  

    function fnGetBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    return service;
}]);