var mapaMostrado = false;
var setZoom = 13;
var latitude,longitude;
var setGeo = true;

function initialize(getRadius) {
    var markerclusterer;
    navigator.geolocation.getCurrentPosition(successGeo, errorGeo);

    function errorGeo(error) {
        navigator.notification.confirm(
          'No ha sido posible acceder a tu ubicación. Desde Ajustes puedes permitir acceder a tu ubicación mientras se utiliza la aplicación.', // message
          erroPos,            // callback to invoke with index of button pressed
          'La Tienda Movistar',           // title
          ['Ver Tiendas','Cancelar']     // buttonLabels
        );
    }

    function erroPos(buttonIndex) {
        if (buttonIndex == 1) {
            latitude = 40.310192;
            longitude = -3.684277;
            var posGeo = new google.maps.LatLng(latitude, longitude);
            getRadius = 2000000;
            setZoom = 5;
            setGeo = false;
            showTiendas(posGeo);
        }
        else {
            mapaMostrado = false;
            $('#mapa').removeClass('active');
        }
    }

    function successGeo(pos) {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        var posGeo = new google.maps.LatLng(latitude, longitude);
        showTiendas(posGeo);
    }

    function showTiendas(pos) {

            var radius = getRadius, //how is this set up
                center = new google.maps.LatLng(latitude,longitude),
                bounds = new google.maps.Circle({center: center, radius: radius}).getBounds(),
                image = 'sections/mapa/movistar.svg';

                mapOptions = {
                    center: center,
                    zoom: setZoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: false
                };

            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


            if (setGeo) {
                var latLngPos = new google.maps.LatLng(latitude, longitude);
                var markerPos = new google.maps.Marker({
                            position: latLngPos,
                            map: map,
                            icon: 'sections/mapa/here.svg'
                        });
            };

            marcadores = [];
            var visibles = ['autonomo','reparacion','autonRep','generico'];

            setMarkers(center, radius, map);

            markerclusterer = new MarkerClusterer(map, marcadores, {
                minimumClusterSize: 2
                , styles: [{
                    url: "sections/mapa/movistar35.svg"
                    , height: 35
                    , width: 35
                    , textColor: 'rgb(0,92,132)'
                    , textSize: 16
                    , anchor: [35,35]
                },{
                    url: "sections/mapa/movistar45.svg"
                    , height: 45
                    , width: 45
                    , textColor: 'rgb(0,92,132)'
                    , textSize: 16
                    , anchor: [45,45]
                },{
                    url: "sections/mapa/movistar55.svg"
                    , height: 55
                    , width: 55
                    , textColor: 'rgb(0,92,132)'
                    , textSize: 16
                    , anchor: [55,55]
                }]
            });

            $('#autonomos').on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                $('input.control.autonomo').attr('checked', !$('input.control.autonomo').attr('checked'));
                $(this).find('a').toggleClass('active');
                if ($('input.control.todos').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['autonomo','autonRep'];
                }
                else if ($('input.control.autonomo').attr('checked') == 'checked' && $('input.control.reparacion').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['autonRep'];
                }
                else if ($('input.control.autonomo').attr('checked') != 'checked' && $('input.control.reparacion').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['autonRep','reparacion'];
                }
                else {
                    $('input.control.todos').attr('checked','checked');
                    visibles = ['autonomo','reparacion','autonRep','generico'];
                }
                ocultar_marcadores();
            });

            $('#reparacion').on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                $('input.control.reparacion').attr('checked', !$('input.control.reparacion').attr('checked'));
                $(this).find('a').toggleClass('active');
                if ($('input.control.todos').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['reparacion','autonRep'];
                }
                else if ($('input.control.reparacion').attr('checked') == 'checked' && $('input.control.autonomo').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['autonRep'];
                }
                else if ($('input.control.reparacion').attr('checked') != 'checked' && $('input.control.autonomo').attr('checked') == 'checked') {
                    $('input.control.todos').attr('checked',false);
                    visibles = ['autonRep','autonomo'];
                }
                else {
                    $('input.control.todos').attr('checked','checked');
                    visibles = ['autonomo','reparacion','autonRep','generico'];
                }
                ocultar_marcadores();
            });

            $('#mapa .headerLocation').on('click', 'a', function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#mapa, #autonomos a, #reparacion a').removeClass('active');
                $('input.control.todos').attr('checked',true);
                $('input.control.autonomo').attr('checked',false);
                $('input.control.reparacion').attr('checked',false);
                visibles = ['autonomo','reparacion','autonRep','generico'];
                ocultar_marcadores();
                return false;
            });

            var ocultar_marcadores = function(){
                for (var i = 0, length = marcadores.length; i < length; i++){
                    marcadores[i].setVisible(visibles.indexOf(marcadores[i].tipo) !== -1);
                }
                markerclusterer.setIgnoreHidden(true);
                markerclusterer.repaint();
            };
    };
};


function setMarkers(center, radius, map) {
    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "sections/mapa/json/tiendas.json",
            'dataType': "json",
            'success': function (data) {
                 json = data;
             }
        });
        return json;
    })();


var circle = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 0.0,
        strokeWeight: 1.0,
        fillColor: 'rgb(0,92,132)',
        fillOpacity: 0.2,
        clickable: false,
        map: map,
        center: center,
        radius: radius
    });

var bounds = circle.getBounds();

        //loop between each of the json elements
        for (var i = 0, length = json.length; i < length; i++) {
            var data = json[i],
            latLng = new google.maps.LatLng(data.lat, data.lon);

            if(bounds.contains(latLng)) {
                // Creating a marker and putting it on the map
                if (data.reparacion && data.autonomo) {
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: data.name,
                        phone: data.tel,
                        icon: 'sections/mapa/movistar.svg',
                        tipo :'autonRep'
                    });
                }
                else if (data.reparacion) {
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: data.name,
                        phone: data.tel,
                        icon: 'sections/mapa/movistar.svg',
                        tipo :'reparacion'
                    });
                }
                else if (data.autonomo) {
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: data.name,
                        phone: data.tel,
                        icon: 'sections/mapa/movistar.svg',
                        tipo : 'autonomo',
                    });
                }
                else {
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: data.name,
                        phone: data.tel,
                        icon: 'sections/mapa/movistar.svg',
                        tipo : 'generico',
                    });
                }

                infoBox(map, marker, data);

                function infoBox(map, marker, data) {
                    // var infoWindow = new google.maps.InfoWindow();

                    // Attaching a click event to the current marker
                    // google.maps.event.addListener(marker, "click", function(e) {
                    //     infoWindow.setContent(data.content);
                    //     infoWindow.open(map, marker);
                    // });

                    // Creating a closure to retain the correct data
                    // Note how I pass the current data in the loop into the closure (marker, data)
                    (function(marker, data) {
                      // Attaching a click event to the current marker
                      google.maps.event.addListener(marker, "click", function(e) {
                          map.panTo(marker.getPosition());
                          function onConfirm(buttonIndex) {
                            if (buttonIndex == 1) {
                                window.location.href = 'tel:'+data.tel+'';
                            }
                            else {
                              return false;
                            }
                          }

                          navigator.notification.confirm(
                              ucWords(data.calle.toLowerCase())+' '+ucWords(data.pobl.toLowerCase()), // message
                              onConfirm,            // callback to invoke with index of button pressed
                              data.name,           // title
                              ['Teléfono','OK']     // buttonLabels
                          );

                          function ucWords(string){
                              var arrayWords;
                              var returnString = "";
                              var len;
                              arrayWords = string.split(" ");
                              len = arrayWords.length;
                              for(i=0;i < len ;i++){
                                  if(i != (len-1)){
                                      returnString = returnString+ucFirst(arrayWords[i])+" ";
                                  }
                                  else{
                                      returnString = returnString+ucFirst(arrayWords[i]);
                                  }
                              }
                              return returnString;
                          };

                          function ucFirst(string){
                              return string.substr(0,1).toUpperCase()+string.substr(1,string.length).toLowerCase();
                          };
                        // infoWindow.setContent(data.name);
                        // infoWindow.open(map, marker);
                      });
                    })(marker, data);
                }

                marcadores.push(marker);
            }
        }
    }

    //google.maps.event.addDomListener(window, 'load', initialize(5000));

//MAPA
$('#sumario ul li.location').on('click', 'a', function(e){
    e.preventDefault();
    e.stopPropagation();
    if (navigator.onLine) {
        $('#mapa').addClass('active');
        if (!mapaMostrado) {
            mapaMostrado = !mapaMostrado;
            initialize(3000);
        };
    }
    else {
        function sinConexion() {
            // do something
        }

        navigator.notification.alert(
            'Para localizar tu tienda Movistar más cercana necesitas disponer de conexión a internet.',  // message
            sinConexion,         // callback
            'La Tienda Movistar',            // title
            'OK'                  // buttonName
        );
    }
    return false;
});

// $('#mapa .headerLocation').on('click', 'a', function(e){
//     e.preventDefault();
//     e.stopPropagation();
//     $('#mapa, #autonomos a, #reparacion a').removeClass('active');
//     $('input.control.todos').attr('checked',true);
//     $('input.control.autonomo').attr('checked',false);
//     $('input.control.reparacion').attr('checked',false);
//     visibles = ['autonomo','reparacion','autonRep','generico'];
//     ocultar_marcadores();
//     return false;
// });
