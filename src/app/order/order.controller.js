LibraryManagerApp.controller('OrderCtrl', ['$scope','$rootScope','$location','$cookies','NgTableParams','$filter','OrderService','ProfileService','CartService',
function($scope,$rootScope,$location,$cookies,NgTableParams,$filter,OrderService,ProfileService,CartService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile();
        $rootScope.user_name = $cookies.get("user_name");


        fnGetCart();
        fnGetBooking();
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
    function fnGetCart(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetCart(reqData,function(respData){
            if(respData.code == 200){
                $rootScope.cart = respData.result.cart;
                var total_price = 0;
                $rootScope.cart.books.forEach(book => {
                    total_price += book.book_price * book.book_number; 
                });
                $rootScope.cart.total_price = total_price;
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

    $scope.GetBooking = fnGetBooking;
    function fnGetBooking(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        OrderService.GetBooking(reqData, function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $scope.ListStatusBooking = respData.result.status;
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
            return {'background-color':'#fffb00'};
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
}]);