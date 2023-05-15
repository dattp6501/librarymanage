LibraryManagerApp.controller('StatsAreaCtrl', ['$scope', '$rootScope', '$location', '$cookies', 'NgTableParams', '$filter', 'StatsAreaService', 'ProfileService', 
    function ($scope, $rootScope, $location, $cookies, NgTableParams, $filter, StatsAreaService, ProfileService) {
        (function initController() {
            $rootScope.sh_header = true;
            $scope.indexClassTable = 0;
            fnProfile(function (respData) {
                if (respData.code == 200) {
                    fnInitAdmin();
                }
            });
            $rootScope.user_name = $cookies.get("user_name");
        })();
        function fnInitAdmin(){
            fnStatsPointsOfBooking();
        }
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
        function fnStatsPointsOfBooking(){
            var reqData = {};
            reqData.session = $cookies.get("session");
            StatsAreaService.StatsPointsOfBooking(reqData, function(respData){
                if (respData.code == 200) {
                    $scope.ListPointBooking = respData.result;
                    fnGetInforMapbox();
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
        function fnGetInforMapbox(){
            var reqData = {};
            reqData.session = $cookies.get("session");
            StatsAreaService.GetInforMapbox(reqData, function(respData){
                if (respData.code == 200) {
                    $scope.keyMapbox = respData.key;
                    $scope.styleMapbox = respData.styles;
                    fnInitMap();
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
        $scope.initMap = fnInitMap;
        function fnInitMap(){
            // window.navigator.geolocation.getCurrentPosition(function(position){
                // lay vi tri hien tai
                // var lng = position.coords.longitude;
                // var lat = position.coords.latitude;
                var lng = 105.7944996081183;
                var lat = 20.989887698355055;
                mapboxgl.accessToken = $scope.keyMapbox;
                const map = new mapboxgl.Map({
                    container: 'map', // container ID
                    style: $scope.styleMapbox[1].value, // style URL
                    center: [lng, lat], // starting position [lng, lat]
                    zoom: 12, // starting zoom
                    projection: 'globe', // display the map as a 3D globe
                    hash : false, // hien thi vi tri trung tam ban do, do zoom len tren url
                    attributionControl : false
                });
                // marker
                // var el = document.createElement("div");
                // el.style.background = "url(markericon.png)";
                // el.style.width = "36px";
                // el.style.height = "50px";
                // el.style.cursor = "pointer";
                // var marker = new mapboxgl.Marker({
                //     color : "red"
                //     // element: el
                // });
                // marker.setLngLat([lng,lat]).addTo(map);
                // controll
                // chi duong
                // var directionsctrl = new MapboxDirections({
                //     accessToken: mapboxgl.accessToken
                // });
                // map.addControl(directionsctrl,'top-left');

                // thanh dieu khien
                const navigationctrl = new mapboxgl.NavigationControl();
                map.addControl(navigationctrl);

                // about
                const attrictrl = new mapboxgl.AttributionControl({
                    customAttribution: 'Map design by dattp',
                    compact : true
                });
                map.addControl(attrictrl);

                // vi tri hien tai
                const geoctrl = new mapboxgl.GeolocateControl({
                    // fitBoundsOptions: 15,
                    // geolocation: ,
                    // showAccuracyCircle: false,// vong tron xung quanh vi tri hien tai
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                    
                });
                map.addControl(geoctrl);

                // vung
                map.on('style.load', (e) => {//se chay sau khi ban do load xong
                    map.setFog({}); // Set the default atmosphere style
                    // cluster
                    map.addSource('cluster-src-booking',{// nguon du lieu
                        'type': 'geojson',
                        // 'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
                        // "data": DATA_SRC_MAP,
                        "data": $scope.ListPointBooking,
                        cluster: true,
                        clusterMaxZoom: 14,
                        clusterRadius: 50
                    });
                    map.addLayer({// cac lop can filter 
                        'id': 'cluster-booking-circle',
                        'type': 'circle',
                        'source': 'cluster-src-booking',
                        'filter': ['has','point_count'],
                        'paint':{
                            'circle-color': ['step',['get', 'point_count'],'#e2f021',50,'#e49e1c',100,'#f04033'],
                            'circle-radius': ['step',['get', 'point_count'],20,50,30,100,40]
                        }
                    });
                    map.addLayer({
                        'id': 'cluster-booking-point',
                        'type': 'circle',
                        'source': 'cluster-src-booking',
                        'filter': ['!has','point_count'],
                        'paint': {
                            'circle-radius': 4,
                            'circle-color': '#32ffee',
                            'circle-stroke-width': 1,
                            'circle-stroke-color': '#fff'
                        }
                    });
                    map.addLayer({
                        'id': 'cluster-booking-count',
                        'type': "symbol",
                        'source': 'cluster-src-booking',
                        'filter': ['has','point_count'],
                        'layout': {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12
                        }
                    });
                    map.on('click','cluster-booking-circle',(e)=>{
                        const features = map.queryRenderedFeatures(e.point, {
                            layers: ['cluster-booking-circle']
                        });
                        const clusterId = features[0].properties.cluster_id;
                        map.getSource('cluster-src-booking').getClusterExpansionZoom(
                            clusterId,
                            (err, zoom) => {
                                if(err){
                                    console.log('err : ',err);
                                    return;
                                }
                                map.easeTo({
                                    center: features[0].geometry.coordinates,
                                    zoom: zoom
                                });
                            }
                        );
                    });
                    map.on('click','cluster-booking-point', (e)=>{
                        // const features = map.queryRenderedFeatures(e.point, {
                        //     layers: ['cluster-booking-point']
                        // });
                        // const coordinates = features[0].geometry.coordinates.slice();// toa do cua diem trong src
                        // const mag = features[0].properties.mag;// do manh dong dat
                        // const tsunami = features[0].properties.tsunami === 1 ? 'yes' : 'no';// co song than hay khong
                        
                        // new mapboxgl.Popup()// them phan thong bao chi tiet cua diem duoc an
                        // .setLngLat(coordinates)
                        // .setHTML(
                        //     `độ lớn: ${mag}<br>Có sóng thần không?: ${tsunami}`
                        // )
                        // .addTo(map);
                    });
                    map.on('mouseenter', 'cluster-booking-circle', () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });
                    map.on('mouseleave', 'cluster-booking-circle', () => {
                        map.getCanvas().style.cursor = '';
                    });
                });//end onload map
    
            // });// end getCurrentPosition
        }
        
    }]);