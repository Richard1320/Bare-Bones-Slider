/**
 * Bare Bones Slider
 * http://www.bbslider.com/
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.0.2
 * 
 * Copyright (c) 2013 Richard Hung.
 *
 * License
 * Bare Bones Slider by Richard Hung is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc/3.0/deed.en_US
 */

(function($) {
	
	var methods = {
		init : function(settings) {

			// Set default parameters
			var defaultSettings = {
				page:        1,                   // Page to start on
				duration:    1000,                // Duration of transition
				controls:    false,               // Display next / prev controls
				pager:       false,               // Create clickable pagination links
				pagerWrap:   '.pager-wrap',       // Container for pagination (Created externally)
				paneInfo:    false,               // Display current page information
				infoWrap:    '.info-wrap',        // Container for page information (Created externally)
				onDemand:    false,               // Create placeholder image and load on-demand
				placeholder: '/images/blank.gif', // Location of placeholder image
				auto:        false,               // Pages play automatically
				timer:       5000,                // Amount of time for autoplay
				loop:        false,               // Loop back to the beginning
				transition:  'fade',              // Transition for page turning
				callback:    null,                // Callback function after each new page.
				easing:      'swing',             // Easing transition
				autoHeight:  true,                // Automatically set height 
				pauseOnHit:  true,                // Pause autoplay when controls or pagers used 
				loopTrans:   true                 // Use backward and forward transition for loop
			}; // End options
			
			// Override default options
			var settings = $.extend({}, defaultSettings, settings);
			
			return this.each(function(){
				
				// Create variables
				var wrapper = $(this);
				var panel   = $(wrapper).children();
				var pIndex  = settings.page - 1; // New index
				var cIndex  = settings.page - 1; // Current index (for animating out the current panel)
				var pCount  = $(panel).length; // number of pages
				
				// Bind variables to object
				$(wrapper).data({
					autoPlay:   false,
					pIndex:     pIndex,
					cIndex:     cIndex,
					pCount:     pCount,
					transition: settings.transition,
					easing:     settings.easing,
					duration:   settings.duration,
					onDemand:   settings.onDemand,
					infoWrap:   settings.infoWrap,
					paneInfo:   settings.paneInfo,
					callback:   settings.callback,
					loop:       settings.loop,
					timer:      settings.timer,
					loopTrans:  settings.loopTrans,
					pauseOnHit: settings.pauseOnHit
				});
				
				// Apply basic CSS
				$(wrapper).addClass('bbslider-wrapper');
				$(panel).addClass('panel');
				
				// Create autoheight 
				if (settings.autoHeight == true) {
					// Get max panel height and width
					var h = Math.max.apply(Math, $(panel).map(function() { return $(this).height(true); }));
					$(wrapper).height(h);
				}// End autoheight
				
				// Create placeholder 
				if (settings.onDemand == true) {
					$(wrapper).bbslider('placeholder',settings.placeholder);
				}// End placeholder
				
				
				// Only show one image
				if (settings.onDemand == true) {
					$(panel).eq(pIndex).bbslider('loadImg');
				} // End onDemand check
			
				// Create page numbers info function
				if (settings.paneInfo == true) {
					$(wrapper).bbslider('infoParse');
				};// End infoParse
				
				// Hide panels and show first panel
				var transition = settings.transition;
				switch (transition) {
					case 'fade':
						$(panel).css({ opacity: 0 }).eq(pIndex).css({ opacity: 1 });
						break;
					case 'slide':
						$(panel).hide().eq(pIndex).show();
						break;
					case 'blind':
						// Hide panels and show opening panel
						$(panel).wrapInner('<div class="panel-inner" />');
						var pWrap = $(wrapper).find('.panel-inner');
						$(panel).css({
							overflow:'hidden',
							position:'absolute',
							height:'100%',
							width:0
						}).eq(pIndex).css({
							width:'100%'
						});
						$(pWrap).css({
							top:0,
							bottom:0,
							left:0,
							right:0
						});
						break;
					case 'none':
					default:
						$(panel).hide().eq(pIndex).show();
				} // End transition switch
	
				// Create pager if true
				if (settings.pager == true) {
					$(this).bbslider('pager',settings.pagerWrap);			
				} // End pager check
				
				// create prev/next controls if true
				if (settings.controls == true) {
					var x = $(wrapper).bbslider('controls');
					var next = x.next;
					var prev = x.prev;

					$(next).click(function(e) {
						$(wrapper).bbslider('next');
						e.preventDefault();
				
						if (settings.pauseOnHit == true) {
							$(wrapper).bbslider('pause');
						}
					});// End next click
					
					$(prev).click(function(e) {
						$(wrapper).bbslider('prev');
						e.preventDefault();
				
						if (settings.pauseOnHit == true) {
							$(wrapper).bbslider('pause');
						}
					});// End prev click
					
				}// End controls check
				
				
				// auto play
				if (settings.auto == true) {
					$(wrapper).bbslider('play');
				}// End autoplay
			
			}); // End object loop
	
		}, // End init
		destroy : function() {
			return this.each(function(){
				
				var wrapper = $(this);
				var panel   = $(this).children('.panel');
				
				// Remove CSS
				$(wrapper).removeClass('bbslider-wrapper');
				$(panel).removeClass('panel');
				
				// remove autoheight 
				$(wrapper).css('height','');
				
				// Show all images 
				if ($(wrapper).data('onDemand') == true) {
					$(panel).bbslider('loadImg');
				} // End onDemand check
			
				// Remove page numbers info function
				if ($(wrapper).data('paneInfo') == true) {
					var infoWrap = $(wrapper).data('infoWrap');
					$(infoWrap).empty();
				};// End infoParse
				
				// Hide panels and show first panel
				var transition = $(wrapper).data('transition');
				switch (transition) {
					case 'fade':
						$(panel).css({ opacity: '' });
						break;
					case 'slide':
						$(panel).show();
						break;
					case 'blind':
						// Hide panels and show opening panel
						$(panel).css({
							overflow:'',
							position:'',
							height:'',
							width:''
						});
						var pWrap = $(wrapper).find('.panel-inner');
						$(pWrap).contents().unwrap();
						break;
					case 'none':
					default:
						$(panel).show();
				} // End transition switch
	
				// Remove pager
				$('#'+wid+'-pager').remove();			
				
				// Remove controls 
				$(wrapper).children('.prev-control-wrapper').remove();
				$(wrapper).children('.next-control-wrapper').remove();
				
				// auto play
				var autoPlay = $(wrapper).data('autoPlay');
				if (autoPlay == true) {
					$(wrapper).bbslider('pause');
				}// End autoplay
				
				// Remove data
				$(wrapper).removeData();
			})
		}, // End destroy
		play : function() { 
			var wrapper  = $(this);
			var autoPlay = $(wrapper).data('autoPlay');
			
			// check if slider is already playing
			if (autoPlay == false) {
				var timer = $(wrapper).data('timer');
				
				var tid = setInterval(function() {
					$(wrapper).bbslider('next');
				}, timer); // End setinterval
				
				$(wrapper).data('tid',tid);
				$(wrapper).data('autoPlay',true);
			}
 	    }, // End play
		pause : function() { 
			var tid      = $(this).data('tid');
			var autoPlay = $(this).data('autoPlay');
			if (autoPlay == true) {
				clearInterval(tid);
				$(wrapper).data('autoPlay',false);
			}
 	    }, // End pause
		placeholder : function(placeholder) { 
			var images = $(this).find('img');
			$(images).each(function() {
				//Write the original source to a temporary location
				$(this).attr('data-placeholder', $(this).attr('src'));
				//Change the image source to the loading image
				$(this).attr('src', placeholder);
			});
 	    }, // End placeholder
 	    loadImg : function() { 
			var images = $(this).find('img');
			// loop through images in panel
			$(images).each(function() {
				//alert('image found');
				$(this).attr('src', $(this).attr('data-placeholder')).removeAttr('data-placeholder');
			});
				
		}, // End load image
 	    infoParse : function() { 
			var pCount   = $(this).data('pCount');
			var pIndex   = $(this).data('pIndex');
			var infoWrap = $(this).data('infoWrap');
			var page     = pIndex + 1;
			
			$(infoWrap).text(page + ' of ' + pCount);
		}, // End infoParse
		pager : function(pagerWrap) {
			var pCount    = $(this).data('pCount');
			// var pagerList = $(pagerWrap).children('.page-list');
			var panel     = $(this).find('.panel');
			var wid       = $(this).attr('id');
			
			var pagerList = $('<ul class="page-list" id="'+wid+'-pager" />').appendTo(pagerWrap);
			
			for (pageNum = 1; pageNum <= pCount; pageNum++) {
				// Check whether to give a title to pager
				if ($(panel).eq(pageNum - 1).attr('title')) { // Title attribute not empty
					var title = $(panel).eq(pageNum - 1).attr('title');
				} else {
					var title = pageNum;
				}// End title check
				$('<li><a href="#' + pageNum + '" data-link="' + wid + '" class="bb-pager-link">' + title + '</a></li>' ).appendTo(pagerList);
			}// End for loop
			
			$(pagerList).find('a').bbslider('bindpager');
			
			$(this).bbslider('pagerUpdate');
			
		}, // End pager
		pagerUpdate : function() {
			var wid    = $(this).attr('id');
			var pIndex = $(this).data('pIndex');
			
			$('#'+wid+'-pager').children().removeClass('activePanel').eq(pIndex).addClass('activePanel');
			
		}, // End pagerUpdate
		bindpager : function() {
			$(this).bind('click',function(e) {

				// Remove # from href and get index
				// pagerIndex = parseInt($(this).attr('href').replace('#','')) - 1;
				var pagerIndex = parseInt($(this).attr('href').substring(1)) - 1;
				
				var wid        = $(this).attr('data-link');
				var wrapper    = $('#'+wid);
				var pIndex     = $(wrapper).data('pIndex');
				var pauseOnHit = $(wrapper).data('pauseOnHit');
				
				if (pagerIndex > pIndex) { // New page is after current page, show next animation
					
					$(wrapper).data('cIndex',pIndex);
					var pIndex = pagerIndex;
					$(wrapper).data('pIndex',pIndex);
					
					$(wrapper).bbslider('forPage',pIndex);
				} else if (pagerIndex < pIndex) { // New page is before current page, show previous animation
					
					$(wrapper).data('cIndex',pIndex);
					var pIndex = pagerIndex;
					$(wrapper).data('pIndex',pIndex);
					
					$(wrapper).bbslider('backPage',pIndex);

				}// End pager check
				
				if (pauseOnHit == true) {
					$(wrapper).bbslider('pause');
				}
				
				e.preventDefault();
			});
		}, // End bindpager
		controls : function() {
			var pIndex  = $(this).data('pIndex');
			var pCount  = $(this).data('pCount');
			var loop    = $(this).data('loop');
			
			// Create variables for wrapper
			var prev = $('<a class="prev controls" href="#">Prev</a>').prependTo(this);
			var next = $('<a class="next controls" href="#">Next</a>').prependTo(this);
			$(prev).wrap('<div class="prev-control-wrapper"></div>');
			$(next).wrap('<div class="next-control-wrapper"></div>');
			var prevWrap = $(this).children('.prev-control-wrapper');
			var nextWrap = $(this).children('.next-control-wrapper');
			
			// Check if on first page
			if (pIndex == 0 && loop == false) {
				// hide previous button
				$(prevWrap).css('display','none');
			}
			// check if on last page
			if (pCount <= pIndex + 1 && loop == false) {
				// hide next button

				$(nextWrap).css('display','none');
			}
			
			var x = {};
			x.next = $(next);

			x.prev = $(prev);
			return x;
			
		}, // End controls 
		prev : function() {
			var loop      = $(this).data('loop');
			var pCount    = $(this).data('pCount');
			var pIndex    = $(this).data('pIndex');
			var loopTrans = $(this).data('loopTrans');
			var cIndex    = pIndex;				
			$(this).data('cIndex',cIndex);
			
			if (pIndex > 0) { // It is not the first panel, move backward
				pIndex = cIndex - 1;
				
				$(this).data('pIndex',pIndex);
				
				$(this).bbslider('backPage',pIndex);
			} else if (loop == true) { // It is first panel, loop to end
				pIndex = pCount - 1;
				
				$(this).data('pIndex',pIndex);
				
				if (loopTrans == true) {
					// use backward animation
					$(this).bbslider('backPage',pIndex);
				} else {
					// use forward animation
					$(this).bbslider('forPage',pIndex);
				}
			}
			
		}, // End prev 
		next : function() {
			var loop      = $(this).data('loop');
			var pCount    = $(this).data('pCount');
			var pIndex    = $(this).data('pIndex');
			var loopTrans = $(this).data('loopTrans');
			var cIndex    = pIndex;
			$(this).data('cIndex',cIndex);
			
			if (pCount > pIndex + 1) { // It is not the last panel, move forward
				pIndex = cIndex + 1;
				
				$(this).data('pIndex',pIndex);
				
				$(this).bbslider('forPage',pIndex);
				
			} else if (loop == true) { // It is last panel, loop to beginning
				var pIndex = 0;
				
				$(this).data('pIndex',pIndex);
				
				if (loopTrans == true) {
					// use forward animation
					$(this).bbslider('forPage',pIndex);
				} else {
					// use backward animation
					$(this).bbslider('backPage',pIndex);
				}
			}
		}, // End next 
		travel : function() {
			
			// Remove # from href and get index
			// pagerIndex = parseInt($(this).attr('href').replace('#','')) - 1;
			var pIndex = $(this).data('pIndex');
			var pagerIndex = parseInt($(this).attr('href').substring(1)) - 1;
			if (pagerIndex > pIndex) { // New page is after current page, show next animation
				var cIndex = pIndex;
				var pIndex = pagerIndex;
				
				$(this).data('pIndex',pIndex);
				$(this).data('cIndex',cIndex);
				
				$(this).bbslider('forPage',pIndex);
			} else if (pagerIndex < pIndex) { // New page is before current page, show previous animation
				var cIndex = pIndex;
				var pIndex = pagerIndex;
				
				$(this).data('pIndex',pIndex);
				$(this).data('cIndex',cIndex);
				
				$(this).bbslider('backPage',pIndex);
			}// End pager check
			
		}, // End travel 
		backPage : function(pIndex) {
			var loop = $(this).data('loop');

			// Load new image
			if ($(this).data('onDemand') == true) {
				$(this).children('.panel').eq(pIndex).bbslider('loadImg');
			} // End onDemand check
			
			// Stop current animations
			$(this).children('.panel').stop(true,true);
			
			var transition = $(this).data('transition');
			switch (transition) {
				case 'fade':
					$(this).bbslider('fade');
					break;
				case 'slide':
					$(this).bbslider('slideBack');
					break;
				case 'blind':
					$(this).bbslider('blindBack');
					break;
				case 'none':
				default:
					$(this).bbslider('toggle');
			} // End transition switch
			
			// Check if on first page and hide control
			if (pIndex == 0 && loop == false) {
				$(this).find('.prev-control-wrapper').css('display','none');
			}//  End hide control check
			
			// Display the next control
			$(this).find('.next-control-wrapper').css('display','block');
			
			// Create page numbers info function
			if ($(this).data('paneInfo') == true) {
				$(this).bbslider('infoParse');
			};// End infoParse
			
			$(this).bbslider('pagerUpdate');
			
			var callback = $(this).data('callback');
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		}, // End back page 
		forPage : function(pIndex) {
			var pCount = $(this).data('pCount');
			var loop   = $(this).data('loop');
			
			// Load new image
			if ($(this).data('onDemand') == true) {
				$(this).children('.panel').eq(pIndex).bbslider('loadImg');
			} // End onDemand check
			
			// Stop current animations
			$(this).children('.panel').stop(true,true);
			
			var transition = $(this).data('transition');
			switch (transition) {
				case 'fade':
					$(this).bbslider('fade');
					break;
				case 'slide':
					$(this).bbslider('slideFor');
					break;
				case 'blind':
					$(this).bbslider('blindFor');
					break;
				case 'none':
				default:
					$(this).bbslider('toggle');
			} // End transition switch

			// Check if on last page and hide control
			if (pCount <= pIndex + 1 && loop == false) {
				$(this).find('.next-control-wrapper').css('display','none');
			}//  End prev control check
			
			// Display the prev control
			$(this).find('.prev-control-wrapper').css('display','block');
			
			// Create page numbers info function
			if ($(this).data('paneInfo') == true) {
				$(this).bbslider('infoParse');
			};// End infoParse
			
			$(this).bbslider('pagerUpdate');
			
			// Allow callback function
			var callback = $(this).data('callback');
			if ($.isFunction(callback)) {
				callback.call(this);
			}
					
		}, // End forward page 
		toggle : function() {
			var pIndex = $(this).data('pIndex');
			var cIndex = $(this).data('cIndex');
			var panel  = $(this).children('.panel');
			
			// Remove current page
			$(panel).eq(cIndex).hide();
						
			// display new page
			$(panel).eq(pIndex).show();
					
		}, // End toggle
		fade : function() {
			var panel    = $(this).children('.panel');
			var cIndex   = $(this).data('cIndex');
			var pIndex   = $(this).data('pIndex');
			var easing   = $(this).data('easing');
			var duration = $(this).data('duration');

			// Remove current page		
			$(panel).eq(cIndex).animate(
				{
					opacity: 0
				}, duration, easing
			); // End animation
			
			// display the page
			$(panel).eq(pIndex).animate(
				{
					opacity: 1
				}, duration, easing
			); // End animation
		}, // End fade
		blindFor : function() {
			var panel    = $(this).children('.panel');
			var pWrap    = $(this).find('.panel-inner');
			var cIndex   = $(this).data('cIndex');
			var pIndex   = $(this).data('pIndex');
			var easing   = $(this).data('easing');
			var duration = $(this).data('duration');
			var width    = $(this).width();
			
			// Remove all animation queues
			$(pWrap).stop(true,true);
			$(panel).stop(true,true);
			// Remove current page
			$(panel).eq(cIndex).css({
				left:0,
				right:''
			}).animate(
				{
					width: 0
				}, duration, easing
			); // End animation
			
			// display the page
			$(panel).eq(pIndex).css({
				marginLeft:'',
				left:'',
				right:0
			}).animate(
				{
					width:'100%'
				}, duration, easing
			); // End animation
			$(pWrap).eq(pIndex).css({
				marginLeft:-(width)
			}).animate(
				{
					marginLeft:0
				}, duration, easing
			); // End animation
			
		}, // End blindFor
		blindBack : function() {
			var panel    = $(this).children('.panel');
			var pWrap    = $(this).find('.panel-inner');
			var cIndex   = $(this).data('cIndex');
			var pIndex   = $(this).data('pIndex');
			var easing   = $(this).data('easing');
			var duration = $(this).data('duration');
			var width    = $(this).width();
			
			// Remove all animation queues
			$(pWrap).stop(true,true);
			$(panel).stop(true,true);
			
			// Remove current page
			$(panel).eq(cIndex).css({
				left:'',
				right:0
			}).animate(
				{
					width:0
				}, duration, easing
			); // End animation
			$(pWrap).eq(cIndex).css({
				marginLeft:''
			}).animate(
				{
					marginLeft:-(width)
				}, duration, easing
			); // End animation
			
			// display the page
			$(panel).eq(pIndex).css({
				left:0,
				right:''
			}).animate(
				{
					width:'100%'
				}, duration, easing
			); // End animation
			$(pWrap).eq(pIndex).css({
				marginLeft:''
			}); // End animation
		}, // End blindBack
		slideFor : function() {
			var panel    = $(this).children('.panel');
			var cIndex   = $(this).data('cIndex');
			var pIndex   = $(this).data('pIndex');
			var easing   = $(this).data('easing');
			var duration = $(this).data('duration');
			var width    = $(this).width();
			
			// Remove current page
			$(panel).eq(cIndex).animate(
				{
					left: -(width)
				}, duration, easing
			); // End animation
			
			// display new page
			$(panel).eq(pIndex).show().css({
				left: '',
				right:-(width)
			}).animate(
				{
					right: 0
				}, duration, easing
			); // End animation
			
		}, // End slideFor
		slideBack : function() {
			var panel    = $(this).children('.panel');
			var cIndex   = $(this).data('cIndex');
			var pIndex   = $(this).data('pIndex');
			var easing   = $(this).data('easing');
			var duration = $(this).data('duration');
			var width    = $(this).width();
			
			// Remove current page
			$(panel).eq(cIndex).animate(
				{
					left: width
				}, duration, easing
			); // End animation
			
			// display the page
			$(panel).eq(pIndex).show().css({
				right: '',
				left:-(width)
			}).animate(
				{
					left: 0
				}, duration, easing
			); // End animation
					
		} // End slideBack
	}; // End method
    
	
	$.fn.bbslider = function(method) {
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.bbslider' );
		}		
		
	}; // End slider
	
	$('.bb-pager-link').bbslider('bindpager'); 
	
})(jQuery); 

