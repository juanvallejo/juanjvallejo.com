/**
 + jquery.RotatAnim - jQuery Rotation Animation
 + Plugin version 0.4
 +
 + Written by
 + Juan Vallejo (juuanv@gmail.com)
 + 
 + Dependencies
 + jQuery (http://jquery.com)
 + 
 **/
 
(function($) {
	$.fn.rotate = function(lim,options,callback) {
		var deg = 0;
		var settings = {
			speed : '2'
		}
		var obj = this;
		var objId = $(this).attr('id');
		if(objId === undefined) {
			objClass = $(this).attr('class').split(" ");
			objId = objClass[0];
		}
		if(typeof options == "function") {
			callback = options;
		} else {
			$.extend(settings,options);
		}
		
		return this.each(function rotate() {
			var cache = $('#RotatAnim_'+objId).html();
			if(cache === null) {
				$(document.body).append("<div id='RotatAnim_"+objId+"' style='display:none;'>0</div>");
			} else {
				deg = cache;
			}
			if(cache < lim) {
				deg++;
				obj.css({
							'-webkit-transform':'rotate('+deg+'deg)',
							'-moz-transform':'rotate('+deg+'deg)',
							'-o-transform':'rotate('+deg+'deg)',
							'-ms-transform':'rotate('+deg+'deg)',
							'transform':'rotate('+deg+'deg)'
							});
				$('#RotatAnim_'+objId).html(deg);
				if(deg < lim) {
					setTimeout(rotate,settings.speed);
				} else {
					if(typeof callback == "function") {
						callback.call(obj);
					}
				}
			} else {
				var math1 = 360-deg+lim;
				var math2 = cache-lim;
				if(math1 <= math2) {
					lim = 360+lim;
					forward();
				} else {
					reverse();
				}
			}
		});
		function reverse() {
			deg--;
			obj.css({
							'-webkit-transform':'rotate('+deg+'deg)',
							'-moz-transform':'rotate('+deg+'deg)',
							'-o-transform':'rotate('+deg+'deg)',
							'-ms-transform':'rotate('+deg+'deg)',
							'transform':'rotate('+deg+'deg)'
							});
			$('#RotatAnim_'+objId).html(deg);
			if(deg > lim) {
				setTimeout(reverse,settings.speed);
			} else {
				deg = lim;
				if(typeof callback == "function") {
					callback.call(obj);
				}
			}
		}
		
		function forward() {
			deg++;
			obj.css({
							'-webkit-transform':'rotate('+deg+'deg)',
							'-moz-transform':'rotate('+deg+'deg)',
							'-o-transform':'rotate('+deg+'deg)',
							'-ms-transform':'rotate('+deg+'deg)',
							'transform':'rotate('+deg+'deg)'
							});
			$('#RotatAnim_'+objId).html(deg);
			if(deg < lim) {
				setTimeout(forward,settings.speed);
			} else {
				lim = lim-360;
				deg = lim;
				$('#RotatAnim_'+objId).html(deg);
				if(typeof callback == "function") {
					callback.call(obj);
				}
			}
		}
	};
}) (jQuery);