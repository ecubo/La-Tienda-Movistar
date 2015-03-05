var locationHash = [];
var posArray = 0;

function initApp() {
    $("#pre-load-web").fadeOut(700,function() {
        $(this).remove();
    });

    var appVisitada = localStorage.getItem('visitada');

    if (appVisitada == null) {
        localStorage.setItem('visitada', 'true');
        $('#help').addClass('active');
    };

	var section = window.location.hash;
	if (section == "" || section == null || section == "#home") {
		section = "home";
	}
	section = section.replace('#','');

	locationHash.push('#'+section);

    $.get("sections/indice.html", function(data){
        $('#sumario .content').html(data);
    	$('#sumario .content a[href=#'+section+']').addClass('active');

		var myScroll;
		var seccion=null;
		document.addEventListener("pageshow",function(e){
			seccion=e.data.section;
			if(myScroll!=null) {
				if(seccion!=null){
					$("#scroller").css("opacity",0);
				}
				else {
					$("#scroller").css("opacity",1);
				}
				myScroll.scrollToElement("."+seccion,100);
				if(seccion!=null) {
					$("#scroller").css("opacity",1);
				}
				seccion=null;
			}
		},false);

		$(window).resize(function(){
			if (myScroll!=null) {
				setTimeout(function(){
					myScroll.refresh();
					if(seccion!=null)
						myScroll.scrollToElement("."+seccion,100);
					seccion=null;
				},0)}
		});

		setTimeout(function(){
			myScroll=new iScroll("wrapper",{scrollbarClass:"myScrollbar"});
			if(seccion!=null){
				$("#scroller").css("opacity",0);
				myScroll.scrollToElement("."+seccion,100);
				$("#scroller").css("opacity",1);
				seccion=null;
			}
			else{
				$("#scroller").css("opacity",1);
			}
		},1000);

    });

	var section = section.replace("#", "");
	var sectionNavbar = section+'Nav';


	$('main').attr('id', section);

    $.get('sections/navbars/'+sectionNavbar+'.html', function(data){
        $('#navbar').html(data);
    });

    $.get('sections/'+section+'.html', function(data){
        $('main').html(data);
    	var titular = $('#sumario .content a[href='+window.location.hash+'] h3').text();
		$('header h1').text(titular);
    });

    $('#page-wrap').on('touchstart click', '#navbar ul li a', function(e) {
    	e.preventDefault();
	    e.stopPropagation();

	    if (!$(this).parent().hasClass('active')) {
		    var section = $(this).attr('href');
	    	var section = section.replace("#", "");

	    	$('#navbar ul li').removeClass('active');
	    	$(this).parent().addClass('active');

	    	$('main').attr('id', section);

		    $.get('sections/'+section+'.html', function(data){
		        $('main').html(data);
		    	// var titular = $('main .content').attr('data-role');
		    	// $('header h1').text(titular);
		    });
	    }
    });

    $('#sumario .content, #sumario ul li.home').on('click', 'a', function(e) {
    	e.preventDefault();
    	e.stopPropagation();

    	var attr = $(this).attr('href');
    	if (!$(this).hasClass('active') && !(attr == locationHash[locationHash.length-1]) ) {

	    	var titular = $(this).find('h3').text();
	    	if (titular == "") {
	    		titular = $('#sumario .content a[href=#home] h3').text();
	    	}
	    	$('header h1').text(titular);

	    	var section = $(this).attr('href');
	    	var section = section.replace("#", "");
			var sectionNavbar = section+'Nav';

		    $.get('sections/navbars/'+sectionNavbar+'.html', function(data){
		        $('#navbar').html(data);
		    });

			$('main').attr('id', section);

		    $.get('sections/'+section+'.html', function(data){
		        $('main').html(data);
		    });

	    	$('header a#back').css({'visibility': 'visible'});

	    	$('#sumario .content a').removeClass('active');
	    	if ($(this).text() == "h") {
	    		$('#sumario .content a[href="#home"]').addClass('active');
	    	}
	    	else {
		    	$(this).addClass('active');
	    	}

	    	locationHash.push($(this).attr('href'));
	    	posArray++;

			setTimeout(function(){
		    	$('header a#menu').trigger('click');
			}, 0);

    	}
    	else if (attr == locationHash[locationHash.length-1]) {
	    	$('header a#menu').trigger('click');
    	}
    	else {
    		return false;
    	}
    });
}

$('#page-wrap').on('click', 'header a#back', function(e) {
	e.preventDefault();
    e.stopPropagation();

	if (posArray > 0) {
		locationHash.splice(posArray, 1);
		posArray--;

		if(locationHash.length == 1) {
			$('header a#back').css({'visibility': 'hidden'});
		}
		else {
			$('header a#back').css({'visibility': 'visible'});
		}
		window.location.href = locationHash[posArray];

		var section = locationHash[posArray];

		var section = section.replace("#", "");
		var sectionNavbar = section+'Nav';

	    $.get('sections/navbars/'+sectionNavbar+'.html', function(data){
	        $('#navbar').html(data);
	    });

    	var titular = $('#sumario .content a[href='+locationHash[posArray]+'] h3').text();
		$('header h1').text(titular);

    	$('#sumario .content a').removeClass('active');
    	$('#sumario .content a[href='+locationHash[posArray]+']').addClass('active');

		$('main').attr('id', section);

	    $.get('sections/'+section+'.html', function(data){
	        $('main').html(data);
	    });
	}
});