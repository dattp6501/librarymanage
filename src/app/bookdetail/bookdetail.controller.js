LibraryManagerApp.controller('BookdetailCtrl', ['$scope','$rootScope','$location','$cookies','BookService','BookdetailService','CartService','ProfileService',
function($scope,$rootScope,$location,$cookies,BookService,BookdetailService,CartService,ProfileService) {
    (function initController() {
        $rootScope.sh_header = false;

        $scope.types = ["","Type 1","Type 2","Type 3","Type 4","Type 5"]
        $rootScope.user_name = $cookies.get("user_name");
        fnProfile();

        $scope.Typeos = [];
        $scope.Typeos.push({"type_id":-1,"type_name":""});
        fnGetAllType();

        var book_id = $cookies.get("book_id");
        if(book_id!=undefined && book_id!=null && book_id!=-1){
            fnGetBookByID();
        }else{
            $scope.isAdd = false;
            $scope.isEdit = true;
            $scope.isSave = true;

            $scope.book = {};
            $scope.book.book_typeo = {"type_id":-1,"type_name":""};
            var type_tmp = $scope.Typeos.find((type)=>{
                return type.type_id == $scope.book.book_typeo.type_id;
            });
            $scope.book.book_typeo = type_tmp;
        }
        
    })();

    function fnGetBookByID(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book_id = $cookies.get("book_id");
        BookdetailService.GetBookByID(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                var book = respData.result.book;
                book.book_release_date = parseDate(book.book_release_date);
                if(book.book_typeo==undefined || book.book_typeo==undefined){
                    book.book_typeo = {"type_id":-1,"type_name":""};
                }

                var type_tmp = $scope.Typeos.find((type)=>{
                    return type.type_id == book.book_typeo.type_id;
                });
                book.book_typeo = type_tmp;

                if(book.book_page_number<=0){
                    book.book_page_number = null;
                }
                if($rootScope.profile!=undefined && $rootScope.profile.mem_group=='customer'){
                    book.book_number = 1;
                }
                $scope.book = book;
                $scope.isEdit = false;
                $scope.isAdd = true;
                $scope.isSave = true;
                fnGetComments();
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

    $scope.parseDate = parseDate;
    function parseDate(date_str){
        return new Date(date_str);
    }
    function formatDate(date){
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        return year+"-"+String(month).padStart(2,'0')+"-"+String(day).padStart(2,'0');
    }

    function fnGetAllType(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book_id = $cookies.get("book_id");
        BookdetailService.GetAllType(reqData,function(respData){
            if(respData.code == 200){
                $scope.Typeos = $scope.Typeos.slice(0,1);
                $scope.Typeos = $scope.Typeos.concat(respData.result.list);
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

    $scope.MediaUpload = fnMediaUpload;
    function fnMediaUpload(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var type = reader.result.split("base64",2)[0]+"base64,";
            var data = reader.result.replace("data:", "").replace(/^.+,/, "");
            $scope.book.book_image = data;
            $scope.$apply();
        }
        reader.readAsDataURL(file);
    }

    $scope.EditBook = fnEditBook;
    function fnEditBook(){
        $scope.isEdit = true;
        $scope.isAdd = true;
        $scope.isSave = false;
    }

    function fnProfile(){
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        ProfileService.Profile(reqData,function(respData){
            $("#loadMe").modal("hide");
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

    $scope.AddBook = fnAddBook;
    function fnAddBook(){
        // $("#loadMe").modal("show");
        $scope.book.book_release_date = formatDate($scope.book.book_release_date);
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = $scope.book;
        BookService.AddBook(reqData,function(respData){
            // $("#loadMe").modal("hide");
            if(respData.code == 200){
                toastr.success(respData.description);
                $location.path("/manager/book");
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

    $scope.RemoveIamge = fnRemoveIamge;
    function fnRemoveIamge(){
        $scope.book.book_image = '';
    }

    $scope.SaveBook = fnSaveBook;
    function fnSaveBook(){
        var dateStr = formatDate($scope.book.book_release_date);
        $scope.book.book_release_date = dateStr;
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = $scope.book;
        BookService.UpdateBook(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                toastr.success(respData.description);
                fnGetBookByID();
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

    function fnGetComments(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = $scope.book;
        BookService.GetComments(reqData,function(respData){
            if(respData.code == 200){
                $scope.book.comments = respData.result.list;
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

    $scope.comment = {
        "content": "",
        "star": 0
    };
    $scope.AddComments = fnAddComments;
    function fnAddComments(){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = $scope.book;
        if($scope.comment.star<=0){
            toastr.error("Vui lòng đánh giá sao");
            return;
        }
        // $("#loadMe").modal("show");
        reqData.star = $scope.comment.star;
        reqData.content = $scope.comment.content;
        BookService.AddComments(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                fnGetComments();
                $scope.comment = {
                    "content": "",
                    "star": 0
                };
                fnResetStar();
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

    function fnResetStar(){
        var IDs = ['star-1','star-2','star-3','star-4','star-5'];
        IDs.forEach(function(id) {
            document.getElementById(id).checked = false;
        });
    }

    $scope.StyleStar = fnStyleStar;
    function fnStyleStar(star_num){
        if(star_num<=1){
            return {"color":'#F62'};
        }
        if(star_num>=5){
            return {"color":'#FE7'};
        }
        return {"color":'#FD4'};
    }

    //cart
    $scope.AddBookToCart = fnAddBookToCart;
    function fnAddBookToCart(book){
        if(book.book_number<=0){
            toastr.error("Số lượng sách phải lớn hơn 0");
            return;
        }
        $scope.book = book;
        // $("#loadMe").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = $scope.book;
        CartService.AddBookToCart(reqData,function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                $location.path("/cart");
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

    $scope.SubBookNumber = fnSubBookNumber;
    function fnSubBookNumber(book){
        if(book.book_number>1){
            book.book_number -= 1;
        }
    }

}]);