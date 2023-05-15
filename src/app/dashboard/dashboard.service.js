LibraryManagerApp.factory('DashboardService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    // admin
    service.StatsBookingCurrentDay = fnStatsBookingCurrentDay;
    service.StatsRevenueYear = fnStatsRevenueYear;
    service.StatsNumberOfBooking = fnStatsNumberOfBooking;
    // customer
    service.GetBook = fnGetBook;





    // admin
    function fnStatsBookingCurrentDay(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/stats/stats_booking_current_day',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnStatsRevenueYear(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/stats/stats_revenue_year',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnStatsNumberOfBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/stats/stats_number_of_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    
    function fnGetBook(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;
}]);