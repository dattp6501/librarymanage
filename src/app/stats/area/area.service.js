LibraryManagerApp.factory('StatsAreaService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.getRoute = fnGetRoute;
    service.GetInforMapbox = fnGetInforMapbox;
    service.StatsPointsOfBooking = fnStatsPointsOfBooking;

    function fnGetInforMapbox(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/mapbox/get_infor_mapbox',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }
    function fnStatsPointsOfBooking(reqData, callback) {
        var req = {
            method: 'POST',
            url: hostname+'/stats/stats_points_of_booking',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetRoute(reqData,callback){
        const accessToken = 'pk.eyJ1IjoiZGF0dHA2NTAxIiwiYSI6ImNsNWhyMndieDAwdnAzZG41ZWU0aWE4dGcifQ.QqoPZxARov6HykuFnXvLWg';
        var url = `https://api.mapbox.com/directions/v5/mapbox/driving/${reqData.source[0]},${reqData.source[1]};${reqData.destination[0]},${reqData.destination[1]}?steps=true&geometries=geojson&access_token=${reqData.accessToken}`;
        $http.get(url)
        .then(function(response) {
            callback(response.data.routes[0].geometry.coordinates);
        });
    }
    return service;
}]);