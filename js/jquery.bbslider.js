/**
 * Bare Bones Slider
 * http://www.bbslider.com/
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.1.7
 * 
 * Copyright (c) 2014 Richard Hung.
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
				pageInfo:    false,               // Display current panel information
				infoWrap:    '.info-wrap',        // Container for page information (Created externally)
				onDemand:    false,               // Create placeholder image and load on-demand
				placeholder: '/images/blank.gif', // Location of placeholder image
				auto:        false,               // Pages play automatically
				timer:       5000,                // Amount of time for autoplay
				loop:        true,                // Loop back to the beginning
				transition:  'fade',              // Fade, slide, slideVert or none
				callback:    null,                // Callback function after each new page.
				easing:      'swing',             // Easing transition
				autoHeight:  true,                // Automatically set height 
				pauseOnHit:  true,                // Pause autoplay when controls or pagers used 
				randomPlay:  false,               // Autoplay goes to random slides
				loopTrans:   true,                // Use backward and forward transition for loop
				touch:       false,               // Allow touchscreen controls
				touchoffset: 50                   // Amount of pixels to swipe for touch controls
			}; // End options
			
			// Override default options
			var settings = $.extend({}, defaultSettings, settings);
			
			return this.each(function(){
				
				// Create variables
				var wrapper = $(this);
				var panel   = wrapper.children();
				var pIndex  = settings.page - 1; // New index
				var cIndex  = settings.page - 1; // Current index (for animating out the current panel)
				var pCount  = panel.length; // number of pages
				
				// Bind variables to object
				wrapper.data({
					autoPlay:    false,
					pIndex:      pIndex,
					cIndex:      cIndex,
					pCount:      pCount,
					transition:  settings.transition,
					easing:      settings.easing,
					duration:    settings.duration,
					onDemand:    settings.onDemand,
					infoWrap:    settings.infoWrap,
					pageInfo:    settings.pageInfo,
					callback:    settings.callback,
					loop:        settings.loop,
					timer:       settings.timer,
					loopTrans:   settings.loopTrans,
					pauseOnHit:  settings.pauseOnHit,
					randomPlay:  settings.randomPlay,
					placeholder: settings.placeholder,
					pager:       settings.pager,
					pagerWrap:   settings.pagerWrap,
					autoHeight:  settings.autoHeight
				});
				
				// Apply basic CSS
				wrapper.addClass('bbslider-wrapper');
				panel.addClass('panel');
				
				// image load on demand
				if (settings.onDemand == true) {
					// Create placeholder 
					wrapper.bbslider('placeholder');
					
					// Only show one image
					panel.eq(pIndex).bbslider('loadImg');
				} // End onDemand check
			
				// Create page numbers info function
				if (settings.pageInfo == true) {
					wrapper.bbslider('infoParse');
				};// End infoParse
				
	
				// Create pager if true
				if (settings.pager == true) {
					wrapper.bbslider('pager',settings.pagerWrap);			
				} // End pager check
				
				// create prev/next controls if true
				if (settings.controls == true) {
					var x = wrapper.bbslider('controls');
					var next = x.next;
					var prev = x.prev;

					next.click(function(e) {
						wrapper.bbslider('next');
						e.preventDefault();
				
						if (settings.pauseOnHit == true) {
							wrapper.bbslider('pause');
						}
					});// End next click
					
					prev.click(function(e) {
						wrapper.bbslider('prev');
						e.preventDefault();
				
						if (settings.pauseOnHit == true) {
							wrapper.bbslider('pause');
						}
					});// End prev click
					
				}// End controls check
				
				// Touch controls
				if (settings.touch == true) {
					
					var getX;
					var getN;
					var offset;
					
					wrapper.bind('touchstart',function(e) {
						e.preventDefault();
						var touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						
						getX = touch.pageX;
						// console.log(touch.pageY+' '+touch.pageX);
						// alert('Touch on: '+touch.pageY+' '+touch.pageX);
					}); // end touchstart
					/*
					wrapper.bind('touchmove',function(e) {
						e.preventDefault();
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						// console.log(touch.pageY+' '+touch.pageX);
						alert('Touch move: '+touch.pageY+' '+touch.pageX);
					}); // end touchmove
					*/
					wrapper.bind('touchend',function(e) {
						e.preventDefault();
						var touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						
						getN   = touch.pageX;
						offset = settings.touchoffset;

						if (getN > getX + offset) {
							wrapper.bbslider('prev');
						} else if (getN < getX - offset) {
							wrapper.bbslider('next');
						}
						// alert('Touch off: '+touch.pageY+' '+touch.pageX);
						// console.log(touch.pageY+' '+touch.pageX);
					}); // end touchend
				}// End touch
				
				// auto play
				if (settings.auto == true) {
					wrapper.bbslider('play');
				} // End autoplay
			
				// Setup the slider
				wrapper.bbslider('setup');
				
				// Create autoheight 
				if (settings.autoHeight == true) {
					// Get max panel height and width
					var hi = 0;
					panel.each(function(){
						var h = $(this).outerHeight(true);
						if(h > hi){
							hi = h;
						}    
					});

					wrapper.height(hi);
				}// End autoheight
				
			}); // End object loop
	
		}, // End init
		update : function() {
			return this.each(function(){
				
				// Create variables
				var wrapper    = $(this);
				var panel      = wrapper.children(':not(.control-wrapper)');
				var pCount     = panel.length; // number of pages
				var onDemand   = wrapper.data('onDemand'); 
				var pageInfo   = wrapper.data('pageInfo'); 
				var pager      = wrapper.data('pager');
				var autoHeight = wrapper.data('autoHeight');
				var pIndex     = wrapper.data('pIndex');
				
				// Set data
				wrapper.data('pCount',pCount);
				
				// Apply basic CSS
				panel.addClass('panel');
				
				// on-demand image loading
				if (onDemand == true) {
					// Create placeholder 
					wrapper.bbslider('placeholder');
				
					// Only show one image
					panel.eq(pIndex).bbslider('loadImg');
				} // End onDemand check
				
				// Create page numbers info function
				if (pageInfo == true) {
					wrapper.bbslider('infoParse');
				};// End infoParse
				
				// Create pager if true
				if (pager == true) {
					wrapper.bbslider('pager');			
				} // End pager check
			
				// Setup the slider
				wrapper.bbslider('setup');
				
				// Create autoheight 
				if (autoHeight == true) {
					// Get max panel height and width
					var hi = 0;
					panel.each(function(){
						var h = $(this).outerHeight(true);
						if(h > hi){
							hi = h;
						}    
					});
					wrapper.height(hi);
				} // End autoheight
				
			}); // End object loop
		}, // End update
		destroy : function() {
			return this.each(function(){
				
				var wrapper = $(this);
				var panel   = wrapper.children('.panel');
				
				// Remove CSS
				wrapper.removeClass('bbslider-wrapper');
				panel.removeClass('panel active slide fade blind none slideVert');
				
				// remove autoheight 
				wrapper.css('height','');
				
				// Show all images 
				if (wrapper.data('onDemand') == true) {
					panel.bbslider('loadImg');
				} // End onDemand check
			
				// Remove page numbers info function
				if (wrapper.data('pageInfo') == true) {
					var infoWrap = wrapper.data('infoWrap');
					infoWrap.empty();
				};// End infoParse
				
				// Hide panels and show first panel
				var transition = wrapper.data('transition');
				switch (transition) {
					case 'fade':
						panel.removeClass('fade');
						break;
					case 'slide':
						panel.removeClass('slide');
						break;
					case 'slideVert':
						panel.removeClass('slideVert');
						break;
					case 'blind':
						// Hide panels and show opening panel
						panel.removeClass('blind');
						wrapper.find('.panel-inner').contents().unwrap();
						break;
					case 'none':
					default:
						panel.removeClass('none');
				} // End transition switch
				
				// Remove pager
				$('#'+wid+'-pager').remove();			
				
				// Remove controls 
				wrapper.children('.prev-control-wrapper').remove();
				wrapper.children('.next-control-wrapper').remove();
				
				// auto play
				var autoPlay = wrapper.data('autoPlay');
				if (autoPlay == true) {
					wrapper.bbslider('pause');
				}// End autoplay
				
				// Remove data
				wrapper.removeData();
			});
		}, // End destroy
		play : function() { 
			return this.each(function() {
				var wrapper    = $(this);
				var autoPlay   = wrapper.data('autoPlay');
				var randomPlay = wrapper.data('randomPlay');
				
				// check if slider is already playing
				if (autoPlay == false) {
					var duration = wrapper.data('duration');
					var timer    = wrapper.data('timer');
					
					var tid = setInterval(function() {
						// Check for random play
						if (randomPlay == true) {
							wrapper.bbslider('randomSlide');
						} else {
							wrapper.bbslider('next');
						}
					}, timer + duration); // End setinterval
					
					wrapper.data('tid',tid);
					wrapper.data('autoPlay',true);
				}
			});
 	    }, // End play
		pause : function() { 
			return this.each(function() {
				var wrapper  = $(this);
				var tid      = wrapper.data('tid');
				var autoPlay = wrapper.data('autoPlay');
				if (autoPlay == true) {
					clearInterval(tid);
					wrapper.data('autoPlay',false);
				}
			});
 	    }, // End pause
		randomSlide : function() {
			return this.each(function() {
				var wrapper   = $(this);
				var pCount    = wrapper.data('pCount');
				var loopTrans = wrapper.data('loopTrans');
				var pIndex    = wrapper.data('pIndex');
				
				var x = Math.round(1 + Math.floor(Math.random() * pCount));
				var y = x - 1;
				
				// Check if to keep using forward animation
				if (loopTrans == true) {
					wrapper.data('cIndex',pIndex);
					wrapper.data('pIndex',y);
					
					wrapper.bbslider('forPage',y);
				} else {
					wrapper.bbslider('travel',y);
				}
			});
		}, // End randomSlide
		setup : function() {
			// Hide panels and show first panel
			var wrapper    = this;
			var panel      = wrapper.children('.panel');
			var pIndex     = wrapper.data('pIndex');
			var transition = wrapper.data('transition');
			
			switch (transition) {
				case 'fade':
					panel.addClass('fade').eq(pIndex).fadeIn();
					break;
				case 'slide':
					panel.addClass('slide').eq(pIndex).show();
					break;
				case 'slideVert':
					panel.addClass('slideVert').eq(pIndex).show();
					break;
				case 'blind':
					// Hide panels and show opening panel
					var width  = wrapper.width();

					panel.children('.panel-inner').contents().unwrap();
					panel.wrapInner('<div class="panel-inner" />');
					panel.addClass('blind').eq(pIndex).css({
						width:'100%'
					});
					panel.children('.panel-inner').width(width);
					
					var hi = 0;
					panel.children('.panel-inner').each(function(){
						var h = $(this).wrapInner('<div>').children().outerHeight(true);
						if(h > hi){
							hi = h;
						}
						$(this).children().contents().unwrap();
					});
					panel.height(hi);
					panel.children('.panel-inner').height(hi);
					break;
				case 'none':
				default:
					panel.addClass('none').eq(pIndex).show();
			} // End transition switch
			
			// add active class to panel
			panel.eq(pIndex).addClass('active');
			
		}, // End setup
		placeholder : function() { 
			var placeholder = this.data('placeholder');
			var images      = this.children('.panel').find('img');
			$(images).each(function() {
				if(!$(this).attr('data-placeholder')) {
					//Write the original source to a temporary location
					$(this).attr('data-placeholder', $(this).attr('src'));
					//Change the image source to the loading image
					$(this).attr('src', placeholder);
				}
			});
 	    }, // End placeholder
 	    loadImg : function() {
			var images = this.find('img');
			// loop through images in panel
			$(images).each(function() {
				//alert('image found');
				$(this).attr('src', $(this).attr('data-placeholder')).removeAttr('data-placeholder');
			});
			
		}, // End load image
 	    infoParse : function() { 
			var wrapper  = this;
			var pCount   = wrapper.data('pCount');
			var pIndex   = wrapper.data('pIndex');
			var infoWrap = $(wrapper.data('infoWrap'));
			var page     = pIndex + 1;
			
			infoWrap.text(page + ' of ' + pCount);
		}, // End infoParse
		pager : function() {
			var wrapper   = this;
			var pCount    = wrapper.data('pCount');
			// var pagerList = pagerWrap.children('.page-list');
			var panel     = wrapper.find('.panel');
			var wid       = wrapper.attr('id');
			var pagerWrap = $(wrapper.data('pagerWrap'));
			
			// remove any previous pager-list
			pagerWrap.find('#'+wid+'-pager').remove();
			
			var pagerList = $('<ul class="page-list" id="'+wid+'-pager" />').appendTo(pagerWrap);
			
			for (pageNum = 1; pageNum <= pCount; pageNum++) {
				// Check whether to give a title to pager
				if (panel.eq(pageNum - 1).attr('title')) { // Title attribute not empty
					var title = panel.eq(pageNum - 1).attr('title');
				} else {
					var title = pageNum;
				}// End title check
				$('<li><a href="#' + pageNum + '" data-link="' + wid + '" class="bb-pager-link">' + title + '</a></li>' ).appendTo(pagerList);
			}// End for loop
			
			pagerList.find('a').bbslider('bindpager');
			
			wrapper.bbslider('pagerUpdate');
		}, // End pager
		pagerUpdate : function() {
			var wid    = this.attr('id');
			var pIndex = this.data('pIndex');
			
			$('#'+wid+'-pager').children().removeClass('activePanel').eq(pIndex).addClass('activePanel');
			
		}, // End pagerUpdate
		bindpager : function() {
				
			return this.on('click',function(e) {
				

				// Remove # from href and get index
				// pagerIndex = parseInt($(this).attr('href').replace('#','')) - 1;
				var href       = $(this).attr('href');
				var hash       = href.substring(href.indexOf('#'));
				var pagerIndex = parseInt(hash.substring(1)) - 1;
				// alert(hash.substring(1));
				
				var wid        = $(this).attr('data-link');
				var wrapper    = $('#'+wid);
				var pIndex     = wrapper.data('pIndex');
				var pauseOnHit = wrapper.data('pauseOnHit');
				
				if (pagerIndex > pIndex) { // New page is after current page, show next animation
					
					wrapper.data('cIndex',pIndex);
					var pIndex = pagerIndex;
					wrapper.data('pIndex',pIndex);
					
					wrapper.bbslider('forPage',pIndex);
				} else if (pagerIndex < pIndex) { // New page is before current page, show previous animation
					
					wrapper.data('cIndex',pIndex);
					var pIndex = pagerIndex;
					wrapper.data('pIndex',pIndex);
					
					wrapper.bbslider('backPage',pIndex);

				}// End pager check
				
				if (pauseOnHit == true) {
					wrapper.bbslider('pause');
				}
				
				e.preventDefault();
			}); // End bind
		}, // End bindpager
		controls : function() {
			var pIndex  = this.data('pIndex');
			var pCount  = this.data('pCount');
			var loop    = this.data('loop');
			
			// Create variables for wrapper
			var prev = $('<a class="prev control" href="#">Prev</a>').prependTo(this);
			var next = $('<a class="next control" href="#">Next</a>').prependTo(this);
			prev.wrap('<div class="prev-control-wrapper control-wrapper" />');
			next.wrap('<div class="next-control-wrapper control-wrapper" />');
			var prevWrap = this.children('.prev-control-wrapper');
			var nextWrap = this.children('.next-control-wrapper');
			
			// Check if on first page
			if (pIndex == 0 && loop == false) {
				// hide previous button
				prevWrap.css('display','none');
			}
			// check if on last page
			if (pCount <= pIndex + 1 && loop == false) {
				// hide next button

				nextWrap.css('display','none');
			}
			
			var x = {};
			x.next = next;

			x.prev = prev;
			return x;
			
		}, // End controls 
		prev : function() {
			return this.each(function() {
				var wrapper   = $(this);
				var loop      = wrapper.data('loop');
				var pCount    = wrapper.data('pCount');
				var pIndex    = wrapper.data('pIndex');
				var loopTrans = wrapper.data('loopTrans');
				var cIndex    = pIndex;
						
				wrapper.data('cIndex',cIndex);
				
				// reset autoplay timer
				if (wrapper.data('autoPlay')) {
					wrapper.bbslider('pause').bbslider('play');
				}

				// check if first / last
				if (pIndex > 0) { // It is not the first panel, move backward
					pIndex = cIndex - 1;
					
					wrapper.data('pIndex',pIndex);
					
					wrapper.bbslider('backPage',pIndex);
				} else if (loop == true) { // It is first panel, loop to end
					pIndex = pCount - 1;
					
					wrapper.data('pIndex',pIndex);
					
					if (loopTrans == true) {
						// use backward animation
						wrapper.bbslider('backPage',pIndex);
					} else {
						// use forward animation
						wrapper.bbslider('forPage',pIndex);
					}
				}
			
			});
		}, // End prev 
		next : function() {
			return this.each(function() {
				var wrapper   = $(this);
				var loop      = wrapper.data('loop');
				var pCount    = wrapper.data('pCount');
				var pIndex    = wrapper.data('pIndex');
				var loopTrans = wrapper.data('loopTrans');
				var cIndex    = pIndex;
				
				wrapper.data('cIndex',cIndex);
				
				// reset autoplay timer
				if (wrapper.data('autoPlay')) {
					wrapper.bbslider('pause').bbslider('play');
				}
				
				// check if first / last
				if (pCount > pIndex + 1) { // It is not the last panel, move forward
					pIndex = cIndex + 1;
					
					wrapper.data('pIndex',pIndex);
					
					wrapper.bbslider('forPage',pIndex);
					
				} else if (loop == true) { // It is last panel, loop to beginning
					var pIndex = 0;
					
					wrapper.data('pIndex',pIndex);
					
					if (loopTrans == true) {
						// use forward animation
						wrapper.bbslider('forPage',pIndex);
					} else {
						// use backward animation
						wrapper.bbslider('backPage',pIndex);
					}
				}
			});
		}, // End next 
		travel : function(xIndex) {
			return this.each(function() {
				var wrapper  = $(this);
				var pIndex   = wrapper.data('pIndex');
	
				// reset autoplay timer
				if (wrapper.data('autoPlay')) {
					wrapper.bbslider('pause').bbslider('play');
				}

				if (pIndex < xIndex) { // New page is after current page, show next animation
					var cIndex = pIndex;
					var pIndex = xIndex;
					
					wrapper.data('pIndex',pIndex);
					wrapper.data('cIndex',cIndex);
					
					wrapper.bbslider('forPage',pIndex);
				} else if (pIndex > xIndex) { // New page is before current page, show previous animation
					var cIndex = pIndex;
					var pIndex = xIndex;
					
					wrapper.data('pIndex',pIndex);
					wrapper.data('cIndex',cIndex);
					
					wrapper.bbslider('backPage',pIndex);
				}// End pager check
				
			});
		}, // End travel 
		backPage : function(pIndex) {
			return this.each(function() {
				var wrapper = $(this);
				var loop    = wrapper.data('loop');
				var pIndex  = wrapper.data('pIndex');
				var panel   = wrapper.children('.panel');
				
				// Add active class to panel
				panel.removeClass('active').eq(pIndex).addClass('active');
				
				// Load new image
				if (wrapper.data('onDemand') == true) {
					panel.eq(pIndex).bbslider('loadImg');
				} // End onDemand check
				
				// Stop current animations
				wrapper.children('.panel').stop(true,true);
				
				var transition = wrapper.data('transition');
				switch (transition) {
					case 'fade':
						wrapper.bbslider('fade');
						break;
					case 'slide':
						wrapper.bbslider('slideBack');
						break;
					case 'slideVert':
						wrapper.bbslider('slideVertBack');
						break;
					case 'blind':
						wrapper.bbslider('blindBack');
						break;
					case 'none':
					default:
						wrapper.bbslider('toggle');
				} // End transition switch
				
				// Check if on first page and hide control
				if (pIndex == 0 && loop == false) {
					wrapper.find('.prev-control-wrapper').css('display','none');
				}//  End hide control check
				
				// Display the next control
				wrapper.find('.next-control-wrapper').css('display','block');
				
				// Create page numbers info function
				if (wrapper.data('pageInfo') == true) {
					wrapper.bbslider('infoParse');
				};// End infoParse
				
				wrapper.bbslider('pagerUpdate');
				
				var callback = wrapper.data('callback');
				if ($.isFunction(callback)) {
					callback.call(this);
				}
				
			});
		}, // End back page 
		forPage : function(pIndex) {
			return this.each(function() {
				var wrapper = $(this);
				var pCount  = wrapper.data('pCount');
				var loop    = wrapper.data('loop');
				var pIndex  = wrapper.data('pIndex');
				var panel   = wrapper.children('.panel');
								
				// Add active class to panel
				panel.removeClass('active').eq(pIndex).addClass('active');
				
				// Load new image
				if (wrapper.data('onDemand') == true) {
					panel.eq(pIndex).bbslider('loadImg');
				} // End onDemand check
				
				// Stop current animations
				wrapper.children('.panel').stop(true,true);
				
				var transition = wrapper.data('transition');
				switch (transition) {
					case 'fade':
						wrapper.bbslider('fade');
						break;
					case 'slide':
						wrapper.bbslider('slideFor');
						break;
					case 'slideVert':
						wrapper.bbslider('slideVertFor');
						break;
					case 'blind':
						wrapper.bbslider('blindFor');
						break;
					case 'none':
					default:
						wrapper.bbslider('toggle');
				} // End transition switch
				
				// Check if on last page and hide control
				if (pCount <= pIndex + 1 && loop == false) {
					wrapper.find('.next-control-wrapper').css('display','none');
				} //  End prev control check
				
				// Display the prev control
				wrapper.find('.prev-control-wrapper').css('display','block');
				
				// Create page numbers info function
				if (wrapper.data('pageInfo') == true) {
					wrapper.bbslider('infoParse');
				};// End infoParse
				
				wrapper.bbslider('pagerUpdate');
				
				// Allow callback function
				var callback = wrapper.data('callback');
				if ($.isFunction(callback)) {
					callback.call(this);
				}
				
			});
		}, // End forward page 
		toggle : function() {
			var wrapper = this;
			var pIndex  = wrapper.data('pIndex');
			var cIndex  = wrapper.data('cIndex');
			var panel   = wrapper.children('.panel');
			
			// Remove current page
			panel.eq(cIndex).hide();
						
			// display new page
			panel.eq(pIndex).show();
					
		}, // End toggle
		fade : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			
			// Remove current page		
			panel.eq(cIndex).fadeOut(duration, easing);
			
			// display the page
			panel.eq(pIndex).fadeIn(duration, easing); 

		}, // End fade
		blindFor : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var pWrap    = wrapper.find('.panel-inner');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var width    = wrapper.width();
			
			// Remove all animation queues
			pWrap.stop(true,true);
			panel.stop(true,true);
			
			// Remove current page
			panel.eq(cIndex).css({
				left:0,
				right:''
			}).animate({
				width: 0
			}, duration, easing); // End animation
			
			// display the page
			panel.eq(pIndex).css({
				marginLeft:'',
				left:'',
				right:0
			}).animate({
				width:'100%'
			}, duration, easing); // End animation
			
			pWrap.eq(pIndex).css({
				marginLeft:-(width)
			}).animate({
				marginLeft:0
			}, duration, easing); // End animation
			
		}, // End blindFor
		blindBack : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var pWrap    = wrapper.find('.panel-inner');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var width    = wrapper.width();
			
			// Remove all animation queues
			pWrap.stop(true,true);
			panel.stop(true,true);
			
			// Remove current page
			panel.eq(cIndex).css({
				left:'',
				right:0
			}).animate({
				width:0
			}, duration, easing); // End animation
			pWrap.eq(cIndex).css({
				marginLeft:''
			}).animate({
				marginLeft:-(width)
			}, duration, easing); // End animation
			
			// display the page
			panel.eq(pIndex).css({
				left:0,
				right:''
			}).animate({
				width:'100%'
			}, duration, easing); // End animation
			
			pWrap.eq(pIndex).css({
				marginLeft:''
			}); // End animation
		}, // End blindBack
		slideFor : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var width    = wrapper.width();
			
			// Remove current page
			panel.eq(cIndex).animate({
				left: -(width)
			}, duration, easing); // End animation
			
			// display new page
			panel.eq(pIndex).show().css({
				left: '',
				right:-(width)
			}).animate({
				right: 0
			}, duration, easing); // End animation
			
		}, // End slideFor
		slideBack : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var width    = wrapper.width();
			
			// Remove current page
			panel.eq(cIndex).animate(
				{
					left: width
				}, duration, easing
			); // End animation
			
			// display the page
			panel.eq(pIndex).show().css({
				right: '',
				left:-(width)
			}).animate({
				left: 0
			}, duration, easing); // End animation
					
		}, // End slideBack
		slideVertFor : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var height   = wrapper.height();
			
			// Remove all animation queues
			panel.stop(true,true);
			// Remove current page
			panel.eq(cIndex).css({
				top:0
			}).animate({
				top: - height
			}, duration, easing, function() {
				$(this).hide();
			}); // End animation
			
			// display the page
			panel.eq(pIndex).show().css({
				top: height
			}).animate({
				top: 0
			}, duration, easing); // End animation
			
		}, // End slideVertFor
		slideVertBack : function() {
			var wrapper  = this;
			var panel    = wrapper.children('.panel');
			var pWrap    = wrapper.find('.panel-inner');
			var cIndex   = wrapper.data('cIndex');
			var pIndex   = wrapper.data('pIndex');
			var easing   = wrapper.data('easing');
			var duration = wrapper.data('duration');
			var height   = wrapper.height();
			
			// Remove all animation queues
			panel.stop(true,true);
			
			// Remove current page
			panel.eq(cIndex).css({
				top:0
			}).animate({
				top: height
			}, duration, easing, function() {
				$(this).hide();
			}); // End animation
			
			// display the page
			panel.eq(pIndex).show().css({
				top: - height
			}).animate({
				top: 0
			}, duration, easing); // End animation
			
		} // End slideVertVack
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

