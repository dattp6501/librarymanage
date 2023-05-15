LibraryManagerApp.controller('CartCtrl', ['$scope','$rootScope','$location','$cookies','CartService','NgTableParams','$filter','ProfileService',
function($scope,$rootScope,$location,$cookies,CartService,NgTableParams,$filter,ProfileService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        fnProfile();
        $rootScope.user_name = $cookies.get("user_name");
        


        fnGetCart();
        $scope.ListVoucherBooking = [{
            "voucher_booking_id": -1,
            "voucher_booking_name": "",
        }];
        $scope.voucherBookingSeleted = $scope.ListVoucherBooking[0];
        fnGetVoucherBookingActive();
        fnGetListPaymentType();
    })();
    

    function fnProfile(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        ProfileService.Profile(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $rootScope.profile = respData.result.member;
                $scope.address = $rootScope.profile.mem_address;
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
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetCart(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $rootScope.cart = respData.result.cart;
                $rootScope.cart.total_price = fnTotalPrice($rootScope.cart,$scope.voucherBookingSeleted);
                // $rootScope.cart.books.forEach((book)=>{
                //     if(book.book_price==undefined){
                //         book.book_price = 0;
                //     }
                // });
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

    function fnGetVoucherBookingActive(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetVoucherBookingActive(reqData,function(respData){
            if(respData.code == 200){
                $scope.ListVoucherBooking = $scope.ListVoucherBooking.slice(0,1);
                $scope.ListVoucherBooking = $scope.ListVoucherBooking.concat(respData.result.list);
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

    function fnTotalPrice(cart,voucher){
        var total_price = 0;
        cart.books.forEach(book => {
            total_price += book.book_price * book.book_number;
        });
        if(voucher!=undefined&&voucher!=null&&voucher.voucher_booking_id>0){
            if(voucher.voucher_booking_type=='%'){
                total_price = total_price - total_price*voucher.voucher_booking_value/100;
            }else if(voucher.voucher_booking_type=='n'){
                total_price = total_price - voucher.voucher_booking_value;
            }
        }
        if(total_price<0){
            total_price = 0;
        }   
        return total_price;
    }


    $scope.RemoveBookInCart = fnRemoveBookInCart;
    function fnRemoveBookInCart(book){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = book;
        CartService.RemoveBookInCart(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                fnGetCart();
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 400){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }

    $scope.SubBookNumber = fnSubBookNumber;
    function fnSubBookNumber(book){
        if(book.book_number>1){
            book.book_number -= 1;
            $rootScope.cart.total_price = fnTotalPrice($rootScope.cart,$scope.voucherBookingSeleted);
        }
    }
    $scope.AddBookNumber = fnAddBookNumber;
    function fnAddBookNumber(book){
        book.book_number += 1;
        $rootScope.cart.total_price = fnTotalPrice($rootScope.cart,$scope.voucherBookingSeleted);
    }


    $scope.PaymentTypes = []
    function fnGetListPaymentType(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        CartService.GetListPaymentType(reqData,function(respData){
            if(respData.code == 200){
                $scope.PaymentTypes = respData.payment_type;
                $scope.PaymentTypeSelected = $scope.PaymentTypes[0];
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
    $scope.BuyingBook = fnBuyingBook;
    function fnBuyingBook(){
        if($scope.address){
        }else{
            toastr.error("Vui lòng nhập địa chỉ nhận hàng");
            return;
        }
        if($scope.PaymentTypeSelected){
        }else{
            toastr.error("Vui lòng chọn phương thức thanh toán");
            return;
        }
        // if($scope.PaymentTypeSelected.mode!=0){
        //     toastr.error("Chưa được hỗ trợ");
        //     return;
        // }
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.address = $scope.address;
        reqData.cart = $rootScope.cart;
        reqData.voucher_booking = [$scope.voucherBookingSeleted];
        reqData.payment_type = $scope.PaymentTypeSelected;
        CartService.AddBooking(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                if($scope.PaymentTypeSelected.mode==1){
                    fnPayment(respData);
                    return;
                }else{
                    toastr.success(respData.description);
                    $location.path("/order");
                }
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 400){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }
    function fnPayment(respData){
        if(respData.code!=200){
            toastr.error(respData.description);
            return;
        }
        $location.path("/order");
        window.open(respData.url_payment+"a");
    }
    function createLink(link){
        var link = document.createElement('a');
        link.href = link;
        return link;
    }

    $scope.ChangeVoucherBooking = fnChangeVoucherBooking;
    function fnChangeVoucherBooking(voucher){
        $scope.voucherBookingSeleted = voucher;
        $rootScope.cart.total_price = fnTotalPrice($rootScope.cart,$scope.voucherBookingSeleted);
    }

    $scope.AddBooksToCart = fnAddBooksToCart;
    function fnAddBooksToCart(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.books = $rootScope.cart.books;
        CartService.AddBooksToCart(reqData, function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                fnGetCart();
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 400){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
            }
        });
    }
}]);