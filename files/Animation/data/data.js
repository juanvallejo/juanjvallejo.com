(function(window) {
	var Lib = {
		A:function(o) {
			var init = new Lib.init();
//			var div = init.main.div = o;
			Lib.fn.init(init,o);
			return init.fn;
		},
		frame:{
			request:function(a) {
				var frame = window.requestAnimationFrame(a) || window.mozRequestAnimationFrame(a) || window.webkitRequestAnimationFrame(a);
				if(!frame) {
					frame = setTimeout(a,1000/60);
				}
				return frame;
			}
		},
		init:function() {
			return Lib;
		},
		fn:{
			init:function() {}
		},
		main:{
			div:null
		}
	};
	Lib.fn.init = function(A,div) {
		A.frame.delta = 0;
		A.frame.speed = 0;
		A.frame.rate = 0;
		A.frame.pixels = 100;
		A.frame.timestamp = {
			now:Date.now(),
			saved:null
		};
		A.frame.update = function(o) {
			if(!this.timestamp.saved) this.timestamp.saved = Date.now();
			this.timestamp.now = Date.now();
			this.delta = this.timestamp.now - this.timestamp.saved;
			this.speed = this.delta * this.pixels;
			this.rate = 1000 / this.delta;
			this.timestamp.saved = this.timestamp.now;
		};
		A.fn.on = function(a,b) {
			div.addEventListener(a,function(e) {
				b.call(div,e);
			});
		};
		A.fn.fadeOut = function(a) {
			A.frame.pixels = a;
	//Time conversion algorithm = (((1/N)*2)*60)/20
			var speed = (((1/a)*2)*60)/2.19;
			var deg = 1.0;
			var i = 0;
			_init();
			function _init() {
				i++;
				A.frame.update();
				div.style.opacity = deg;
				deg-=speed;
				if(deg >= -1) {
					Lib.frame.request(_init);
				}
			};
			return A;
		};
	/*	A.fn.flicker = function(a) {
			A.frame.pixels = a;
			var deg = 1.0;
			_init();
			function _init() {
				A.frame.update();
				div.style.opacity = deg;
				if(deg - A.frame.speed < 0) {
					A.frame.speed = 0-div.style.opacity;
				}
				deg-=A.frame.speed;
				if(deg >= -1) {
					Lib.frame.request(_init);
				}
			};
			return A;
		};*/
		A.fn.transformFlip = function() {	
			var n = 0;
			_init();
			function _init() {
				div.style.webkitTransform = "skew()";
			};
			return A;
		};
		A.fn.flip = function() {

		};
		A.fn.div = function() {
			return div;
		};
	};
	window.A = Lib.A;
})(window);
window.onload = function() {
	var div1 = document.getElementById("test");
	var div2 = document.getElementById("test2");
	A(div1).on('click',function() {
		A(this).fadeOut(2000);
	});
	A(div2).on('click',function() {
		A(this).transformFlip(2000);
	});
};