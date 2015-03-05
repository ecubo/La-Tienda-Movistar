// !! Assumes variable fileURL contains a valid URL to a path on the device,
//    for example, cdvfile://localhost/persistent/path/to/downloads/

var conexion, downURLBase, downFile, downFileUrl, downURL, downChecksum;
var downChecksum = [];

var myBase = 'https://www.movistar.es/atcliente/latienda/acceso/TME-RevistaMovistar/ContentsConfig';
var myVersion = 'appVersion=1.2'
var myID = 'test';
var myDevice = '-androidsmartphone';

var myURL = myBase+'?'+myVersion+'&id_dist='+myID+myDevice;

function downloadContent() {

    function checkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        if (states[networkState] != states[Connection.NONE]) {
            conexion = true;
            descargaContenidos();
        }
        else {
            conexion = false;
            noConnection();
        }
    };

    checkConnection();

    function descargaContenidos() {

        if (localStorage.getItem('visitada') != null) {
            // Inicio de la aplicación ya ha cargado contenido
            compruebaActualizacion();
        }
        else {
            // Carga de contenidos de app vacía
            $.ajax({
                'async': false,
                'global': false,
                'url': encodeURI(myURL),
                'dataType': "json",
                'success': function (data) {
                     json = data;
                     downURLBase = data.contentsURL;
                     downFileUrl = data.files[0].url;
                     downURL = downURLBase+downFileUrl
                     downChecksum.push(data.files[0].checksum);
                 }
            });

            var fileTransfer = new FileTransfer();
            // "https://www.movistar.es/atcliente/latienda/testing/latienda/smartphoneAndroid-test-total.zip"
            var uri = encodeURI(downURL);
            var fileURL = 'cdvfile://localhost/temporary/path/to/downloads/';

            fileTransfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    $('.ball1').text( Math.round((progressEvent.loaded/progressEvent.total)*100) +'%');
                  // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                } else {
                    $('.ball1').text( Math.round((progressEvent.loaded/progressEvent.total)*100) +'%');
                  // loadingStatus.increment();
                }
            };

            fileTransfer.download(
                uri,
                fileURL,
                function(entry) {
                    console.log("download complete: " + entry.toURL());

                    zip.unzip("cdvfile://localhost/temporary/path/to/downloads/",
                        "cdvfile://localhost/persistent/",
                        function(){
                            localStorage.setItem('checksum0', downChecksum[0]);
                            compruebaActualizacion();
                            //inicioAplicacion();
                        });
                },
                function(error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                },
                false
            );
        };

    };

    function noConnection() {

        if (localStorage.getItem('visitada') != null) {
            navigator.notification.confirm(
                'Es necesario disponer de acceso a internet. Inténtalo de nuevo más tarde.', // message
                sinConexion,            // callback to invoke with index of button pressed
                'Sin conexión',           // title
                ['OK']     // buttonLabels
            );
            function sinConexion() {
            //
            };
        }

    };

};

function inicioAplicacion() {
    initAyuda();
    initApp();
};

function compruebaActualizacion() {

    $.ajax({
        'async': false,
        'global': false,
        'url': encodeURI(myURL),
        'dataType': "json",
        'success': function (data) {
             json = data;

             if (data.files[data.files.length - 1].checksum != localStorage.getItem('checksum'+[data.files.length - 1]) ) {
                 for (var i = 0; i < data.files.length; i++) {
                     downURLBase = data.contentsURL;
                     downFileUrl = data.files[i].url;
                     downURL = downURLBase+downFileUrl
                     downChecksum.push(data.files[i].checksum);

                     if ( localStorage.getItem('checksum'+[i]) != data.files[i].checksum ) {

                        var fileTransfer = new FileTransfer();
                        var uri = encodeURI(downURL);
                        var fileURL = 'cdvfile://localhost/temporary/path/to/downloads/';

                        fileTransfer.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                $('.ball1').text( Math.round((progressEvent.loaded/progressEvent.total)*100) +'%');
                              // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                            } else {
                                $('.ball1').text( Math.round((progressEvent.loaded/progressEvent.total)*100) +'%');
                              // loadingStatus.increment();
                            }
                        };

                        fileTransfer.download(
                            uri,
                            fileURL,
                            function(entry) {
                                console.log("download complete: " + entry.toURL());

                                zip.unzip("cdvfile://localhost/temporary/path/to/downloads/",
                                    "cdvfile://localhost/persistent/",
                                    function(){
                                        var checksumNew = 'checksum'+(i-1);
                                        localStorage.setItem(checksumNew, downChecksum[i-1]);
                                    });
                            },
                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code" + error.code);
                            },
                            false
                        );
                     }
                 };
             }

         }
    });

    //localStorage.setItem('checksum', downChecksum);

    // Lanza Aplicación actualizada
    inicioAplicacion();

};
