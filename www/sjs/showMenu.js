$(function() {
    //FastClick.attach(document.body);
    var button = document.querySelector(".fastclick");
    new FastClick(button);
    var button2 = document.querySelector(".fastclickBack");
    new FastClick(button2);
    var button3 = document.querySelector(".fastclickHome");
    new FastClick(button3);
    var button4 = document.querySelector(".fastclickLocation");
    new FastClick(button4);
    var button5 = document.querySelector(".fastclickSocial");
    new FastClick(button5);
    var button6 = document.querySelector(".fastclickHelp");
    new FastClick(button6);
    var button7 = document.querySelector(".fastclickAuton");
    new FastClick(button7);
    var button8 = document.querySelector(".fastclickRep");
    new FastClick(button8);
    var button9 = document.querySelector(".fastclickClose");
    new FastClick(button9);
    var button10 = document.querySelector(".fastclickClose2");
    new FastClick(button10);
});

document.addEventListener("touchmove",function(e){e.preventDefault();/*stopSwiperView();*/},false);

var inicial = 0;
var anchoPagina;

var reloadFB = false;

// var appIdFB = 745779498790589;
// ID de La Tienda Movistar con mi usuario Emilio Cubo Ruiz

// ID DE la APP de facebook de La Tienda
var appIdFB = 354174354663001;
var nameFB = encodeURIComponent('La Tienda Movistar');
var captionFB = encodeURIComponent('Disponible en Apple y Play Store');
var messageFB = encodeURIComponent('Conoce lo último en smartphones, las novedades en Movistar TV, cómo llevar la música que te gusta en tu móvil y mucho más ne la nueva app "La Tienda" de Movistar.¡Ahora también en tu smartphone Android! Descárgatela gratis aqui');
var pictureFB = encodeURIComponent('https://www.movistar.es/atcliente/latienda/acceso/latienda/icon.png');
var linkFB = encodeURIComponent('https://play.google.com/store/apps/details?id=com.movistar.latienda.android.es');
var redirectFB = encodeURIComponent('https://www.facebook.com/');
var urlFB;

urlFB = 'https://www.facebook.com/dialog/feed?app_id='+appIdFB+'&display=touch&name='+nameFB+'&caption='+captionFB+'&description='+messageFB+'&picture='+pictureFB+'&link='+linkFB+'&redirect_uri='+redirectFB+'';

$paginaDrag = $('#page-wrap');
$paginaDrag.css({'-webkit-transition-duration':'0ms', '-webkit-transition-timing-function':'ease-out-cubic',
			  'transition-duration':'0ms', 'transition-timing-function':'ease-out-cubic',
			  '-webkit-perspective': 1000, '-webkit-backface-visibility': 'hidden'});


$(document).ready(function () {
    redimensiona();
    $paginaDrag.on("touchstart", function (e) {
        e.preventDefault();
        /*stopSwiperView();*/
        document.addEventListener("touchstart", touchStart, false);
    });
});

$(window).resize(function(){redimensiona();});

function redimensiona() {

    anchoPagina = $(window).width();
    $('#sumario').css({width:(anchoPagina-50)});
    if ($paginaDrag.hasClass('active')) {
        inicial = (anchoPagina-50);
    }
    else {
        inicial = 0;
    }
    $paginaDrag.css({
        '-webkit-transform':'translate3d(' + inicial + 'px,0,0)',
        'transform':'translate3d(' + inicial + 'px,0,0)',
        '-webkit-transition-duration':'0ms',
        'transition-duration':'0ms'
    });
}

function touchStart(e) {
    e.preventDefault();
    /*stopSwiperView();*/
    document.addEventListener("touchmove", touchMove, false);
    document.addEventListener("touchend", touchEnd, false);
    originalCoordX = e.targetTouches[0].pageX;
}
function touchMove(e) {
    e.preventDefault();
    /*stopSwiperView();*/
    $("select").blur();
    finalCoordX = e.targetTouches[0].pageX;
    feedback();

    if ( posX < 0 && inicial == 0 ) {
        posX  = 0;
    }
    if ( posX > 0 && inicial == (anchoPagina-50) ) {
        posX  = 0;
    }

    if ( ((inicial + posX) < (anchoPagina-50))  && ((inicial + posX) > 0) ) {
        $paginaDrag.css({ '-webkit-transform': 'translate3d('+(inicial + posX)+'px,0,0)',
                       'transform': 'translate3d('+(inicial + posX)+'px,0,0)',
                       '-webkit-transition-duration':'0ms',
                       'transition-duration':'0ms'});
    }

};
function feedback() {
    posX = finalCoordX -originalCoordX;
    // PRUEBA
    window.scrollTo(0, 1);
    // FIN PRUEBA
};

function touchEnd(e) {
    e.preventDefault();
    /*stopSwiperView();*/
    window.scrollTo(0, 1);
    document.removeEventListener("touchstart", touchStart, false);
    document.removeEventListener("touchmove", touchMove, false);
    document.removeEventListener("touchend", touchEnd, false);

    if ( (posX > (anchoPagina/2) && inicial == 0) || (posX > -((anchoPagina/2)-50) && inicial == (anchoPagina-50))) {
        inicial = (anchoPagina-50);
        $('#page-wrap, .maskSlider').addClass('active');
    }
    else {
        inicial = 0;
        $('#page-wrap, .maskSlider').removeClass('active');
    }

    $paginaDrag.css({
        '-webkit-transform':'translate3d(' + inicial + 'px,0,0)',
        'transform':'translate3d(' + inicial + 'px,0,0)',
        '-webkit-transition-duration':'200ms',
        'transition-duration':'200ms'
    });

    $('#social, #sumario ul li.social, #sumario ul li.social a').removeClass('active');

    posX = 0;
}

$paginaDrag.on('click', 'header a#menu', function(e) {
    e.preventDefault();
    /*stopSwiperView();*/
    e.stopPropagation();
    if ( $('#page-wrap').hasClass('active')) {
        inicial = 0;
        $('#social, #sumario ul li.social, #sumario ul li.social a').removeClass('active');
        $('#page-wrap').removeClass('active');
    }
    else {
        inicial = (anchoPagina-50);
        $('#page-wrap').addClass('active')
    }
    $paginaDrag.css({
        '-webkit-transform':'translate3d(' + inicial + 'px,0,0)',
        'transform':'translate3d(' + inicial + 'px,0,0)',
        '-webkit-transition-duration':'400ms',
        'transition-duration':'400ms'
    });

    return false;
});

if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod') {
    window.addEventListener('deviceorientation', function(eventData) {

        var yTilt = Math.round((-eventData.beta + 90) * (40/180) - 40);
        var xTilt = Math.round(-eventData.gamma * (20/180) + 20);

        // Thi 'if' statement checks if the phone is upside down and corrects
        // the value that is returned.
        if (xTilt > 0) {
            xTilt = -xTilt;
        } else if (xTilt < -40) {
            xTilt = -(xTilt + 80);
        }

        var backgroundPositionValue = xTilt + 'px ' + yTilt + "px";
        $('main').css({'background-position':backgroundPositionValue});

    }, false);
};


// $('#sumario ul li.social').on('click', 'a', function(){
//     $('#social, #sumario ul li.social, #sumario ul li.social a').toggleClass('active');
//     return false;
// });

// COMPARTIR
$('#sumario ul li.social').on('click', 'a', function(){
    // composeEmail();
    var caption = 'La Tienda Movistar. Disponible en Apple y Play Store';
    var message = 'Las últimas ofertas en la app de La Tienda Movistar. ¡Descárgatelo gratis!';
    var picture = 'https://www.movistar.es/atcliente/latienda/acceso/latienda/icon.png';
    var link = 'http://goo.gl/n3B6d1';

    window.plugins.socialsharing.share(message, caption, picture, link);
    return false;
    //location.href = 'mailto:?subject=Novedades en la app "La Tienda" de Movistar&body=En la app de "La Tienda" de Movistar podrás encontrar estés donde estés lo último en smartphones, las mejores ofertas, eventos, noticias y mucho más.%0D%0A%0D%0AAdemás incluye un localizador de tiendas más cercanas para que nos puedas encontrar fácilmente.%0D%0A%0D%0A¡No esperes más! ¡Descárgatela gratis en tu smartphone Android y sé el primero en enterarte de todo!%0D%0A%0D%0Ahttps://play.google.com/store/apps/details?id=com.movistar.latienda.android.es';
});



// FACEBOOK
/*$('.toFacebook').on('click', function(e) {
    e.preventDefault();
    // publishOnFacebook();

    // var messageFB = 'Conoce lo último en smartphones, las novedades en Movistar TV, cómo llevar la música que te gusta en tu móvil y mucho más ne la nueva app "La Tienda" de Movistar.¡Ahora también en tu smartphone Android! Descárgatela gratis aqui';
    // var pictureFB = 'https://www.movistar.es/atcliente/latienda/acceso/latienda/icon.png';
    // var linkFB = 'https://play.google.com/store/apps/details?id=com.movistar.latienda.android.es';
    // window.plugins.socialsharing.shareViaFacebook(messageFB, pictureFB, linkFB, function() {console.log('share ok')}, function(errormsg){'No ha sido posible conectar con Facebook.'});

    window.open(urlFB,'_blank','location=no','toolbar=no','closebuttoncaption=Volver');
});

// TWITTER
$('.toTwitter').on('click', function(e) {
    e.preventDefault();
    // sendTweet();

    // var messageFB = 'Conoce lo último en smartphones, las novedades en Movistar TV, cómo llevar la música que te gusta en tu móvil y mucho más ne la nueva app "La Tienda" de Movistar.¡Ahora también en tu smartphone Android! Descárgatela gratis aqui';
    // var pictureFB = 'https://www.movistar.es/atcliente/latienda/acceso/latienda/icon.png';
    // var linkFB = 'https://play.google.com/store/apps/details?id=com.movistar.latienda.android.es';
    // window.plugins.socialsharing.shareViaWhatsApp(messageFB, pictureFB, linkFB, function() {console.log('share ok')}, function(errormsg){'No ha sido posible compartir por WhatsApp'});

    window.open('https://twitter.com/intent/tweet?text=Las+últimas+ofertas+en+la+app+de+%23latiendamovistar.+¡Ahora+también+para+Android%21¡Descárgatelo+gratis%21&url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.movistar.latienda.android.es','_blank','location=no','toolbar=no','closebuttoncaption=Volver');
});*/