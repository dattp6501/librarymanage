LibraryManagerApp.controller('LoginCtrl', ['$scope','$rootScope','$location','$cookies','LoginService','ProfileService',
function($scope,$rootScope,$location,$cookies,LoginService,ProfileService) {
    (function initController() {
        $rootScope.sh_header = false;
        $scope.userName = "admin";
        $scope.passWord = "1";
    })();

    $scope.Login = fnLogin;
    function fnLogin(){
        if($scope.userName==undefined || $scope.userName==null || $scope.userName==""){
            toastr.error("VUi lòng điền tên đăng nhập");
        }
        if($scope.passWord==undefined || $scope.passWord==null || $scope.passWord==""){
            toastr.error("VUi lòng điền mật khẩu");
        }
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.username = $scope.userName;
        reqData.password = $scope.passWord;
        LoginService.Login(reqData,function (respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $cookies.put("user_name",$scope.userName);
                $cookies.put("session",respData.session);
                $location.path("/dashboard");
            }else {
                toastr.error(respData.description);
            }
        });
    }
}]);