LibraryManagerApp.factory('RegisterService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.Register = fnRegister;
    function fnRegister(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/register',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    
    return service;
}]);