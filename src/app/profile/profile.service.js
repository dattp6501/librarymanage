LibraryManagerApp.factory('ProfileService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.Profile = fnProfile;
    service.UpdateProfile = fnUpdateProfile;

    function fnProfile(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/profile',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnUpdateProfile(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/member/update_profile',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;    
}]);