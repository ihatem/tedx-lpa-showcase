





/**
 * Creates the header fullwidth slider functionality
 */
;(function($){

	function highlight( items ) {
		items.addClass('current-slide');
	}
	function unhighlight() {
		$('#gallery-controller li').removeClass('current-slide');
	}
	function changeImage( items ){
		var bgImage = items.filter(':first').attr('data-bg');
		$.backstretch(bgImage);
	}

	$(window).load(function(){

		/////////////////////////////////////////////
		// Slider
		/////////////////////////////////////////////
		if($('#gallery-controller').length > 0){
			var itemIndex = ($('#gallery-controller li').length > 5)? '0': '1';
			$('#gallery-controller .slides').carouFredSel({
				responsive: true,
				prev: {
					button: '#gallery-controller .carousel-prev',
					key: 'left',
					onBefore: function(oldItems, newItems) {
						unhighlight();
						changeImage( newItems );
					},
					onAfter	: function(oldItems, newItems) {
						highlight( newItems.filter(':eq(0)') );
					}
				},
				next: {
					button: '#gallery-controller .carousel-next',
					key: 'right',
					onBefore: function(oldItems, newItems) {
						unhighlight();
						changeImage( newItems );
					},
					onAfter	: function(oldItems, newItems) {
						highlight( newItems.filter(':eq('+itemIndex+')') );
					}
				},
				width: '100%',
				auto: {
					play : themifyVars.play,
					pauseDuration: themifyVars.autoplay,
					button: '#gallery-controller .carousel-playback'
				},
				scroll: {
					items: 1,
					duration: themifyVars.speed,
					wipe: true,
					onBefore: function(oldItems, newItems) {
						unhighlight();
						changeImage( newItems );
					},
					onAfter	: function(oldItems, newItems) {
						highlight( newItems.filter(':eq('+itemIndex+')') );
					}
				},
				items: {
					visible: 5,
					minimum: 1,
					width: 20
				},
				onCreate : function (){
					$('#gallery-controller').css( {
						'height': 'auto',
						'visibility' : 'visible'
					});

					$('#gallery-controller .carousel-next, #gallery-controller .carousel-prev').wrap('<div class="carousel-arrow"/>');
					$('#gallery-controller .caroufredsel_wrapper + .carousel-nav-wrap').remove();

					$('#gallery-controller li:first').addClass('current-slide');

					if($('#gallery-controller li').length > 2){
						$('.carousel-playback').css('display', 'inline-block');
					}

					if(!themifyVars.play) {
						$('.carousel-playback').hide();
					}
				}
			}).find("li").click( function() {
					$('#gallery-controller li').removeClass('current-slide');
					$(this).addClass('current-slide');
					$('#gallery-controller li').trigger("slideTo", [
						$(this),
						0,
						false,
						{
							items: 1,
							duration: 300,
							wipe: true,
							onBefore: function(oldItems, newItems) {

								//changeImage( newItems );
							},
							onAfter	: function(oldItems, newItems) {

							}
						},
						null,
						'next']);


					// Set image and index using current data properties
					changeImage( $(this) );

				}
			).css("cursor", "pointer");

			/////////////////////////////////////////////
			// Initialize fullscreen background
			/////////////////////////////////////////////

			var themifyImages = [];

			// Initialize images array with URLs
			$('#gallery-controller li').each(function(){
				themifyImages.push( $(this).attr('data-bg') );
			});

			$(themifyImages).each(function() {
				$("<img/>").attr('src', this);
			});

			// Call backstretch for the first time
			$.backstretch(themifyImages[0], {
				fade : themifyVars.speed
			});

		} // end if #gallery-controller

	});

// Adjust slider on window resizing stop
	$(window).on('resizestop', function (e) {
		if( !$('.carousel-playback').hasClass('paused') ){
			$("#gallery-controller .slides").trigger("next");
		}
	});

	$(document).ready(function() {

		/////////////////////////////////////////////
		// Parse injected vars
		/////////////////////////////////////////////
		themifyVars.autoplay = parseInt(themifyVars.autoplay)*1000;
		themifyVars.speed = parseInt(themifyVars.speed);
		themifyVars.play = (themifyVars.play == 'no')? false : true;

		////////////////////////
		// Add wrap for styling
		////////////////////////
		$('#gallery-controller img').each(function() {
			$(this).wrap('<span class="image-wrap" style="width: auto; height: auto;"/>');
			$(this).removeAttr('class');
		});

		/////////////////////////////////////////////
		// Go fullscreen
		/////////////////////////////////////////////
		$('#fullscreen-button').on( 'click', toggleContent);
		$('body').on( 'keyup', toggleContent);

		/////////////////////////////////////////////
		// Pause carousel
		/////////////////////////////////////////////
		$('.carousel-playback').click(function(){
			$(this).toggleClass('paused');
		});

	});

// Toggle Content and go fullscreen
	var toggleContent = function(event){
		if( 'keyup' == event.type ){
			if( 27 != event.which || !$('body').hasClass('fullscreen-active') ){
				return;
			}
		}
		if(!$('#fullscreen-button').is(':animated')){
			$('#fullscreen-button').toggleClass('active');

			if($('#fullscreen-button').hasClass('active')){
				// go fullscreen
				$('#fullscreen-button').animate({
					right: '-40px'
				}, 100).animate({
						top: '10px'
					}, 100).animate({
						right: '10px'
					});
			} else {
				// back from fullscreen
				$('#fullscreen-button').css({
					'right' : '-40px',
					'top' : ''
				}, 100).animate({
						bottom: '10px'
					}, 100).animate({
						right: '10px'
					});
			}
		}
	};

}(jQuery));