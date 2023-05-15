LibraryManagerApp.controller('BookCtrl', ['$scope','$rootScope','$location','$cookies','BookService','NgTableParams','$filter','ProfileService',
function($scope,$rootScope,$location,$cookies,BookService,NgTableParams,$filter,ProfileService) {
    (function initController() {
        $rootScope.sh_header = true;
        $scope.indexClassTable = 0;
        // $("#loadMe").modal("show");
        fnProfile(function(respData){
            $("#loadMe").modal("hide");
            if(respData.code == 200){
                fnGetBook();
            }
        });
        
        $rootScope.user_name = $cookies.get("user_name");
    })();
    

    function fnProfile(callback){
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
            callback(respData);
        });
    }

    function fnGetBook(){
        // $("#md_load_book").modal("show");
        var reqData = {};
        if($cookies.get("session")==undefined || $cookies.get("session")==null || $cookies.get("session")==''){
            reqData.session = '';
        }else{
            reqData.session = $cookies.get("session");
        }
        reqData.title = "";
        reqData.limit = -1;
        BookService.GetBook(reqData,function(respData){
            // $("#md_load_book").modal("hide");
            if(respData.code == 200){
                $scope.isLogin = respData.result.is_login;
                if($scope.isLogin == false){
                    $cookies.remove("session");
                }
                $scope.tableDataBook = respData.result.list;
                $scope.tableParamsBook.page(1);
                $scope.tableParamsBook.reload();
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

    $scope.classTable = ['table-primary','table-secondary','table-success','table-danger','table-warning','table-info','table-light','table-dark'];
    $scope.getClassTable = getClassTable;
    function getClassTable(){
        var length = $scope.classTable.length;
        $scope.indexClassTable += 1;
        if($scope.indexClassTable>=length){
            $scope.indexClassTable = 0;
        }
        return $scope.classTable[$scope.indexClassTable];
    }
    $scope.tableDataBook = [];
    $scope.tableDisplayBook = [];
    $scope.tableParamsBook = new NgTableParams({
        page: 1, // show first page
        count: 20, // count per page
        sorting: {},
        filter: {}
    }, {
        counts:[],
        total:1,
        // total: $scope.tableDataBook.length, // length of data
        getData: function($defer, params) {
            if ($scope.tableDataBook != true) {
                var filteredData = params.filter() ?
                    $filter('filter')(($scope.tableDataBook), params.filter()) :
                    $scope.tableDataBook;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.tableDataBook;
                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.tableDisplayBook = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        }
    });

    $scope.DeleteBook = fnDeleteBook;
    function fnDeleteBook(book){
        // $("#md_load").modal("show");
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.book = book;
        BookService.DeleteBook(reqData,function(respData){
            // $("#md_load").modal("hide");
            if(respData.code == 200){
                toastr.success(respData.description);
                fnGetBook();
            }else if(respData.code == 700){
                alert(respData.description);
                $location.path("/login");
            }else if(respData.code == 500){
                $location.path("/login");
            }else{
                toastr.error(respData.description);
                // $cookies.remove('user_name');
                // $cookies.remove('session');
            }
        });
    }

    $scope.ShowUpdate = fnShowUpdate;
    function fnShowUpdate(book){
        if($cookies.get("book_id")==undefined || $cookies.get("book_id")==null){
            $cookies.put("book_id",book.book_id);
        }else{
            $cookies.remove("book_id");
            $cookies.put("book_id",book.book_id);
        }
        $rootScope.BookDetail = JSON.parse(JSON.stringify(book));
        $location.path("/book-detail");
    }

    $scope.GoTONewBook = fnGoTONewBook;
    function fnGoTONewBook(){
        if($cookies.get("book_id")==undefined || $cookies.get("book_id")==null){
            $cookies.put("book_id",-1);
        }else{
            $cookies.remove("book_id");
            $cookies.put("book_id",-1);
        }
        $rootScope.BookDetail = undefined;
        $location.path("/book-detail");
    }

    $scope.ShowConfirmDeleteBook = fnShowConfirmDeleteBook;
    function fnShowConfirmDeleteBook(book){
        $scope.BookSelected = book;
        Swal.fire({
            title: 'Thông báo',
            text: "Bạn chắc chắn muốn xóa "
            + book.book_title + " của tác giả " + book.book_author
            +" ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                fnDeleteBook(book);
            }
        })
        // $("#confirm-delete-book").modal("show");
    }

    $scope.ShowModalAddType = fnShowModalAddType;
    function fnShowModalAddType(){
        $("#modal-add-type").modal("show");
        $scope.newType = {};
    }

    $scope.AddType = fnAddType;
    function fnAddType(type){
        var reqData = {};
        reqData.session = $cookies.get("session");
        reqData.type = type;
        BookService.AddType(reqData,function(respData){
            if(respData.code == 200){
                $("#modal-add-type").modal("hide");
                toastr.success(respData.description);
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