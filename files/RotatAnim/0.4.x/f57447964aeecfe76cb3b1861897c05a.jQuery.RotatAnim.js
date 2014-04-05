/**
 + jquery.RotatAnim - jQuery Rotation Animation
 + Plugin version 0.4.5 [ID:f57447964aeecfe76cb3b1861897c05a]
 +
 + Written by
 + Juan Vallejo (juuanv@gmail.com)
 + 
 + Dependencies
 + jQuery (http://jquery.com)
 + 
 **/
(function(window) {
	var RotatAnim = {
		_version:{
			_versionId:"f57447964aeecfe76cb3b1861897c05a",
			_versionNumber:"0.4.5",
			_versionChangelog:[
				'Upgraded variable storage methods',
				'Compatibility with newer versions of jQuery added',
				'Animation method upgraded to use \“frames-per-second\”',
				'Code cleanup',
			],
			getVersionID:function() {
				return this._versionId;
			},
			getVersionNumber:function() {
				return this._versionNumber;
			},
			parseVersionChangelog:function(elem) {
				elem.innerHTML = "";
				for(var i=0;i<this._versionChangelog.length;i++) {
					elem.innerHTML += "<li>"+this._versionChangelog[i]+"</li>";
				}
			}
		},
		_frame:function() {
			this.time = {
				last:null,
				dt:0,
				now:Date.now()
			};
			this.update = function() {
				if(!this.time.last) this.time.last = Date.now();
				this.time.now = Date.now();
				this.time.dt = (this.time.now - this.time.last)/1000;
				this.time.last = this.time.now;
			};
			this.set = function(a) {
				var rAF = function() {
					return  window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function(a) {
						setTimeout(a,1000/60);
					}
				}();
				rAF(a);
				this.update();
			};
			this.reset = function() {
				this.time.last = null;
			}
		},
		cache:{},
		elems:{},
		frame:{}
	};
	$.fn.rotate = function(lim,options,callback) {
		var deg = 0;
		var settings = {
			counter:0,
			speed:100,
			loop:false,
			speedOffset:100
		}
		var obj = this;
		var objId = $(this).attr('id');
		if(objId === undefined) {
			if(this.className) {
				objClass = $(this).attr('class').split(" ");
				objId = objClass[0];
			} else objId = this[0] !== undefined ? this[0].localName+(++settings.counter) : "element"+(++settings.counter);
		}
		if(typeof options == "function") {
			callback = options;
		} else {
			$.extend(settings,options);
		}
		if(!RotatAnim.elems[objId]) RotatAnim.elems[objId] = {};
		if(lim == 'test') {

		} else if(lim == 'loop' || settings.loop == true) {
			RotatAnim.elems[objId].loop = true;
			if(!settings.loop) lim = 1;
		} else RotatAnim.elems[objId].loop = false;
		if(lim == 'reset') {
			//Work in progress
			RotatAnim.elems[objId].loop = false;
			return;
		} else if(lim === null) {
			console.log("Error: limit not passed");
			return;
		}
		if(!RotatAnim.frame[objId]) RotatAnim.frame[objId] = new RotatAnim._frame();
		else RotatAnim.frame[objId].reset();
		RotatAnim.elems[objId].savedLimit = lim;
		return this.each(function rotate() {
			if(RotatAnim.cache[objId] === undefined) {
				RotatAnim.cache[objId] = 0;
			} else {
				deg = RotatAnim.cache[objId];
			}
			if(RotatAnim.elems[objId].loop) {
				if(RotatAnim.cache[objId] <= lim) {
					forward();
				} else {
					reverse();
				}
			} else {
				if(lim != RotatAnim.elems[objId].savedLimit) return;
				if(lim == 'test') {
				} else if(RotatAnim.cache[objId] < lim) {
				//	deg+=parseFloat(RotatAnim._frame.time.dt+settings.speed/settings.speedOffset);
					deg+=parseFloat(RotatAnim.frame[objId].time.dt*settings.speed);
					obj.css({
								'-webkit-transform':'rotate('+deg+'deg)',
								'-moz-transform':'rotate('+deg+'deg)',
								'-o-transform':'rotate('+deg+'deg)',
								'-ms-transform':'rotate('+deg+'deg)',
								'transform':'rotate('+deg+'deg)'
								});
					RotatAnim.cache[objId] = deg;
					if(deg < lim) {
						RotatAnim.frame[objId].set(rotate);
					} else {
						if(lim>360) {
							var div = parseInt(lim / 360);
							for(var z = 0;z<div;z++) {
								lim = lim-360;
								RotatAnim.cache[objId] = lim;
							}
						}
						if(typeof callback == "function") {
							callback.call(obj);
						}
					}
				} else {
					var math1 = 360-deg+lim;
					var math2 = RotatAnim.cache[objId]-lim;
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
			deg-=parseFloat(RotatAnim.frame[objId].time.dt*settings.speed);
			obj.css({
							'-webkit-transform':'rotate('+deg+'deg)',
							'-moz-transform':'rotate('+deg+'deg)',
							'-o-transform':'rotate('+deg+'deg)',
							'-ms-transform':'rotate('+deg+'deg)',
							'transform':'rotate('+deg+'deg)'
							});
			RotatAnim.cache[objId] = deg;
			if(RotatAnim.elems[objId].loop) {
				RotatAnim.frame[objId].set(reverse);
			} else {
				if(deg > lim) {
					RotatAnim.frame[objId].set(reverse);
				} else {
					deg = lim;
					if(typeof callback == "function") {
						callback.call(obj);
					}
				}
			}
		}
		function forward() {
			deg+=parseFloat(RotatAnim.frame[objId].time.dt*settings.speed);
			obj.css({
							'-webkit-transform':'rotate('+deg+'deg)',
							'-moz-transform':'rotate('+deg+'deg)',
							'-o-transform':'rotate('+deg+'deg)',
							'-ms-transform':'rotate('+deg+'deg)',
							'transform':'rotate('+deg+'deg)'
							});
			RotatAnim.cache[objId] = deg;
			if(RotatAnim.elems[objId].loop) {
				RotatAnim.frame[objId].set(forward);
			} else {
				if(deg < lim) {
					RotatAnim.frame[objId].set(forward);
				} else {
					lim = lim-360;
					deg = lim;
					RotatAnim.cache[objId] = deg;
					if(typeof callback == "function") {
						callback.call(obj);
					}
				}
			}
		}
	};
	$.fn.rotate.serialize = function() {
		var elm = $('.RotatAnimVar');
		elm.each(function() {
			if(this.innerHTML.match(/RotatAnim.getVersionID/gi)) this.innerHTML = this.innerHTML.replace(/\{RotatAnim.getVersionId\}/gi,RotatAnim._version.getVersionID());
			else if(this.innerHTML.match(/RotatAnim.getVersionNumber/gi)) this.innerHTML = this.innerHTML.replace(/\{RotatAnim.getVersionNumber\}/gi,RotatAnim._version.getVersionNumber());
			else if(this.innerHTML.match(/RotatAnim.parseVersionChangelog/gi)) RotatAnim._version.parseVersionChangelog(this);
		});
	};
})(window);