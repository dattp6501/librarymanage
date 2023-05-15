LibraryManagerApp.factory('CartService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.Profile = fnProfile;
    service.GetCart = fnGetCart;
    service.AddBookToCart = fnAddBookToCart;
    service.AddBooksToCart = fnAddBooksToCart;
    service.RemoveBookInCart = fnRemoveBookInCart;
    service.AddBooking = fnAddBooking;
    service.GetAmountBooking = fnGetAmountBooking;
    service.GetVoucherBookingActive = fnGetVoucherBookingActive;
    service.GetListPaymentType = fnGetListPaymentType;

    function fnProfile(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/profile',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetCart(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/cart/get_cart',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnAddBookToCart(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/cart/add_book',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    function fnAddBooksToCart(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/cart/add_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnRemoveBookInCart(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/cart/remove_book',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnAddBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/add_booking',//add_booking
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetAmountBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_amount_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetVoucherBookingActive(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_voucher_booking_active',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetListPaymentType(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_list_payment_type',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;    
}]);