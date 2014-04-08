<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="UTF-8"/>
<meta name="description" content="Juan Vallejo - Web programmer; freelance web designer"/>
<meta name="Author" content="Juan Vallejo"/>
	<title>Techboxcoding - R&amp;D Projects - Rotation Animation</title>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="css/setting_s.js"></script>
<script type="text/javascript" src="css/settings.js"></script>
<link rel="stylesheet" type="text/css" href="css/reset.css"/>
<link rel="stylesheet" type="text/css" href="css/styles.css"/>
<script type="text/javascript">
$(document).ready(function() {
	$('#demoItemReset').click(function() {
		$('#rectangle2').rotate(0);
	});
	
	$('#demoItemOne').click(function() {
		$('#rectangle2').rotate(-36);
	});
	
	$('#demoItemTwo').click(function() {
		$('#rectangle2').rotate(120);
	});
	
	$('#demoItemThree').click(function() {
		$('#rectangle2').rotate(300);
	});
});
</script>
<!--[if lt IE 9]>
<script type="text/javascript">
$(document).ready(function() {
	$('#alert').slideDown('normal');
});
</script>
<![endif]-->
</head>
<body>
<div id="left">
	<div class="border-vertical-right"></div><!--end .border-->
	<div id="left-top">
		<div id="logo1" style="font-size:2.3em;width:100%;text-align:center;padding-top:20px;text-shadow:0 1px 0 rgba(255,255,255,0.95)">Techboxcoding</div><!--end #logo-->
	</div><!--end #left-top-->
	<div id="left-body">
		<ul id="menu">
			<li class="menu-active" style="border-top:0;" title="home">Rotation Animation</li>
			<li title="notes">Development</li>
			<li title="download">Download</li>
			<li title="documentation">Documentation</li>
			<li title="contact">Contact</li>
		</ul>
	</div><!--end #left-body-->
	<div id="footer">&copy; 2012 Juan Vallejo</div><!--end .footer-->
</div><!--end #left-->
<div id="right">
<div class="border-vertical-right"></div><!--end .border-->
<div id="alert" class="hidden">
	<p style="width:100%; margin:0 auto 0 auto; text-align:center;">It looks like you're using IE 8 or below; in order for
	the demo to work properly (or at all), upgrading your browser is recommended.</p>
	<div class="border-vertical-left" style="background:#d3d3d3;"></div><!--end .border-->
	<div class="border-horizontal-bottom" style="background:#FFDACC;"></div><!--end .border-->
</div><!--end #alert-->
	<div class="container" id="home">
		<p class="title">Rotation Animation</p>
		<p class="tagline">A jQuery Plugin</p>
			<div class="box" style="min-height:160px;">
				<p class="tagline code">Plugin Demo</p>
				<div class="shade" id="demoItemReset">Rotate to 0&deg;</div>
				<div class="shade" id="demoItemOne" style="clear:left;">Rotate to -36&deg;</div>
				<div class="shade" id="demoItemTwo" style="clear:left;">Rotate to 120&deg;</div>
				<div class="shade" id="demoItemThree" style="clear:left;">Rotate to 300&deg;</div>
				<div class="rectangle" id="rectangle2"></div>
			</div><!--end .box-->
			<div class="box bar">
				<p class="tagline">Demo Syntax</p>
				<p>&lt;script type=&quot;text/javascript&quot;&gt; <br />
				$(document).ready(function() { <br /><br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$( '#demoButtonReset' ).click(function() { <br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$('#rectangle2').rotate( 0 ); <br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}); <br /><br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$( '#demoButtonOne' ).click(function() { <br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$( '#rectangle2' ).rotate(-36, {speed:10} ); <br />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}); <br /><br />
				}); <br />
				&lt;/script&gt;</p>
				<p style="margin-top:10px;"><span class="bold">Important:</span> If nothing happens, try upgrading your browser.</p>
				<p><span class="bold">Note:</span> Clicking the object will remove its border.</p>
			</div><!--end .box-->
			<div class="box">
				<p class="tagline code">Change Log</p>
				<p class="tagline" style="margin-top:10px; font-size:15px; margin-bottom:5px;">Version 0.4.3</p>
				<ul class="changelog">
					<li>Looping function added</li>
				</ul>
				<a href="log.txt" class="code" target="_blank" style="margin-top:5px; display:block; width:75px;">View full log</a>
			</div><!--end .box-->
			<div class="box bar">
				<p style="width:100%; text-align:center;">The latest version of Rotation animation was released on 3/26/13</p>
			</div><!--end .box-->
	</div><!--end .container-->
	<div class="container" id="notes">
		<p class="title">Rotation Animation</p>
		<p class="tagline">Development Notes</p>
		<!--<div class="box" style="min-height:160px;">
				<p class="tagline user_input_num code" id="main_title">Concept Idea</p>
				<div class="shade" id="trigger">play</div>
				<div class="shade" id="reset" style="clear:left;">reset</div>
				<div class="shade" id="count" style="clear:left;"><span>0</span>&deg;</div>
				<div class="rectangle" id="rectangle"></div>
			</div>
			<div class="box bar">
			<p class="tagline">Directions</p>
			<p class="user_input_num">Press the "play" button to add an angle increment of <span></span>&deg;
			to the object. You will see the object's current angle position change accordingly. Keep pressing the
			"play" button to keep adding an increment of <span></span>&deg; to the object. Clicking on the object will
			remove its border.</p>
			<p style="margin-top:10px;"><span class="bold">Note:</span> This code is not yet compatible with versions of
			Internet Explorer 8 or below.</p>
			</div>-->
		<div class="box">
			<p class="tagline code">Notes</p>
				<p style="margin-bottom:10px;">As it may or may not have been noted, jQuery's current version lacks any manner of
				animating an object in a rotational motion; using jQuery's default functions, one may only
				animate an in a linear motion. By using the CSS3 property of transform, we can manage to
				successfully present a DOM object at a rotated angle.</p>
				<p style="margin-bottom:10px;">However, as much as this accomplishes, the object is merely shown at its final angle,
				and the user is not shown the "animation" of the path that the object has taken in order to get
				to its current transformation.</p>
				<p class="user_input_num" style="margin-bottom:10px;">By using a "setTimeout" javaScript function that continuously calls an action function in jQuery,
				one is able to animate the object by increasing the current angle by one repeatedly until a certain
				condition is met, or a specific limit is reached; <span></span>&deg; in this case.</p>
				<p style="margin-bottom:10px;">By storing its current angle in a variable, Rotation
				Animation is able to save its current angle, thus enabling it to "know" its current location. The contents of
				this variable however, are replaced with new ones every time the main plugin function is called; a different approach had to
				be taken with Rotation Animation. By storing the value inside of the html itself, and treating that instance as a variable
				in javaScript, we are able to save the current angle of the selected object for the length of the browsing session.
				This later on becomes of crucial importance when we attempt at creating a continuous animation among different function calls.</p>
				<p style="margin-bottom:10px;">For example, say you have assigned a DOM object an event of rotating a target object to 36&deg;, and you've
				assigned a second DOM object the event of rotating that same target object to 300&deg;. By storing the current degree in the aforementioned manner,
				the object's position is remembered among function calls and the animation of the target object is able to occur from 36&deg; to 300&deg;
				rather than from 0&deg; to 300&deg; or 0&deg; to 36&deg; every time.</p>
				<p style="margin-bottom:10px;">To take the aforementioned concept even further, we can create simultaneous animations happen at a time by creating an html
				save instance for each object targeted in the plugin. By assigning each DOM object its own bank of storage for its current position, we can have each object
				remember its own current position without different objects' present angle interfering with another ones' at any given moment.
		</div><!--end .box-->
	</div><!--end .container-->
	<div class="container" id="download">
		<p class="title">Rotation Animation</p>
		<p class="tagline">Download (Version 0.4)</p>
			<div class="box">
				<p class="tagline code">Download</p>
				<p><a href="http://codecanyon.net/item/jquery-rotation-animation-plugin/2696696" class="code">Download jquery.RotatAnim.js</a></p>
			</div><!--end .box-->
			<div class="box bar">
				<p>Download the lastest version of Rotation Animation</p>
			</div><!--end .box-->
			<div class="box">
				<p class="tagline code">Installation</p>
				<p>In the downloaded .zip file, you will find a file named <span class="code">jquery.RotatAnim.js</span>,
				a readme file, and sample code.</p>
				<p>The <span class="code">sample.html</span> file provides an example on how to begin implementing
				Rotation Animation into your work.</p>
				<p>Place the javaScript file in a desired location, along with the jQuery file, and link to them from your html page.</p>
				<p>Please refer to the <span class="link" title="documentation">Documentation</span> section for more information.</p>
			</div><!--end .box-->
	</div><!--end .container-->
	<div class="container" id="documentation">
		<p class="title">Rotation Animation</p>
		<p class="tagline">User Guide</p>
			<div class="box">
				<p class="tagline code">Basics</p>
				<p style="margin-bottom:10px;">To use Rotation Animation, place JavaScript script tags inside your header tags. Inside your script tags,
				write the following:</p>
				<div class="code">
				<p>$(document).ready(function() {</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;$( #myDiv ).rotate( 360 );</p>
				<p>});</p>
				</div><!--end .code-->
				<p style="margin-top:10px;">The $( #myDiv ) portion targets the element you want to rotate</p>
				<p style="margin-top:10px;">The angle you wish to rotate your object to should go inside of the second parenthesis.</p>
				<p style="margin-top:10px;">In the example above, <span class="code">#myDiv</span> will rotate
				to <span class="code">360&deg;</span> at the default speed of .5&deg; per millisecond.</p>
			</div><!--end .box-->
			<div class="box">
				<p class="tagline code">Speed</p>
				<p>$(document).ready(function() {</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;$( '#myDiv' ).rotate(60, <span class="code">{ speed : 10 }</span>  );</p>
				<p>});</p>
				<p style="margin-top:10px;">By default, the rotation speed is set to .5&deg; per millisecond; should you wish a certain object to rotate faster,
				you can modify its speed by extending your syntax; in this case, #myDiv will rotate to 60&deg; at 1&deg; every 10 milliseconds.</p>
			</div><!--end .box-->
			<div class="box">
				<p class="tagline code">Looping</p>
				<p>$(document).ready(function() {</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;$( '#myDiv' ).rotate(<span class="code"> 'loop' </span>  );</p>
				<p>});</p>
				<p>$(document).ready(function() {</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;$( '#myDiv' ).rotate(30, <span class="code">{ loop : true }</span>  );</p>
				<p>});</p>
				<p style="margin-top:10px;">Loops are set to false by default. To loop the animation simply add <span class='code'>{loop:true}</span> to the second parameter of the plugin. Loop is a beta feature. Simply entering <span class='code'>'loop'</span> as a degree will loop an object's rotation in the direction closest to 0&deg;</p>
			</div><!--end .box-->
			<div class="box">
				<p class="tagline code">Callback Functions</p>
				<p>$(document).ready(function() {</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;$( <span class="code">'#myDiv'</span> ).rotate(200, function() { <br />
				 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$( <span class="code">this</span> ).rotate( 60 ); <br />
				 &nbsp;&nbsp;&nbsp;&nbsp;});</p>
				<p>});</p>
				<p style="margin-top:10px;">A feature that was added in version 0.3 of Rotation Animation is the ability to have simultaneous rotations for different objects.
				This then led to an easier implementation of callback functions. In the example above, the div element "#myDiv" will rotate to 200&deg; and then
				rotate 60&deg; at a speed of 1&deg; every 10 milliseconds.</p>
			</div><!--end .box-->
	</div><!--end .container-->
	<div class="container" id="contact">
		<p class="title">Contact Me</p>
		<p class="tagline">Send me a message</p>
		<div class="box">
			<textarea cols="28" rows="8" class="border-radius contact_form_element" style="width:367px;" id="contact_message" title="Leave a message here...">Leave a message here...</textarea>
		</div><!--end .box-->
		<div class="box bar">
		<span style="display:block; width:396px; height:30px; margin:0 auto 0 auto;">
			<input type="text" class="contact_form_element" style="float:left; margin:0 8px 0 8px;" value="name" title="name" id="contact_name"/>
			<input type="text" class="contact_form_element" style="float:left; margin:0 8px 0 8px;" value="email" title="email" id="contact_email"/>
		</span>
		<p id="contact_wait" class="hidden" style="position:absolute; top:10px; right:10px; padding:5px;">Sending message...</p>
		<div id="send_contact_form" class="button border-radius" style="top:10px; right:10px;">send message</div><!--end .button-->
		</div><!--end .box-->
		<div class="box bar hidden" id="contact_form_alert" style="text-align:center; color:#963f3f;"></div><!--end .box-->
		<div class="box">
			<p class="tagline code">Tips</p>
			<p>I will try to get back to your message as soon as I can, feel free to send your feedback, ask a question, or
			even hire me to be part of a project you or your company may be working on!</p>
			<p style="margin-top:10px;">If you wish to report a bug you may do so via this form as well, your feedback is greatly appreciated.</p>
		</div><!--end .box-->
	</div><!--end .container-->
</div><!--end #right-->
</body>
</html>