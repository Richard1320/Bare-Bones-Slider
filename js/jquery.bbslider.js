/*!
 * Bare Bones Slider
 * http://www.bbslider.com/
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.3.3
 *
 * Copyright (c) 2016 Richard Hung.
 *
 * License
 * Bare Bones Slider by Richard Hung is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc/3.0/deed.en_US
 */


(function ($) {
  'use strict';

  // Create the plugin name and defaults once
  var pluginName = 'bbslider';

  var pageTextDefault = function (pageNum, wrapperID, title) {
    if (!title) {
      title = pageNum;
    }
    return $('<div class="bb-link-wrapper"><a href="#" class="bb-pager-link">' + title + '</a></div>');
  }; // end pager text default

  var methods = {
    init: function (settings) {

      // Set default parameters
      var defaultSettings = {
        start: 1, // Panel to start on
        duration: 1000, // Duration of transition
        controls: false, // Display next / prev controls
        controlsText: [ // HTML output for controls
          '<a class="prev control" href="#">Prev</a>',
          '<a class="next control" href="#">Next</a>'
        ],
        pager: false, // Create clickable pagination links
        pagerWrap: '.pager-wrap', // Container for pagination (Created externally)
        pagerText: pageTextDefault, // HTML output for pager
        auto: false, // Pages play automatically
        timer: 5000, // Amount of time for autoplay
        loop: true, // Loop back to the beginning
        transition: 'fade', // Fade, slide, slideVert, or none
        callbackStart: null, // Callback function when slider is setup
        callbackBefore: null, // Callback function before new slide transition
        callbackAfter: null, // Callback function after new slide complete
        callbackUpdate: null, // Callback function after update function
        easing: 'ease', // Easing transition
        autoHeight: true, // Automatically set height
        dynamicHeight: false, // Height of slider changes with current panel
        pauseOnHit: true, // Pause autoplay when controls or pagers used
        randomPlay: false, // Autoplay goes to random slides
        loopTrans: true, // Use backward and forward transition for loop
        touch: false, // Allow touchscreen controls
        touchoffset: 50, // Amount of pixels to swipe for touch controls
        dragControls: false, // Allow mouse click and drag controls
        dragoffset: 50, // Amount of pixels to swipe for drag controls
        carousel: false, // Number of items per slide
        carouselMove: 1, // Amount of slides to move per carousel prev / next
        maskImage: '/images/mask.png', // Image file for mask transition
        maskSteps: 23, // Number of steps in mask image
      }; // End options

      // Override default options
      settings = $.extend({}, defaultSettings, settings);

      return this.each(function () {

        // Create variables
        var wrapper = $(this);
        var panel = wrapper.children();
        var pIndex = settings.start - 1; // New index
        var cIndex = settings.start - 1; // Current index (for animating out the current panel)
        var pCount = panel.length; // number of pages

        // Bind variables to object
        wrapper.data({
          autoPlay: false,
          pIndex: pIndex,
          xIndex: pIndex,
          cIndex: cIndex,
          pCount: pCount,
          settings: settings
        });

        // Apply basic CSS
        wrapper.addClass('bbslider-wrapper');
        panel.addClass('panel');

        // auto controls hide
        if (settings.loop) {
          wrapper.addClass('loop-true');
        } else {
          wrapper.addClass('loop-false');
        }

        // Create pager if true
        if (settings.pager) {
          wrapper[pluginName]('pager');
        } // End pager check

        // create prev/next controls if true
        if (settings.controls) {
          var x = wrapper[pluginName]('controls');
          var next = x.next;
          var prev = x.prev;

          next.click(function (e) {
            wrapper[pluginName]('next');
            e.preventDefault();

            if (settings.pauseOnHit) {
              wrapper[pluginName]('autoPlayPause');
            }
          }); // End next click

          prev.click(function (e) {
            wrapper[pluginName]('prev');
            e.preventDefault();

            if (settings.pauseOnHit) {
              wrapper[pluginName]('autoPlayPause');
            }
          }); // End prev click

        } // End controls check

        // Touch controls
        if (settings.touch || settings.dragControls) {
          var onEvents = '';
          var offEvents = '';
          var getX;
          var getN;
          var offset;

          if (settings.touch) {
            onEvents = onEvents + 'touchstart ';
            offEvents = offEvents + 'touchend touchcancel ';
          }
          if (settings.dragControls) {
            onEvents = onEvents + 'mousedown ';
            offEvents = offEvents + 'mouseup ';
          }

          wrapper.on(onEvents, function (e) {
            // e.preventDefault();

            var touch = e;
            if (e.type != 'mousedown') {
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            }
            // console.log(e);

            getX = touch.pageX;
            // console.log(touch.pageY+' '+touch.pageX);
            // alert('Touch on: '+touch.pageY+' '+touch.pageX);
          }); // end touchstart
          /*
          wrapper.on('touchmove',function(e) {
          	e.preventDefault();
          	var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          	// console.log(touch.pageY+' '+touch.pageX);
          	alert('Touch move: '+touch.pageY+' '+touch.pageX);
          }); // end touchmove
          */
          wrapper.on(offEvents, function (e) {
            // e.preventDefault();

            var touch = e;
            offset = settings.dragoffset;
            if (e.type != 'mouseup') {
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
              offset = settings.touchoffset;
            }

            getN = touch.pageX;

            if (getN > getX + offset) {
              wrapper[pluginName]('prev');

              if (settings.pauseOnHit) {
                wrapper[pluginName]('autoPlayPause');
              }
            } else if (getN < getX - offset) {
              wrapper[pluginName]('next');

              if (settings.pauseOnHit) {
                wrapper[pluginName]('autoPlayPause');
              }
            }
            // alert('Touch off: '+touch.pageY+' '+touch.pageX);
            // console.log(touch.pageY+' '+touch.pageX);
          }); // end touchend
        } // End touch

        // auto play
        if (settings.auto) {
          wrapper.data('autoPlay', true);
          wrapper[pluginName]('autoPlayStart');
        } // End autoplay

        // Setup the slider
        wrapper[pluginName]('setup');

        // Create autoheight
        if (settings.autoHeight) {
          wrapper[pluginName]('recalcHeight');
        } // End autoheight


        // callback start function
        var callbackStart = settings.callbackStart;
        if ($.isFunction(callbackStart)) {
          callbackStart.call(this);
        }
      }); // End object loop


    }, // End init
    update: function () {
      return this.each(function () {

        // Create variables
        var wrapper = $(this);
        var panel = wrapper.children(':not(.control-wrapper)');
        var pCount = panel.length; // number of pages
        var settings = wrapper.data('settings');
        var pIndex = wrapper.data('pIndex');
        var pager = settings.pager;
        var autoHeight = settings.autoHeight;
        var callback = settings.callbackUpdate;


        // Set data
        wrapper.data('pCount', pCount);

        // Apply basic CSS
        panel.addClass('panel');

        // Create pager if true
        if (pager) {
          wrapper[pluginName]('pager');
        } // End pager check

        // Setup the slider
        wrapper[pluginName]('setup');

        // Create autoheight
        if (autoHeight) {
          wrapper[pluginName]('recalcHeight');
        } // End autoheight

        // callback update function
        if ($.isFunction(callback)) {
          callback.call(this);
        }
      }); // End object loop
    }, // End update
    destroy: function () {
      return this.each(function () {

        var wrapper = $(this);
        var panel = wrapper.children('.panel');
        var settings = wrapper.data('settings');
        var wrapperID = wrapper.attr('id');

        // Remove CSS
        wrapper.removeClass('bbslider-wrapper first-panel last-panel loop-true loop-false carousel ease linear ease-in ease-out ease-in-out easeInQuad easeInCubic easeInQuart easeInQuint easeInSine easeInExpo easeInCirc easeInBack easeOutQuad easeOutCubic easeOutQuart easeOutQuint easeOutSine easeOutExpo easeOutCirc easeOutBack easeInOutQuad easeInOutCubic easeInOutQuart easeInOutQuint easeInOutSine easeInOutExpo easeInOutCirc easeInOutBack');
        panel.removeClass('panel active slide fade blind none slideVert mask').removeAttr('style');

        // remove autoheight
        wrapper.css('height', '');

        // Remove blind inner panel
        if (settings.transition == 'blind') {
          wrapper.find('.panel-inner').contents().unwrap();
        }

        // Remove pager
        if (settings.pager) {
          $(settings.pagerWrap).empty();
        }

        // Remove controls
        wrapper.children('.prev-control-wrapper').remove();
        wrapper.children('.next-control-wrapper').remove();

        // auto play
        var autoPlay = wrapper.data('autoPlay');
        if (autoPlay) {
          wrapper[pluginName]('autoPlayPause');
        } // End autoplay

        // Remove data
        wrapper.removeData();
      });
    }, // End destroy
    recalcHeight: function () {
      return this.each(function () {
        var wrapper = $(this);
        var panel = wrapper.children('.panel');
        var settings = wrapper.data('settings');
        var pIndex = wrapper.data('pIndex');
        var pCount = wrapper.data('pCount');
        var autoHeight = settings.autoHeight;
        var dynamicHeight = settings.dynamicHeight;
        var carousel = settings.carousel;
        var hi = 0;
        var h = 0;
        var end;

        if (dynamicHeight && autoHeight) { // Update on dynamic height
          if (carousel) {
            end = pIndex + parseInt(carousel);
            // loop through and show multiple slides
            for (var i = pIndex; i < end; i++) {

              // Get all currently shown slides
              var x;
              if (i < pCount) {
                x = i;
              } else {
                // end is higher than number of slides
                // loop back to beginning
                x = i - pCount;

              }

              h = panel.eq(x).outerHeight(true);

              if (h > hi) {
                hi = h;
              }

            }

          } else {

            // Get current panel height
            hi = panel.eq(pIndex).outerHeight(true);
          }

        } else { // no dynamic height, use max panel height
          // Get max panel height and width
          panel.each(function () {
            h = $(this).outerHeight(true);
            if (h > hi) {
              hi = h;
            }
          });
        } // end dynamic height check

        wrapper.height(hi);
      });
    }, // end recalculate height
    autoPlayStart: function () {
      return this.each(function () {
        var wrapper = $(this);
        var settings = wrapper.data('settings');
        var autoPlay = wrapper.data('autoPlay');
        var randomPlay = settings.randomPlay;

        // check if slider is already playing
        if (autoPlay) {
          var duration = settings.duration;
          var timer = settings.timer;

          var tid = setInterval(function () {
            // Check for random play
            if (randomPlay) {
              wrapper[pluginName]('randomSlide');
            } else {
              wrapper[pluginName]('next');
            }
          }, timer + duration); // End setinterval

          wrapper.data('tid', tid);
        }
      });
    }, // End auto play start
    autoPlayPause: function () {
      return this.each(function () {
        var wrapper = $(this);
        var tid = wrapper.data('tid');
        var autoPlay = wrapper.data('autoPlay');
        if (autoPlay) {
          clearInterval(tid);
          wrapper.data('autoPlay', false);
        }
      });
    }, // End auto play pause
    autoPlayReset: function () {
      return this.each(function () {
        var wrapper = $(this);
        var tid = wrapper.data('tid');
        var autoPlay = wrapper.data('autoPlay');
        if (autoPlay) {
          clearInterval(tid);
          wrapper[pluginName]('autoPlayStart');
        }
      });
    }, // End auto play reset
    randomSlide: function () {
      return this.each(function () {
        var wrapper = $(this);
        var settings = wrapper.data('settings');
        var pCount = wrapper.data('pCount');
        var pIndex = wrapper.data('pIndex');
        var loopTrans = settings.loopTrans;

        var x = Math.round(1 + Math.floor(Math.random() * pCount));
        var y = x - 1;

        // Check if to keep using forward animation
        if (loopTrans) {
          wrapper.data('cIndex', pIndex);
          wrapper.data('pIndex', y);

          wrapper[pluginName]('forPage', y);
        } else {
          wrapper[pluginName]('travel', y);
        }
      });
    }, // End randomSlide
    setup: function () {
      // Hide panels and show first panel
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var pIndex = wrapper.data('pIndex');
      var pCount = wrapper.data('pCount');
      var transition = settings.transition;
      var duration = settings.duration;
      var carousel = settings.carousel;

      panel.addClass('init ' + transition);


      if (carousel) {

        wrapper.addClass('carousel ' + settings.easing);
        var itemWidth = 100 / parseInt(carousel);
        var end = pIndex + parseInt(carousel);
        var x = i;
        var left = 0;

        panel.css({
          width: itemWidth + '%',
          left: '100%'
        });

        // loop through and show multiple slides
        for (var i = pIndex; i < end; i++) {
          x = i;

          // end is higher than number of slides
          // loop back to beginning
          if (i >= pCount) {
            x = i - pCount;

          }

          panel.eq(x).css('left', left + '%');
          left = left + itemWidth;

          // Display initial items
          if (transition === 'fade') {
            panel.eq(x).css('opacity', 1);
          }
        } // end carousel item loop

      } else {
        wrapper.addClass(settings.easing);

        switch (transition) {
          case 'fade':
            panel.eq(pIndex).show().css('opacity', 1);
            break;
          case 'mask':

            var timingSteps = settings.maskSteps - 1;
            panel.eq(pIndex).show();

            wrapper.removeClass(settings.easing);

            panel.css({
              MaskImage: 'url("' + settings.maskImage + '")',
              webkitMaskImage: 'url("' + settings.maskImage + '")',
              MaskSize: settings.maskSteps * 100 + '% 100%',
              webkitMaskSize: settings.maskSteps * 100 + '% 100%',
              WebkitTransitionTimingFunction: 'steps(' + timingSteps + ')',
              MozTransitionTimingFunction: 'steps(' + timingSteps + ')',
              OTransitionTimingFunction: 'steps(' + timingSteps + ')',
              transitionTimingFunction: 'steps(' + timingSteps + ')',
            });
            break;
          case 'slide':
            panel.css('transform', 'translateX(100%)').eq(pIndex).css('transform', 'translateX(0%)');
            break;
          case 'slideVert':
            panel.css('transform', 'translateY(100%)').eq(pIndex).css('transform', 'translateY(0%)');
            break;
          case 'blind':
            // Hide panels and show opening panel
            var width = wrapper.width();

            panel.children('.panel-inner').contents().unwrap();
            panel.wrapInner('<div class="panel-inner" />');
            panel.addClass('blind init').eq(pIndex).css({
              width: '100%'
            });
            panel.children('.panel-inner').width(width);

            var hi = 0;
            panel.children('.panel-inner').each(function () {
              var h = $(this).wrapInner('<div>').children().outerHeight(true);
              if (h > hi) {
                hi = h;
              }
              $(this).children().contents().unwrap();
            });
            panel.height(hi);
            panel.children('.panel-inner').height(hi);
            break;
        } // End transition switch
      } // end carousel check

      // add active class to panel
      panel.eq(pIndex).addClass('active');

      panel.css({
        WebkitTransitionDuration: duration / 1000 + 's',
        MozTransitionDuration: duration / 1000 + 's',
        OTransitionDuration: duration / 1000 + 's',
        transitionDuration: duration / 1000 + 's',
      });
    }, // End setup
    pager: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var pCount = wrapper.data('pCount');
      var settings = wrapper.data('settings');
      // var wrapperID = wrapper.attr('id');
      var pagerWrap = $(settings.pagerWrap);
      var pagerText = settings.pagerText;

      // remove any previous pager-list
      pagerWrap.empty();

      for (var xIndex = 0; xIndex < pCount; xIndex++) {
        // Check whether to give a title to pager
        var title = panel.eq(xIndex).attr('title');
        var link = pagerText.call(this, xIndex + 1, false, title);

        link.appendTo(pagerWrap);

        link.find('a').data('xIndex', xIndex).on('click', function (e) {
          e.preventDefault();

          var settings = wrapper.data('settings');
          var pauseOnHit = settings.pauseOnHit;

          wrapper[pluginName]('travel', $(this).data('xIndex'));

          if (pauseOnHit) {
            wrapper[pluginName]('autoPlayPause');
          }

          e.preventDefault();

        });
      } // End for loop

      wrapper[pluginName]('pagerUpdate');
    }, // End pager
    pagerUpdate: function () {
      var settings = this.data('settings');
      var pIndex = this.data('pIndex');

      $(settings.pagerWrap).children().removeClass('activePanel').eq(pIndex).addClass('activePanel');

    }, // End pagerUpdate
    controls: function () {
      var settings = this.data('settings');
      var pIndex = this.data('pIndex');
      var pCount = this.data('pCount');
      var loop = settings.loop;

      // Create variables for wrapper
      var next = $(settings.controlsText[1]).prependTo(this);
      var prev = $(settings.controlsText[0]).prependTo(this);
      next.wrap('<div class="next-control-wrapper control-wrapper" />');
      prev.wrap('<div class="prev-control-wrapper control-wrapper" />');
      // var nextWrap = this.children('.next-control-wrapper');
      // var prevWrap = this.children('.prev-control-wrapper');

      // Check if on first page
      if (pIndex === 0) {
        this.addClass('first-panel');
      }
      // check if on last page
      if (pCount <= pIndex + 1) {
        this.addClass('last-panel');
      }

      var x = {};
      x.next = next;
      x.prev = prev;

      return x;

    }, // End controls
    prev: function () {
      return this.each(function () {
        var wrapper = $(this);
        var settings = wrapper.data('settings');
        var loop = settings.loop;
        var pCount = wrapper.data('pCount');
        var pIndex = wrapper.data('pIndex');
        var loopTrans = settings.loopTrans;
        var carousel = settings.carousel;
        var carouselMove = settings.carouselMove;
        var cIndex = pIndex;
        var before = settings.callbackBefore;
        var movement = false;

        // check if first / last
        if (carousel) {
          pIndex = cIndex - carouselMove;
          if (pIndex < 0) {
            pIndex = pIndex + pCount;
          }
          movement = 'carousel';
        } else if (pIndex > 0) { // It is not the first panel, move backward
          pIndex = cIndex - 1;
          movement = 'backward';
        } else if (loop) { // It is first panel, loop to end
          movement = 'end';
          pIndex = pCount - 1;
        }

        // Set xindex for before callback
        wrapper.data('xIndex', pIndex);

        if ($.isFunction(before) && before.call(this) === false) {
          return false;
        }

        wrapper.data('cIndex', cIndex);

        // reset autoplay timer
        if (wrapper.data('autoPlay')) {
          wrapper[pluginName]('autoPlayReset');
        }

        // Transition to new panel
        wrapper.data('pIndex', pIndex);
        if (movement == 'carousel' || movement == 'backward') {
          wrapper[pluginName]('backPage', pIndex);
        } else if (movement == 'end') { // It is first panel, loop to end
          if (loopTrans) {
            // use backward animation
            wrapper[pluginName]('backPage', pIndex);
          } else {
            // use forward animation
            wrapper[pluginName]('forPage', pIndex);
          }
        }

      });
    }, // End prev
    next: function () {
      return this.each(function () {
        var wrapper = $(this);
        var settings = wrapper.data('settings');
        var pCount = wrapper.data('pCount');
        var pIndex = wrapper.data('pIndex');
        var loop = settings.loop;
        var loopTrans = settings.loopTrans;
        var carousel = settings.carousel;
        var carouselMove = settings.carouselMove;
        var cIndex = pIndex;
        var before = settings.callbackBefore;
        var movement = false;

        // check if first / last
        if (carousel) {
          pIndex = cIndex + carouselMove;
          if (pCount < pIndex + carousel + 1) {
            pIndex = pIndex - pCount;
          }
          movement = 'carousel';
        } else if (pCount > pIndex + 1) { // It is not the last panel, move forward
          pIndex = cIndex + 1;
          movement = 'forward';
        } else if (loop) { // It is last panel, loop to beginning
          pIndex = 0;
          movement = 'first';
        }

        // Set xindex for before callback
        wrapper.data('xIndex', pIndex);

        if ($.isFunction(before) && before.call(this) === false) {
          return false;
        }

        wrapper.data('cIndex', cIndex);

        // reset autoplay timer
        if (wrapper.data('autoPlay')) {
          wrapper[pluginName]('autoPlayReset');
        }

        // Transition to new panel
        wrapper.data('pIndex', pIndex);
        if (movement == 'carousel' || movement == 'forward') {
          wrapper[pluginName]('forPage', pIndex);

        } else if (movement == 'first') { // It is last panel, loop to beginning

          if (loopTrans) {
            // use forward animation
            wrapper[pluginName]('forPage', pIndex);
          } else {
            // use backward animation
            wrapper[pluginName]('backPage', pIndex);
          }
        }
      });
    }, // End next
    travel: function (xIndex) {
      return this.each(function () {
        var wrapper = $(this);
        var settings = wrapper.data('settings');
        var pIndex = wrapper.data('pIndex');
        var pCount = wrapper.data('pCount');
        var carousel = settings.carousel;
        var before = settings.callbackBefore;
        var cIndex;

        // Set xindex for before callback
        wrapper.data('xIndex', xIndex);

        if ($.isFunction(before) && before.call(this) === false) {
          return false;
        }

        // reset autoplay timer
        if (wrapper.data('autoPlay')) {
          wrapper[pluginName]('autoPlayReset');
        }

        if (carousel) {
          cIndex = pIndex;
          pIndex = xIndex;

          wrapper.data('pIndex', pIndex);
          wrapper.data('cIndex', cIndex);

          // get the number of panels that we will have to move
          var low, high;
          if (pIndex > cIndex) {
            low = pIndex - pCount;
            high = pIndex;
          } else {
            low = pIndex;
            high = pIndex + pCount;
          }

          var array = [low, high];
          var goal = cIndex;
          var closest = null;

          // determine which direction is the shorter distance in the carousel
          $.each(array, function () {
            if (closest === null || Math.abs(this - goal) < Math.abs(closest - goal)) {
              closest = this;
            }
          });
          if (closest > goal) {
            wrapper[pluginName]('forPage', pIndex);
          } else {
            wrapper[pluginName]('backPage', pIndex);
          }

        } else if (pIndex < xIndex) { // New page is after current page, show next animation
          cIndex = pIndex;
          pIndex = xIndex;

          wrapper.data('pIndex', pIndex);
          wrapper.data('cIndex', cIndex);

          wrapper[pluginName]('forPage', pIndex);
        } else if (pIndex > xIndex) { // New page is before current page, show previous animation
          cIndex = pIndex;
          pIndex = xIndex;

          wrapper.data('pIndex', pIndex);
          wrapper.data('cIndex', cIndex);

          wrapper[pluginName]('backPage', pIndex);
        } // End carousel check


      }); // end each
    }, // End travel
    backPage: function () {
      return this.each(function () {
        var wrapper = $(this);
        var panel = wrapper.children('.panel');
        var settings = wrapper.data('settings');
        var pIndex = wrapper.data('pIndex');
        var loop = settings.loop;
        var transition = settings.transition;
        var carousel = settings.carousel;
        var autoHeight = settings.autoHeight;
        var dynamicHeight = settings.dynamicHeight;
        var duration = settings.duration;

        // Add active class to panel
        panel.removeClass('active').eq(pIndex).addClass('active');

        // Stop current animations
        wrapper.children('.panel').stop(true, true);

        if (carousel) {
          switch (transition) {
            case 'fade':
              wrapper[pluginName]('carFade');
              break;
            case 'slide':
              wrapper[pluginName]('carSlideBack');
              break;
            case 'none':
            default:
              wrapper[pluginName]('carToggle');
          } // End transition switch

        } else {
          switch (transition) {
            case 'fade':
              wrapper[pluginName]('fade');
              break;
            case 'mask':
              wrapper[pluginName]('mask');
              break;
            case 'slide':
              wrapper[pluginName]('slideBack');
              break;
            case 'slideVert':
              wrapper[pluginName]('slideVertBack');
              break;
            case 'blind':
              wrapper[pluginName]('blindBack');
              break;
              /*
              case 'none':
              default:
              	wrapper[pluginName]('toggle');
              */
          } // End transition switch
        } // end carousel check

        // Check if on first panel
        if (pIndex === 0) {
          wrapper.addClass('first-panel');
        } //  End hide control check

        // Remove last panel class since we're moving backwards
        wrapper.removeClass('last-panel');

        wrapper[pluginName]('pagerUpdate');

        // dynamically change height
        if (dynamicHeight && autoHeight) {
          wrapper[pluginName]('recalcHeight');
        }

        // Callback on transition complete
        var after = settings.callbackAfter;
        if ($.isFunction(after)) {
          panel.eq(pIndex).one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', function () {
            after.call(this);
          });
        }

      });
    }, // End back page
    forPage: function () {
      return this.each(function () {
        var wrapper = $(this);
        var panel = wrapper.children('.panel');
        var settings = wrapper.data('settings');
        var pCount = wrapper.data('pCount');
        var pIndex = wrapper.data('pIndex');
        var loop = settings.loop;
        var carousel = settings.carousel;
        var transition = settings.transition;
        var autoHeight = settings.autoHeight;
        var dynamicHeight = settings.dynamicHeight;
        var duration = settings.duration;

        // Add active class to panel
        panel.removeClass('active').eq(pIndex).addClass('active');

        // Stop current animations
        wrapper.children('.panel').stop(true, true);

        if (carousel) {
          switch (transition) {
            case 'fade':
              wrapper[pluginName]('carFade');
              break;
            case 'slide':
              wrapper[pluginName]('carSlideFor');
              break;
            case 'none':
            default:
              wrapper[pluginName]('carToggle');
          } // End transition switch

        } else {
          switch (transition) {
            case 'fade':
              wrapper[pluginName]('fade');
              break;
            case 'mask':
              wrapper[pluginName]('mask');
              break;
            case 'slide':
              wrapper[pluginName]('slideFor');
              break;
            case 'slideVert':
              wrapper[pluginName]('slideVertFor');
              break;
            case 'blind':
              wrapper[pluginName]('blindFor');
              break;
              /*
              case 'none':
              default:
              	wrapper[pluginName]('toggle');
              */
          } // End transition switch
        } // end carousel check

        // Check if on last panel
        if (pCount <= pIndex + 1) {
          wrapper.addClass('last-panel');
        } //  End prev control check

        // Remove first panel class since we're moving forward
        wrapper.removeClass('first-panel');

        wrapper[pluginName]('pagerUpdate');

        // dynamically change height
        if (dynamicHeight && autoHeight) {
          wrapper[pluginName]('recalcHeight');
        }

        // Callback on transition complete
        var after = settings.callbackAfter;
        if ($.isFunction(after)) {
          panel.eq(pIndex).one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', function () {
            after.call(this);
          });
        }


      });
    }, // End forward page
    carToggle: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var pCount = wrapper.data('pCount');
      var pIndex = wrapper.data('pIndex');
      // var cIndex    = wrapper.data('cIndex');
      var carousel = settings.carousel;
      var itemWidth = 100 / parseInt(carousel);
      var end = pIndex + parseInt(carousel);

      // remove all panels
      panel.css('left', '100%');

      var left = 0;
      // loop through and show multiple slides
      for (var i = pIndex; i < end; i++) {
        var x;
        if (i < pCount) {
          x = i;
        } else {
          // end is higher than number of slides
          // loop back to beginning
          x = i - pCount;

        }

        panel.eq(x).css('left', left + '%');

        left = left + itemWidth;
      }

    }, // End carToggle
    carFade: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var pCount = wrapper.data('pCount');
      var pIndex = wrapper.data('pIndex');
      // var cIndex    = wrapper.data('cIndex');
      var duration = settings.duration;
      var carousel = settings.carousel;
      var itemWidth = 100 / parseInt(carousel);
      var end = pIndex + parseInt(carousel);

      // console.log(pIndex);
      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      // hide panels
      panel.removeClass('init').css('opacity', 0);

      // reset active slide
      resetSlides = function () {
        // remove all panels
        panel.addClass('init').css('left', '100%');

        var start = 0;
        // loop through and show multiple slides
        for (var i = pIndex; i < end; i++) {
          var x;
          if (i < pCount) {
            x = i;
          } else {
            // end is higher than number of slides
            // loop back to beginning
            x = i - pCount;

          }

          // hide panels
          panel.eq(x).css('left', start + '%');
          panel.eq(x).removeClass('init').css('opacity', 1);

          start = start + itemWidth;
        }

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });


    }, // End carFade
    carSlideFor: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var pIndex = wrapper.data('pIndex');
      var cIndex = wrapper.data('cIndex');
      var pCount = wrapper.data('pCount');
      // var easing       = settings.easing;
      var duration = settings.duration;
      var carousel = settings.carousel;
      var slideSkip = pIndex - cIndex;
      var itemWidth = 100 / parseInt(carousel);
      var movement = itemWidth * slideSkip;
      var end = pIndex + parseInt(carousel);
      var start, left, x, i;

      // check if end slide is before current slide
      // extend the end to loop all slides
      if (pIndex < cIndex) {
        slideSkip = pIndex - cIndex + pCount;
        movement = itemWidth * slideSkip;
        end = end + pCount;
      }
      // console.log(pIndex);

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      start = 0;
      left = start - movement;

      // loop through and show multiple slides
      for (i = cIndex; i < end; i++) {
        if (i < pCount) {
          x = i;
        } else {
          // end is higher than number of slides
          // loop back to beginning
          x = i - pCount;

        }

        panel.eq(x).css('left', start + '%');
        panel.eq(x).css('display'); // Recalculate computed style
        panel.eq(x).removeClass('init').css('left', left + '%');

        start = start + itemWidth;
        left = left + itemWidth;
      }


      // reset active slide
      resetSlides = function () {


        panel.addClass('init');
        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End carSlideFor
    carSlideBack: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var pCount = wrapper.data('pCount');
      var pIndex = wrapper.data('pIndex');
      var cIndex = wrapper.data('cIndex');
      // var easing       = settings.easing;
      var duration = settings.duration;
      var carousel = settings.carousel;
      var itemWidth = 100 / parseInt(carousel);
      var slideSkip = cIndex - pIndex;
      var movement = itemWidth * slideSkip;
      var end = cIndex + carousel;
      var start, left, x, i;
      //alert(end);


      // check if target slide is after last slide
      // loop back to end
      if (slideSkip < 0) {
        slideSkip = slideSkip + pCount;
        movement = itemWidth * slideSkip;
        end = end + pCount;
      }
      //console.log(movement);

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      start = 0 - movement;
      left = 0;
      // loop through and show multiple slides
      for (i = pIndex; i < end; i++) {
        if (i < pCount) {
          x = i;
        } else {
          // target is before first slide
          // loop back to end
          x = i - pCount;

        }
        //console.log(start);
        panel.eq(x).addClass('init').css('left', start + '%');
        panel.eq(x).css('display'); // Recalculate computed style
        panel.eq(x).removeClass('init').css('left', left + '%');

        left = left + itemWidth;
        start = start + itemWidth;
      }


      // reset active slide
      resetSlides = function () {

        panel.addClass('init');
        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End carSlideBack
    fade: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      // Remove current page
      panel.eq(cIndex).removeClass('init').css('opacity', 0);

      // display the page
      panel.eq(pIndex).show();
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css('opacity', 1);

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init').hide();

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });


    }, // End fade
    mask: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      // Remove current page
      panel.eq(cIndex).removeClass('init');
      panel.eq(cIndex).css('display'); // Recalculate computed style
      panel.eq(cIndex).addClass('hide');


      // display the page
      panel.eq(pIndex).show();

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).removeClass('hide').hide();

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });


    }, // End fade
    blindFor: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var pWrap = panel.children('.panel-inner');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;
      var width = wrapper.width();


      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      // setup current page
      panel.eq(cIndex).css({
        left: 0,
        right: ''
      });

      // Remove current page
      panel.eq(cIndex).css('display'); // Recalculate computed style
      panel.eq(cIndex).removeClass('init').css({
        width: 0
      }); // End animation

      // move new page into position
      panel.eq(pIndex).addClass('init').css({
        marginLeft: '',
        left: '',
        right: 0
      });
      pWrap.eq(pIndex).css({
        marginLeft: -(width)
      });


      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        width: '100%'
      }); // End animation
      pWrap.eq(pIndex).css('display'); // Recalculate computed style
      pWrap.eq(pIndex).css({
        marginLeft: 0
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init').css({
          marginLeft: '',
          right: '',
          left: '',
          width: '100%'
        });
        pWrap.eq(pIndex).css({
          marginLeft: 0
        }); // End animation

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End blindFor
    blindBack: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var pWrap = panel.children('.panel-inner');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var width = wrapper.width();
      var duration = settings.duration;

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      // setup current page
      panel.eq(cIndex).addClass('init').css({
        left: '',
        right: 0
      });

      pWrap.eq(cIndex).css({
        marginLeft: ''
      });


      // Remove current page
      panel.eq(cIndex).css('display'); // Recalculate computed style
      panel.eq(cIndex).removeClass('init').css({
        width: 0
      });

      pWrap.eq(cIndex).css('display'); // Recalculate computed style
      pWrap.eq(cIndex).css({
        marginLeft: -(width)
      });

      // move new page into position
      panel.eq(pIndex).addClass('init').css({
        left: 0,
        right: ''
      });
      pWrap.eq(pIndex).css({
        marginLeft: 0
      }); // End animation


      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        width: '100%'
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init').css({
          marginLeft: '',
          right: '',
          left: '',
          width: '100%'
        });

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End blindBack
    slideFor: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      panel.eq(pIndex).css('display'); // Recalculate computed style

      // Remove current page
      panel.eq(cIndex).removeClass('init').css({
        transform: 'translateX(-100%)'
      }); // End animation

      // move new page into position
      panel.eq(pIndex).css({
        transform: 'translateX(100%)'
      });

      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        transform: 'translateX(0%)'
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init').css({
          transform: 'translateX(0%)'
        });

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End slideFor
    slideBack: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;


      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      panel.eq(pIndex).css('display'); // Recalculate computed style

      // Remove current page
      panel.eq(cIndex).removeClass('init').css({
        transform: 'translateX(100%)'
      }); // End animation

      // reset past slide

      // move new page into position
      panel.eq(pIndex).addClass('init').css({
        transform: 'translateX(-100%)'
      });

      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        transform: 'translateX(0%)'
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init');

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });


    }, // End slideBack
    slideVertFor: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;

      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      panel.eq(pIndex).css('display'); // Recalculate computed style

      // Remove current page
      panel.eq(cIndex).removeClass('init').css({
        transform: 'translateY(-100%)'
      }); // End animation

      // move new page into position
      panel.eq(pIndex).css({
        transform: 'translateY(100%)'
      });

      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        transform: 'translateY(0%)'
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init').css({
          transform: 'translateY(0%)'
        });

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });

    }, // End slideVertFor
    slideVertBack: function () {
      var wrapper = this;
      var panel = wrapper.children('.panel');
      // var pWrap    = panel.children('.panel-inner');
      var settings = wrapper.data('settings');
      var cIndex = wrapper.data('cIndex');
      var pIndex = wrapper.data('pIndex');
      var duration = settings.duration;


      var resetSlides = wrapper.data('resetSlides');
      var resetTimeout = wrapper.data('resetTimeout');

      if (resetTimeout) {
        resetSlides();
        clearTimeout(resetTimeout);
      }

      panel.eq(pIndex).css('display'); // Recalculate computed style

      // Remove current page
      panel.eq(cIndex).removeClass('init').css({
        transform: 'translateY(100%)'
      }); // End animation

      // reset past slide

      // move new page into position
      panel.eq(pIndex).addClass('init').css({
        transform: 'translateY(-100%)'
      });

      // transition new page
      panel.eq(pIndex).css('display'); // Recalculate computed style
      panel.eq(pIndex).removeClass('init').css({
        transform: 'translateY(0%)'
      }); // End animation

      // reset active slide
      resetSlides = function () {
        panel.eq(cIndex).addClass('init');
        panel.eq(pIndex).addClass('init');

        resetTimeout = false;
      };
      resetTimeout = setTimeout(resetSlides, duration);

      wrapper.data({
        resetSlides: resetSlides,
        resetTimeout: resetTimeout
      });


    } // End slideVertBack
  }; // End method


  $.fn[pluginName] = function (method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery[pluginName]');
    }

  }; // End slider

})(jQuery);