LibraryManagerApp.factory('BookdetailService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.GetComments = fnGetComments;
    service.GetBookByID = fnGerBookByID;
    service.GetAllType = fnGetAllType;
    

    function fnGetComments(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_comments',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGerBookByID(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_book_by_id',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetAllType(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/book/get_all_type',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;
}]);