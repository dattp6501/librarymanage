LibraryManagerApp.controller('DashboardCtrl', ['$scope', '$rootScope', '$location', '$cookies', 'DashboardService', 'NgTableParams', '$filter', 'CartService', 'ProfileService',
    function ($scope, $rootScope, $location, $cookies, DashboardService, NgTableParams, $filter, CartService, ProfileService) {
        (function initController() {
            $rootScope.sh_header = true;
            $scope.indexClassTable = 0;
            fnProfile(function (respData) {
                if (respData.code == 200) {
                    if ($rootScope.profile.mem_group == 'customer') {
                        initCustemer();
                    } else if ($rootScope.profile.mem_group == 'admin') {
                        initAdmin();
                    }
                }
            });
            $rootScope.user_name = $cookies.get("user_name");
        })();
        function fnProfile(callback) {
            // if($("#loadMe").is(":hidden")==true){
            //     $("#loadMe").modal("show");
            // }
            var reqData = {};
            reqData.session = $cookies.get("session");
            ProfileService.Profile(reqData, function (respData) {
                $("#loadMe").modal("hide");
                if (respData.code == 200) {
                    $rootScope.profile = respData.result.member;
                } else if (respData.code == 700) {
                    alert(respData.description);
                    $location.path("/login");
                } else if (respData.code == 500) {
                    $location.path("/login");
                } else {
                    toastr.error(respData.description);
                }
                callback(respData);
            });
        }
        // customer
        function initCustemer(){
            fnGetCart();
            fnGetBook();
        }
        function fnGetCart() {
            var reqData = {};
            reqData.session = $cookies.get("session");
            CartService.GetCart(reqData, function (respData) {
                if (respData.code == 200) {
                    $rootScope.cart = respData.result.cart;
                } else if (respData.code == 700) {
                    alert(respData.description);
                    $location.path("/login");
                } else if (respData.code == 500) {
                    $location.path("/login");
                } else {
                    toastr.error(respData.description);
                }
            });
        }
        $scope.GetBook = fnGetBook;
        function fnGetBook(){
            // $("#loadMe").modal("show");
            var reqData = {};
            if($cookies.get("session")==undefined || $cookies.get("session")==null || $cookies.get("session")==''){
                reqData.session = '';
            }else{
                reqData.session = $cookies.get("session");
            }
            reqData.title = $scope.keySearch;
            reqData.limit = -1;
            DashboardService.GetBook(reqData,function(respData){
                // $("#loadMe").modal("hide");
                if(respData.code == 200){
                    $scope.isLogin = respData.result.is_login;
                    if($scope.isLogin == false){
                        $cookies.remove("session");
                    }
                    $scope.tableDataBook = respData.result.list;
                    // $scope.tableParamsBook.page(1);
                    // $scope.tableParamsBook.reload();
                    //
                    $scope.ListBookDisplay1 = [];
                    var listRow = [];
                    var index = 0;
                    $scope.tableDataBook.forEach((dish) => {
                        listRow.push(dish);
                        index++;
                        if ((index) >= 4) {
                            $scope.ListBookDisplay1.push(listRow);
                            listRow = [];
                            index = 0;
                        }
                    });
                    if (listRow.length > 0) {
                        $scope.ListBookDisplay1.push(listRow);
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
        }
        $scope.tableDataBook = [];
        $scope.tableDisplayBook = [];
        $scope.tableParamsBook = new NgTableParams({
            page: 1, // show first page
            count: 10, // count per page
            sorting: {},
            filter: {}
        }, {
            total: $scope.tableDataBook.length, // length of data
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
        $scope.GotoDetailBook = fnGotoDetailBook;
        function fnGotoDetailBook(book) {
            if ($cookies.get("book_id") == undefined || $cookies.get("book_id") == null) {
                $cookies.put("book_id", book.book_id);
            } else {
                $cookies.remove("book_id");
                $cookies.put("book_id", book.book_id);
            }
            $location.path("/book-detail");
        }

        // admin
        function initAdmin(){
            fnStatsBookingCurrentDay();
            $scope.modelDateStatsRevenue = new Date().getFullYear();
            $("#datepicker").datepicker({
                format: "yyyy",
                viewMode: "years", 
                minViewMode: "years",
                autoclose:true //to close picker once year is selected
            });
            // 
            var dateFrom = new Date(); dateFrom.setDate(1);
            var dateTo = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            $scope.valueDateRangeStatsBook = moment(dateFrom).format('DD/MM/YYYY')+ " - " + moment(dateTo).format('DD/MM/YYYY');
            $("#kt_daterangepicker_1").daterangepicker({},fnGetListNumberOfBooking);
            fnStatsRevenueYear($scope.modelDateStatsRevenue);
            fnGetListNumberOfBooking(moment(dateFrom),moment(dateTo),undefined);
        }
        function fnStatsBookingCurrentDay() {
            // if($("#loadMe").is(":hidden")==true){
            //     $("#loadMe").modal("show");
            // }
            var reqData = {};
            reqData.session = $cookies.get("session");
            DashboardService.StatsBookingCurrentDay(reqData, function (respData) {
                $("#loadMe").modal("hide");
                if (respData.code == 200) {
                    $scope.ModelStatsBookingCurrentDay = respData.result;
                } else if (respData.code == 700) {
                    alert(respData.description);
                    $location.path("/login");
                } else if (respData.code == 500) {
                    $location.path("/login");
                } else {
                    toastr.error(respData.description);
                }
            });
        }
        function fnInitDrillChart(id, seriesData, dataDrill) {
            Highcharts.chart(id, {
                "title": {
                    "text": ''
                },
                "tooltip": {
                    "headerFormat": '',
                    "pointFormat": (
                        '<b>{series.name}</b><br /><br />' +
                        '{point.y}'
                    )
                },
                "series": seriesData,
                "xAxis": {
                    "type": 'category',
                    "min": 0,
                    // "max": 10,
                    "scrollbar": {
                        "enabled": true
                    }
                }, 
                "yAxis": {
                    "title": {
                        "text": 'Doanh thu(VND)'
                    }
                },
                "plotOptions": {
                    "column": {
                        "showInLegend": true,
                    },
                    "series": {
                        "dataLabels": {
                            "enabled": true,
                            "format": '{point.y:.0f}'
                        },
                        "minPointLength": 3
                    }
                },
                "chart": {
                    "type": 'column',
                    "events": {
                        drilldown: function (e) {
                            if (!e.seriesOptions){
                                var chart = this;
                                var data = dataDrill.find(mon => e.point.name==mon.month);
                                // drilldowns = {
                                //     'all': {
                                //         "name": 'Tất cả các đơn',
                                //         "color": Highcharts.getOptions().colors[1],
                                //         "data": data.revenue_theory
                                //     },
                                //     'real': {
                                //         "name": 'Đã thu thực tế',
                                //         "color": Highcharts.getOptions().colors[2],
                                //         "data": data.revenue_real
                                //     },
                                // };
                                drilldowns = {
                                    "all":{
                                        "name": 'Tất cả các đơn',
                                        "colorByPoint": false,
                                        "color": Highcharts.getOptions().colors[1],
                                        "data": []
                                    },
                                    "real":{
                                        "name": 'Đã thu thực tế',
                                        "colorByPoint": false,
                                        "color": Highcharts.getOptions().colors[2],
                                        "data": []
                                    }
                                };
                                for(let i=0; i<data.list_day.length; i++){
                                    drilldowns.all.data.push({
                                        "name": data.list_day[i],
                                        "y": data.revenue_theory[i],
                                        "drilldown": null
                                    });

                                    drilldowns.real.data.push({
                                        "name": data.list_day[i],
                                        "y": data.revenue_real[i],
                                        "drilldown": null
                                    });
                                }
                                console.log(drilldowns);
                                
                                series = [drilldowns.all,drilldowns.real];
                                Highcharts.each(series, function (s) {
                                    if(s) {
                                        chart.addSingleSeriesAsDrilldown(e.point, s);
                                    }
                                });
                                chart.applyDrilldown();
                            }
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                accessibility:{
                    enabled: false
                }
            });
        }
        $scope.StatsRevenueYear = fnStatsRevenueYear;
        function fnStatsRevenueYear(year) {
            if(year<2000){
                return ;
            }
            // if($("#loadMe").is(":hidden")==true){
            //     $("#loadMe").modal("show");
            // }
            var reqData = {};
            reqData.year = year;
            reqData.session = $cookies.get("session");
            DashboardService.StatsRevenueYear(reqData, function (respData) {
                $("#loadMe").modal("hide");
                if (respData.code) {
                    var seriesDataMonth = [{
                        "name": 'Tất cả các đơn',
                        "colorByPoint": false,
                        "color": Highcharts.getOptions().colors[1],
                        "data": []
                    },
                    {
                        "name": 'Đã thu thực tế',
                        "colorByPoint": false,
                        "color": Highcharts.getOptions().colors[2],
                        "data": []
                    }];

                    var dataDrill = [];
                    respData.list.forEach((m) => {
                        seriesDataMonth[0].data.push({
                            "name": m.month,
                            "y": m.revenue_theory,
                            "drilldown": m.month
                        });
                        seriesDataMonth[1].data.push({
                            "name": m.month,
                            "y": m.revenue_real,
                            "drilldown": m.month
                        });
                        var data = {};
                        data.month = m.month;
                        data.list_day = [];
                        data.revenue_theory = [];
                        data.revenue_real = [];
                        m.day.forEach((d) => {
                            data.list_day.push(d.date)
                            data.revenue_theory.push(d.revenue_theory);
                            data.revenue_real.push(d.revenue_real);
                        });
                        dataDrill.push(data);
                    });
                    fnInitDrillChart("chart_stats_year", seriesDataMonth, dataDrill);
                } else {
                    toastr.error(respData.description);
                }
            });
        }

        $scope.ListNumberOfBooking = [];
        function fnGetListNumberOfBooking(dateFrom, dateTo, label){
            // if($("#loadMe").is(":hidden")==true){
            //     $("#loadMe").modal("show");
            // }
            var reqData = {};
            reqData.session = $cookies.get("session");
            reqData.date_from = dateFrom.format('DD/MM/YYYY');
            reqData.date_to = dateTo.format('DD/MM/YYYY');
            DashboardService.StatsNumberOfBooking(reqData, function(respData){
                $("#loadMe").modal("hide");
                if(respData.code == 200){
                    $scope.ListNumberOfBooking = respData.list;
                }else{
                    toastr.error(respData.description);
                }
            });
        }
    }]);