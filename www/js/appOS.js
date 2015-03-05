if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod') {
    $('body').attr('id', 'ios');
}
else {
	// ID del body para iOS/Android
    $('body').attr('id', 'android');

    // Eventos :active botones
    $('a#menu').bind("touchstart", function () {
        $(this).addClass("active");
    })
    $('a#menu').bind("touchend", function() {
        $(this).removeClass("active");
    });
    $('a#menu').bind("touchcancel", function() {
        // sometimes Android fires a touchcancel event rather than a touchend. Handle this too.
        $(this).removeClass("active");
    });

    // Botón Volver
    document.addEventListener('backbutton', function(e){
        $('header a#back').trigger('click');
    }, true);
}


// if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
//     $('a#menu').bind("touchstart", function () {
//         $(this).addClass("active");
//     })
//     $('a#menu').bind("touchend", function() {
//         $(this).removeClass("active");
//     });
//     $('a#menu').bind("touchcancel", function() {
//         // sometimes Android fires a touchcancel event rather than a touchend. Handle this too.
//         $(this).removeClass("active");
//     });
// };
