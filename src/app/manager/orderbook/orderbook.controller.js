LibraryManagerApp.controller('OrderbookCtrl', ['$scope','$rootScope','$location','$cookies','NgTableParams','$filter','OrderbookService','ProfileService',
function($scope,$rootScope,$location,$cookies,NgTableParams,$filter,OrderbookService,ProfileService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile();
        $rootScope.user_name = $cookies.get("user_name");


        $scope.modelDate = new Date();
        $scope.modelDate.setHours(0);
        $scope.modelDate.setMinutes(0);
        $scope.modelDate.setSeconds(0);

        $scope.filterStatusBooking = [{
            "mode": -2,
            "name": "Tất cả"
        }];
        $scope.modelModeStatusSelected = $scope.filterStatusBooking[0];
        fnGetListBookingStatus();
    })();

    function formatDate(date){
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year+"-"+String(month).padStart(2,'0')+"-"+String(day).padStart(2,'0')
        +" "+String(hour).padStart(2,'0')+":"+String(minute).padStart(2,'0')+":"+String(second).padStart(2,'0');
    }
    

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

    function fnGetListBookingStatus(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        OrderbookService.GetListBookingStatus(reqData, function(respData){
            if(respData.code == 200){
                $scope.filterStatusBooking = $scope.filterStatusBooking.slice(0,1);
                $scope.filterStatusBooking = $scope.filterStatusBooking.concat(respData.list);
                $scope.modelModeStatusSelected = $scope.filterStatusBooking[0];
                $scope.ListStatusBooking = respData.list;
                fnGetAllBookingByDate($scope.modelModeStatusSelected);
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

    $scope.GetAllBookingByDate = fnGetAllBookingByDate;
    function fnGetAllBookingByDate(filter){
        try {
            if($scope.modelDate.getFullYear()>=2022){
                var reqData = {};
                reqData.session = $cookies.get("session");
                reqData.date = formatDate($scope.modelDate);
                if(filter){
                    reqData.booking_success = filter.mode;
                }
                OrderbookService.GetAllBookingByDate(reqData, function(respData){
                    if(respData.code == 200){
                        // $scope.filterStatusBooking = $scope.filterStatusBooking.slice(0,1);
                        // $scope.filterStatusBooking = $scope.filterStatusBooking.concat(respData.result.status);
                        // $scope.modelModeStatusSelected = $scope.filterStatusBooking[0];

                        // $scope.ListStatusBooking = respData.result.status;
                        $scope.ListBookingRoot = respData.result.list;
                        $scope.tableDataOrderBook = respData.result.list;
                        $scope.tableParamsOrderBook.page(1);
                        $scope.tableParamsOrderBook.reload();
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
        } catch (error) {
            return;
        }
    }

    $scope.tableDataOrderBook = [];
    $scope.tableDisplayOrderBook = [];
    $scope.tableParamsOrderBook = new NgTableParams({
        page: 1, // show first page
        count: 20, // count per page
        sorting: {},
        filter: {}
    }, {
        counts:[],
        total:1,
        // total: $scope.tableDataOrderBook.length, // length of data
        getData: function($defer, params) {
            if ($scope.tableDataOrderBook != true) {
                var filteredData = params.filter() ?
                    $filter('filter')(($scope.tableDataOrderBook), params.filter()) :
                    $scope.tableDataOrderBook;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.tableDataOrderBook;
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.tableDisplayOrderBook = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        }
    });

    $scope.ChangFilterStatusBooking = fnChangFilterStatusBooking;
    function fnChangFilterStatusBooking(filter){
        $scope.modelModeStatusSelected = filter;
        // if(filter.mode==-2){
        //     $scope.tableDataOrderBook = $scope.ListBookingRoot;
        // }else{
        //     $scope.tableDataOrderBook = $scope.ListBookingRoot.filter(bk => bk.booking_success==filter.mode);
        // }
        // $scope.tableParamsOrderBook.page(1);
        // $scope.tableParamsOrderBook.reload();
        fnGetAllBookingByDate($scope.modelModeStatusSelected);
    }

    $scope.CheckStatusOrderBook = fnCheckStatusOrderBook;
    function fnCheckStatusOrderBook(mode){
        // var modes = [{
        //     "mode":-1,
        //     "name":"Đang xử lý"
        // },
        // {
        //     "mode":0,
        //     "name":"Đã hủy"
        // },
        // {
        //     "mode":1,
        //     "name":"Thành công"
        // }];

        // var res = modes.find((m)=>{
        //     return m.mode == mode;
        // });
        var res = $scope.ListStatusBooking.find((m)=>{
            return m.mode == mode;
        });
        if(res == undefined){
            return "Không có trạng thái"
        }
        return res.name;
    }

    $scope.GetStyleOrderBook = fnGetStyleOrderBook;
    function fnGetStyleOrderBook(mode){
        if(mode==-1){// dang xu ly
            return {'background-color':'#fffb00','color':'#000000'};
        }
        if(mode==0){// da huy
            return {'background-color':'#ff0000','color':'#ffffff'};
        }
        if(mode==1){// thanh cong
            return {'background-color':'#2ec01b'};
        }
        return {'background-color':'#ffc4e0'};
    }

    $scope.DetailBooking = fnDetailBooking;
    function fnDetailBooking(booking){
        $scope.BookingSelected = JSON.parse(JSON.stringify(booking));
        $('#modal-booking-detail').modal("show");
    }

    $scope.TotalPrice = fnTotalPrice;
    function fnTotalPrice(booking){
        if(booking==undefined){
            return 0;
        }
        var total_price = 0;
        booking.bookeds.forEach(booked => {
            total_price += booked.booked_price * booked.booked_number;
        });
        if(total_price<0){
            total_price = 0;
        }   
        return total_price;
    }

    $scope.Discount = fnDiscount;
    function fnDiscount(booking){
        if(booking==undefined){
            return 0;
        }
        if(booking.voucher_booking==undefined){
            return 0;
        }
        var voucher = booking.voucher_booking[0];
        if(voucher==undefined||voucher==null||voucher.voucher_booking_id<=0){
            return 0;
        }
        if(voucher.voucher_booking_type=='%'){
            return fnTotalPrice(booking)*voucher.voucher_booking_value/100;

        }
        return voucher.voucher_booking_value;
    }

    $scope.ConfirmBooking = fnConfirmBooking;
    function fnConfirmBooking(){
        Swal.fire({
            title: 'Thông báo',
            text: "Bạn chắc chắn muốn xác nhận đơn hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                var reqData = {};
                reqData.session = $cookies.get("session");
                reqData.booking = $scope.BookingSelected;
                OrderbookService.ConfirmBooking(reqData, function(respData){
                    if(respData.code == 200){
                        $('#modal-booking-detail').modal("hide");
                        toastr.success(respData.description);
                        fnGetAllBookingByDate($scope.modelModeStatusSelected);
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

    $scope.BookDetail = fnBookDetail;
    function fnBookDetail(book){
        if($cookies.get("book_id")==undefined || $cookies.get("book_id")==null){
            $cookies.put("book_id",book.book_id);
        }else{
            $cookies.remove("book_id");
            $cookies.put("book_id",book.book_id);
        }
        $location.path("/book-detail");
    }

    $scope.CancelBooking = fnCancelBooking;
    function fnCancelBooking(booking){
        $scope.BookingSelected = booking;//
        Swal.fire({
            title: 'Thông báo',
            text: "Bạn chắc chắn muốn hủy đơn hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                var reqData = {};
                reqData.session = $cookies.get("session");
                reqData.booking = $scope.BookingSelected;
                OrderbookService.CancelBooking(reqData, function(respData){
                    if(respData.code == 200){
                        $('#modal-booking-detail').modal("hide");
                        toastr.success(respData.description);
                        fnGetAllBookingByDate($scope.modelModeStatusSelected);
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
}]);