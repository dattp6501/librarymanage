LibraryManagerApp.factory('BookService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.GetBook = fnGetBook;
    service.DeleteBook = fnDeleteBook;
    service.AddBook = fnAddBook;
    service.UpdateBook = fnUpdateBook;
    service.GetComments = fnGetComments;
    service.AddComments = fnAddComments;
    service.AddType = fnAddType;

    function fnGetBook(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    function fnDeleteBook(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/delete_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnAddBook(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/add_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnUpdateBook(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/update_books',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetComments(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_comments',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnAddComments(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/add_comment',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnAddType(reqData, callback){
        var req = {
            method: 'POST',
            url: hostname+'/book/add_type',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;
}]);