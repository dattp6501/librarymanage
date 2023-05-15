LibraryManagerApp.controller('VoucherbookingCtrl', ['$scope','$rootScope','$location','$cookies','VoucherbookingService','NgTableParams','$filter','CartService','ProfileService',
function($scope,$rootScope,$location,$cookies,VoucherbookingService,NgTableParams,$filter,ProfileService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile();
        $rootScope.user_name = $cookies.get("user_name");
        
        fnGetAllVoucherBooking();

        $scope.filterActive = [
            {
                "active": -1,
                "name": "Tất cả"
            },
            {
                "active":0,
                "name":"Chưa được sử dụng"
            },
            {
                "active":1,
                "name":"Đang được sử dụng"
            }
        ];
        $scope.modelModeSelected = $scope.filterActive[0];

        $scope.filterType = [
            {
                "type": "all",
                "name": "Tất cả"
            },
            {
                "type":"%",
                "name":"Pnàn trăm"
            },
            {
                "active":"n",
                "name":"Giá cố định"
            }
        ];
        $scope.modelModeTypeSelected = $scope.filterType[0];
        
    })();
    

    function fnProfile(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        ProfileService.Profile(reqData,function(respData){
            if(respData.code == 200){
                $rootScope.profile = respData.result.member;
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
    
    function fnGetAllVoucherBooking(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        VoucherbookingService.GetAllVoucherBooking(reqData,function(respData){
            if(respData.code == 200){
                $scope.ListVoucherConst = respData.result.list;
                $scope.tableDataVoucher = respData.result.list;
                $scope.modelModeSelected = $scope.filterActive[0];
                $scope.tableParamsVoucher.page(1);
                $scope.tableParamsVoucher.reload();
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

    $scope.tableDataVoucher = [];
    $scope.tableDisplayVoucher = [];
    $scope.tableParamsVoucher = new NgTableParams({
        page: 1, // show first page
        count: 20, // count per page
        sorting: {},
        filter: {}
    }, {
        counts:[],
        total:1,
        // total: $scope.tableDataVoucher.length, // length of data
        getData: function($defer, params) {
            if ($scope.tableDataVoucher != true) {
                var filteredData = params.filter() ?
                    $filter('filter')(($scope.tableDataVoucher), params.filter()) :
                    $scope.tableDataVoucher;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.tableDataVoucher;
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.tableDisplayVoucher = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        }
    });

    $scope.ShowModalAddVoucherBooking = fnShowModalAddVoucherBooking;
    function fnShowModalAddVoucherBooking(){
        $("#modal-add-voucher-booking").modal("show");
        $scope.ListTypeVoucher = ["%","n"];
        $scope.newVoucherBooking = {};
        $scope.newVoucherBooking.voucher_booking_type = $scope.ListTypeVoucher[0];
    }

    $scope.AddVoucherBooking = fnAddVoucherBooking;
    function fnAddVoucherBooking(voucherBooking){
        $scope.newVoucherBooking = voucherBooking;
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.voucher_booking = voucherBooking;
        VoucherbookingService.AddVoucherBooking(reqData,function(respData){
            if(respData.code == 200){
                $("#modal-add-voucher-booking").modal("hide");
                toastr.success(respData.description);
                fnGetAllVoucherBooking();
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

    $scope.CheckStatusVoucherBooking = fnCheckStatusVoucherBooking;
    function fnCheckStatusVoucherBooking(active){
        var res = $scope.filterActive.find((m)=>{
            return m.active == active;
        });
        if(res == undefined){
            return "Không có trạng thái"
        }
        return res.name;
    }

    $scope.GetStyleVoucherBooking = fnGetStyleVoucherBooking;
    function fnGetStyleVoucherBooking(mode){
        if(mode==0){// dang dong
            return {'background-color':'#ff0000','color':'#ffffff'};
        }
        if(mode==1){// dang mo
            return {'background-color':'#2ec01b'};
        }
        return {'background-color':'#ffc4e0'};// chua co trang thai
    }

    $scope.DetailVoucherBooking = fnDetailVoucherBooking;
    function fnDetailVoucherBooking(voucher){
        $scope.VoucherbookingSelected = voucher;
        $("#modal-voucher-booking-detail").modal("show");
    }
    $scope.CLoseVoucherBooking = fnCLoseVoucherBooking;
    function fnCLoseVoucherBooking(voucher){
        Swal.fire({
            title: 'Thông báo',
            text: "Bạn chắc chắn muốn đóng voucher?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                var reqData = {};
                reqData.session = $cookies.get("session");
                reqData.voucher_booking = voucher;
                VoucherbookingService.CLoseVoucherBooking(reqData,function(respData){
                    if(respData.code == 200){
                        $("#modal-voucher-booking-detail").modal("hide");
                        toastr.success(respData.description);
                        fnGetAllVoucherBooking();
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
        })
    }

    $scope.OpenVoucherBooking = fnOpenVoucherBooking;
    function fnOpenVoucherBooking(voucher){
        Swal.fire({
            title: 'Thông báo',
            text: "Bạn chắc chắn muốn mở voucher?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                var reqData = {};
                reqData.session = $cookies.get("session");
                reqData.voucher_booking = voucher;
                VoucherbookingService.OpenVoucherBooking(reqData,function(respData){
                    if(respData.code == 200){
                        $("#modal-voucher-booking-detail").modal("hide");
                        toastr.success(respData.description);
                        fnGetAllVoucherBooking();
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
        })
    }

    $scope.ChangeModeFilterTableVoucherBooking = fnChangeModeFilterTableVoucherBooking;
    function fnChangeModeFilterTableVoucherBooking(mode){
        $scope.modelModeSelected = mode;
        if(mode.active==-1){
            $scope.tableDataVoucher = $scope.ListVoucherConst;
        }else{
            $scope.tableDataVoucher = $scope.ListVoucherConst.filter(v => v.voucher_booking_active==mode.active);
        }
        $scope.tableParamsVoucher.page(1);
        $scope.tableParamsVoucher.reload();
    }

    $scope.FomatDate = fnFomatDate;
    function fnFomatDate(dateStr){
        return moment(new Date(dateStr)).format("Do, MMMM, YYYY HH:mm:ss A");
    }

}]);