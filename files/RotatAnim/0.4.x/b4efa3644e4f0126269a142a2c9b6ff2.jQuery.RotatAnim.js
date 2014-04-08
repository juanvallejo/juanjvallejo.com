/**
 + jquery.RotatAnim - jQuery Rotation Animation
 + Plugin version 0.4.4 [ID:b4efa3644e4f0126269a142a2c9b6ff2]
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
		var counter;
		var cache;
		var settings = {
			counter:document.body.savedCount || 0,
			speed : '1',
			loop:false,
			savedLim:document.body.savedLimit
		}
		var obj = this;
		var objId = $(this).attr('id');
		if(objId === undefined) {
			if(this.className) {
				objClass = $(this).attr('class').split(" ");
				objId = objClass[0];
			} else objId = this[0].localName+(++settings.counter);
		}
		if(typeof options == "function") {
			callback = options;
		} else {
			$.extend(settings,options);
		}
		if(lim == 'loop') {
			settings.loop = true;
			lim = 1;
		} else settings.loop = false;
		document.body[objId] = {};
		document.body[objId].savedLimit = lim;
		return this.each(function rotate() {
			cache = $('#RotatAnim_'+objId).html();
			if(cache === null) {
				$(document.body).append("<div id='RotatAnim_"+objId+"' style='display:none;'>0</div>");
			} else {
				deg = cache;
			}
			counter = $('#RotatAnim_'+objId);
			if(counter.attr('state') == 'active') {
				settings.loop = true;
			}
			if(settings.loop) {
				if(counter.attr('state') != 'active') {
					counter.attr('state','active');
					if(cache <= lim) {
						forward();
					} else {
						reverse();
					}
				}
			} else {
				if(lim != document.body[objId].savedLimit) return;
				if(lim == 'reset') {
					console.log("CODE_TO_RESET_NOT_IMPLEMENTED");
				} else if(cache < lim) {
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
						if(lim>360) {
							var div = parseInt(lim / 360);
							for(var z = 0;z<div;z++) {
								lim = lim-360;
								$('#RotatAnim_'+objId).html(lim);
							}
						}
						if(typeof callback == "function") {
							callback.call(obj);
						}
					}
				} else {
					var math1 = 360-deg+lim;
					var math2 = cache-lim;
					if(math1 <= math2 && lim >= 0) {
						lim = 360+lim;
						forward();
					} else {
						reverse();
					}
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
			if(settings.loop) {
				setTimeout(reverse,settings.speed);
			} else {
				if(deg > lim) {
					setTimeout(reverse,settings.speed);
				} else {
					deg = lim;
					if(typeof callback == "function") {
						callback.call(obj);
					}
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
			if(settings.loop) {
				setTimeout(forward,settings.speed);
			} else {
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
		}
	};
})(jQuery);