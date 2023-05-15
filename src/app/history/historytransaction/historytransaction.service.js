LibraryManagerApp.factory('HistoryTransactionService',['$http','$rootScope',function($http,$rootScope){
    var hostname = $rootScope.hostname;
    var service = {};
    service.GetHistoryTransaction = fnGetHistoryTransaction;
    service.GetHistoryTransactionDetail = fnGetHistoryTransactionDetail;
    function fnGetHistoryTransaction(reqData, callback){
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_history_transaction',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    function fnGetHistoryTransactionDetail(reqData, callback){
        var req = {
            method: 'POST',
            url: hostname+'/boooking/get_history_transaction_detail',
            data: reqData
        }
        $http(req).then(function(respData){callback(respData.data);}, function(respData){});
    }

    return service;
}]);