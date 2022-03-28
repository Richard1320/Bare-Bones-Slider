// JavaScript Document


SyntaxHighlighter.all();
SyntaxHighlighter.defaults['tab-size'] = 2;

(function($) {
	'use strict';

	$(document).ready(function() {
	    const navlist = document.getElementById("navlist");
        new Lavalamp(navlist, {
            easing: 'easeOutBack'
        });

		$('#nav-show').click(function(e) {
            const l = $('#navlist');
			if (l.hasClass('active')) {
				l.removeClass('active').slideUp();
			} else {
				l.addClass('active').slideDown();
			}
			e.preventDefault();
		});

		// front page
		$('#slider').bbslider({
			auto:true,
			loop:true,
			touch: true,
			onDemand: true
		});

		// example page
        const ex_nav = $('#example-nav-wrapper');
        const sticky = function() {
			if ($(window).scrollTop() >= 120){
				ex_nav.addClass('sticky');
			} else {
				ex_nav.removeClass('sticky');
			}
		}; // end sticky
		sticky();

		$(window).scroll(sticky);

		$('#example-nav a').click(function(e) {
            const href = $(this).attr('href');
			const pos  = $(href).position().top;
			$('html,body').animate({
				scrollTop: pos
			}, 700); // end animate
			ex_nav.removeClass('active');
			e.preventDefault();
		}); // End click

		$('#example-nav-show').click(function(e) {
			ex_nav.toggleClass('active');
			e.preventDefault();
		});

		$('#default').bbslider();

		$('#auto').bbslider({
			auto: true,
			timer:3000,
			loop:true,
			pauseOnHit:false
		});

        const pagerHTML = function(pageNum,wrapperID,title) {
		  if (!title) {
		    title = pageNum;
		  }
		  return $('<div class="bb-link-wrapper"><a href="#' + pageNum + '" data-link="' + wrapperID + '" class="bb-pager-link">' + title + '</a></div>' );
		}
		$('#pager').bbslider({
			pager:	  true,
			pagerWrap:  '#pagination-wrapper',
			pagerText: pagerHTML
		});

		$('#controls').bbslider({
			controls: true,
			loop:     false,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],
		});

		$('#custom-controls').bbslider();
		$('#prev').click(function(e) {
			$('#custom-controls').bbslider('prev');
			e.preventDefault();
		});
		$('#next').click(function(e) {
			$('#custom-controls').bbslider('next');
			e.preventDefault();
		});

		$('#none').bbslider({
			controls:   true,
			transition: 'none',
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

		$('#fade').bbslider({
			controls:   true,
			transition: 'fade',
			duration:   1000,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

		$('#slide').bbslider({
			controls:   true,
			transition: 'slide',
			duration:   1000
		});

		$('#slideVert').bbslider({
			controls:   true,
			transition: 'slideVert',
			duration:   1000
		});

		$('#blind').bbslider({
			controls:   true,
			transition: 'blind',
			duration:   1000,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

    $('#mask').bbslider({
      controls:   true,
      transition: 'mask',
      maskImage: '/images/mask.png',
      duration:   1000,
      maskSteps: 23,
      controlsText:[
        '<a class="prev control fa fa-angle-left" href="#"></a>',
        '<a class="next control fa fa-angle-right" href="#"></a>'],
    
    });
    
    $('#carousel-none').bbslider({
			controls:     true,
			transition:   'none',
			carousel:     3,
			carouselMove: 2,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

		$('#carousel-fade').bbslider({
			controls:     true,
			transition:   'fade',
			duration:     1000,
			carousel:     3,
			carouselMove: 2,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

		$('#carousel-slide').bbslider({
			controls:     true,
			transition:   'slide',
			duration:     1000,
			carousel:     3,
			carouselMove: 2,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});

        const callBefore = function() {
            const callback = $('#callback');
            const pCount = callback.data('pCount');
            const pIndex = callback.data('pIndex');
            const panel  = pIndex + 1;
			$('#call-log').append('<p>Panel ' + panel + ' of ' + pCount + ' total panels has ended.</p>');
		};
		const callAfter = function() {
            const callback = $('#callback');
            const pCount = callback.data('pCount');
            const pIndex = callback.data('pIndex');
            const panel  = pIndex + 1;
			$('#call-log').append('<p>Panel ' + panel + ' of ' + pCount + ' total panels has started.</p>');
		};

		$('#callback').bbslider({
			controls: true,
			callbackBefore: callBefore,
			callbackAfter: callAfter,
			controlsText:[
				'<a class="prev control fa fa-angle-left" href="#"></a>',
				'<a class="next control fa fa-angle-right" href="#"></a>'],

		});


		$('#update').bbslider({
			pager:     true,
			pagerWrap: '#update-pager',
			pageInfo:  true,
			infoWrap:  '#update-info'
		});
		$('#add-slides').click(function(e) {
			const wrapper = $('#update');

			for (let i = 0; i < 10; i++) {
				/*
				var c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
				var l = 5;
				var s = '';
				for (var x=0; x<l; x++) {
					var r = Math.floor(Math.random() * c.length);
					s += c.substring(r,r+1);
				}
				*/
                const s = Math.random().toString(36).substring(5);

				wrapper.append('<div><img src="http://lorempixel.com/507/338/?'+s+'" alt="placeholder" width="507" height="338" /></div>');
			}
			e.preventDefault();
		});
		$('#update-slider').click(function(e) {
			$('#update').bbslider('update');
			e.preventDefault();
		});

		$('#touch').bbslider({
			controls:    false,
			touch:       true,
			transition:  'slide',
			touchoffset: 50
		});

		const rsz = function() {
			$('.bbslider-wrapper').bbslider('update');
		}; // end resize
		$(window).resize(rsz);
		$(window).on('load',rsz);

	});

})(jQuery);
