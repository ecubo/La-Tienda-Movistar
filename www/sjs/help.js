function initAyuda() {
    $.get("sections/help.html", function(data){
        $('#help .flexslider').html(data);

        $('#help .flexslider').flexslider({
            animation: "slide",
            slideshow: false,
            animationLoop: false,
        });

        $('#sumario ul li.help').on('click', 'a', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('#help').addClass('active');

            return false;
        });

        $('#help .headerHelp').on('touchend click', 'a', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('#help').removeClass('active');

            $('.flex-control-paging li:first-child a').trigger('click');

            return false;
        });

    });

};