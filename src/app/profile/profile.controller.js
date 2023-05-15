LibraryManagerApp.controller('ProfileCtrl', ['$scope','$rootScope','$location','$cookies','ProfileService','NgTableParams','$filter','CartService',
function($scope,$rootScope,$location,$cookies,ProfileService,NgTableParams,$filter,CartService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile(function(respData){
            if(respData.code == 200){
                if ($rootScope.profile.mem_group == 'customer') {
                    fnGetCart();
                } else if ($rootScope.profile.mem_group == 'admin') {
                    
                }
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
        $rootScope.user_name = $cookies.get("user_name");
        $scope.isEdit = false;
        
    })();
    

    function fnProfile(callback){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        ProfileService.Profile(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $rootScope.profile = respData.result.member;
                $scope.isEdit = false;
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
            callback(respData);
        });
    }

    $scope.MediaUpload = fnMediaUpload;
    function fnMediaUpload(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var type = reader.result.split("base64",2)[0]+"base64,";
            var data = reader.result.replace("data:", "").replace(/^.+,/, "");
            $rootScope.profile.mem_avatar = data;
            $scope.isEdit = true;
            $rootScope.$apply();
        }
        reader.readAsDataURL(file);
    }

    $scope.UpdateProfile = fnUpdateProfile;
    function fnUpdateProfile(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.member = $rootScope.profile;
        ProfileService.UpdateProfile(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                toastr.success(respData.description);
                fnProfile();
                $cookies.remove("user_name");
                $cookies.put("user_name",$rootScope.profile.mem_username);
                $rootScope.user_name = $cookies.get("user_name");
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }


    function fnGetCart(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetCart(reqData,function(respData){
            if(respData.code == 200){
                $rootScope.cart = respData.result.cart;
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }
    
}]);