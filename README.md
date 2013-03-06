Bare-Bones-Slider
=================

Description: jQuery slider with little bloat but lots of customization.

Author: Richard Hung

More documentation and examples: http://www.bbslider.com

How to Use
==========

Link files

Bare Bones slider has a .js and a .css file in addition to the jQuery library. Optionally, you can include the <a href="http://gsgd.co.uk/sandbox/jquery/easing/" target="_blank">easing plugin</a> for animations.
```
<link type="text/css" href="css/bbslider.css" rel="stylesheet" media="screen" />
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript" src="js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="js/bbslider.min.js"></script>
```
Create HTML

Create a container for the slider and children for the panels.
```
<div class="slider">
    <div><img src="images/image-1.jpg" alt="first image" /></div>
    <div><img src="images/image-2.jpg" alt="second image" /></div>
    <div><img src="images/image-3.jpg" alt="third image" /></div>
    <div><img src="images/image-4.jpg" alt="forth image" /></div>
    <div><img src="images/image-5.jpg" alt="fifth image" /></div>
</div>
```

Call the slider

Call the slider after the HTML markup and required files.
```
$('.slider').bbslider({
    auto:  true,
    timer: 3000,
    loop:  true
});
```
