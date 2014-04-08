$(document).ready(function() {
	var urls = [
		"css/i/cory.jpg",
		"css/i/remo.jpg",
		"css/i/niki.jpg",
		"css/i/joel.jpg",
		"css/i/taylor.jpg",
		"css/i/skrillex.jpg"
	];
	var names = [
		"Cory",
		"Remo",
		"Niki",
		"Joel",
		"Taylor",
		"Skrillex"
	];
	var count = $('#wrapper').children('.circle').length;
	for(var i=0;i<count;i++) {
		if(i == 1) {
			$('#friend'+i).css('background','url('+urls[i]+') no-repeat right -30px');
		} else if(i == 5) {
			$('#friend'+i).css('background','url('+urls[i]+') no-repeat -60px -30px');
		} else {
			$('#friend'+i).css('background','url('+urls[i]+') no-repeat');
		}
	}

	$(document.body).click(function() {
		$('.circle-info').hide('slow');
	});

	var currDim = $('.circle').css('width').split("px");
	var currDim = parseInt(currDim[0]);
	var addInc = 20;
	$('.circle').mouseenter(function() {
		var currId = $(this).attr("id").split("friend");
		var currId = currId[1];
		$(this).animate({'width':currDim+addInc+'px','height':currDim+addInc+'px'},{queue:false});
		$(this).html("<div class='circle-name border-radius-4'>"+names[currId]+"</div>");
	});
	$('.circle').mouseleave(function() {
		$(this).animate({'width':currDim+'px','height':currDim+'px'},{queue:false});
		$(this).html("");
	});

	$('.circle').click(function(e) {
		e.stopPropagation();
		var x = parseInt(e.pageX)-100;
		var y = parseInt(e.pageY)-100;
		$('.circle-info span').html($(this).children('.circle-name').html());
		if($('.circle-info').is(':hidden')) {
			$('.circle-info').show('normal');
		}
		$('.circle-info').css({'left':x+'px','top':y+'px'});
	});

	$('#circle-main').click(function() {
		$('#page1').addClass('rotated');
		$('#page1').rotate(-120,{speed:1},function() {
			$('#page2').fadeIn('normal');
		});
	});

	$('#circle-main').mouseenter(function() {
		$(this).html("<div class='circle-name border-radius-4'>Juan Vallejo</div>");
	});
	$('#circle-main').mouseleave(function() {
		$(this).html("");
	});

	$(document).keydown(function(e) {
		if(e.keyCode == 27 && $('#page1').is('.rotated')) {
			$('#page1').removeClass('rotated');
			$('#page2').fadeOut('normal', function() {
				$('#page1').rotate(0,{speed:1});
			});
		}
	});
});