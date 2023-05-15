LibraryManagerApp.factory('LoginService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.Login = fnLogin;
    service.Logout = fnLogout;
    service.Profile = fnProfile;
    
    function fnLogin(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/login',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnLogout(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/logout',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnProfile(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/profile',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    
    return service;
}]);