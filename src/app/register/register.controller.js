LibraryManagerApp.controller('RegisterCtrl', ['$scope','$rootScope','$location','$cookies','RegisterService',
function($scope,$rootScope,$location,$cookies,RegisterService) {
    (function initController() {
        $rootScope.sh_header = false;
    })();
    $scope.SignIn = fnSignIn;
    function fnSignIn(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.fullname = $scope.fullName;
        reqData.email = $scope.email;
        reqData.username = $scope.userName;
        reqData.password = $scope.passWord1;
        reqData.password2 = $scope.passWord2;
        RegisterService.Register(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                alert(respData.description);
                // Swal.fire({
                //     title: 'Thông báo',
                //     text: "Bây giờ bạn có thể đăng nhập!",
                //     icon: 'success',
                //     showCancelButton: true,
                //     confirmButtonText: 'OK',
                //     confirmButtonColor: '#146c43',
                //     cancelButtonColor: '#6c757d',
                // }).then((result) => {
                //     $location.path("/login");
                // })
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }
}]);