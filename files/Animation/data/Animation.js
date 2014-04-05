function _Prototype() {
	var self = this;
	this.frame = {
		delta:0,
		distance:0,
		iteration:null,
		rate:0,
		speed:100,
		update:function() {
			if(!self.timestamp.saved) self.timestamp.saved = Date.now();
			self.timestamp.current = Date.now();
			self.frame.delta = (self.timestamp.current - self.timestamp.saved) / 1000;
			self.timestamp.saved = self.timestamp.current;
			self.frame.distance = self.frame.speed * self.frame.delta;
		}
	};
	this.is = {
		finished:true,
		running:false
	};
	this.instance = {
		array:[],
		iterator:0
	};
	this.iteration = 0;
	this.iterator = 0;
	this.limit = {
		angle:90,
		current:null,
		saved:0,
		offset:null
	};
	this.set = {
		speed:function(a) {
			this.frame.speed = a;
		}
	};
	this.timestamp = {
		current:Date.now(),
		saved:null
	};
	this.new = function() {
		this.instance.array.push(new Animation());
		this.instance.iterator++;
		return this.instance.array[this.instance-1];
	};
};
function Animation(a) {
	var self = this;
	this.degree = 0;
	this.frame.speed = a || this.frame.speed;
	this.is.flipped = false;
	this.flip = function(a,b,c) {
		if(this.limit.current === null) {
			this.limit.current = this.limit.angle;
			this.limit.offset = 90-this.limit.current;
			this.limit.saved = this.limit.current;
			if((!b || typeof b == "function") && a.is.notification) {
				if(typeof b == "function") {
					c = b;
				}				
				b = a.create.backside();
			}
			if(a.is.notification && b.is.notification && a.wrapper === b.wrapper) {
				a.wrapper.style.perspective = "1000";
				a.wrapper.style.webkitPerspective = "1000";
				a.wrapper.style.MozPerspective = "1000";
			} else if(a.is.notification && !b.is.notification) {
				a.wrapper.style.perspective = "1000";
				a.wrapper.style.webkitPerspective = "1000";
				a.wrapper.style.MozPerspective = "1000";
			} else if(b.is.notification && !a.is.notification) {
				b.wrapper.style.perspective = "1000";
				b.wrapper.style.webkitPerspective = "1000";
				b.wrapper.style.MozPerspective = "1000";
			}
			if(a.is.notification) {
				a = a.container;
			}
			if(b.is.notification) {
				b = b.container;
			}
		}
		this.frame.update();
		this.is.running = true;
		a.style.webKitPerspective = "1000px";
		a.style.webkitTransform = "rotateY("+this.degree+"deg)";
		a.style.webkitTransformStyle = "preserve-3d";
		this.frame.rate = this.frame.delta*1000;
		this.degree+=this.frame.distance;
		if(this.degree <= this.limit.current) {
			this.frame.iteration = window.requestAnimationFrame(function() {
				self.flip(a,b,c);
			});
		} else {
			if(!this.is.flipped) {
				this.is.flipped = true;
				a.style.webkitTransform = "rotateY("+this.limit.current+"deg)";
				a.style.display = "none";
				this.degree = -this.limit.current-(this.limit.offset*2);
				this.limit.saved = this.limit.current;
				this.limit.current = 0;
				a = b;
				a.style.webkitTransform = "rotateY("+this.degree+"deg)";
				a.style.display = "block";
			}
			if(this.iteration == 0) {
				this.iteration++;
				this.flip(a,b,c);
			} else {
				this.iteration = 0;
				this.limit.current = -this.limit.saved-(this.limit.offset*2);
				this.degree = 0;
				this.timestamp.saved = false;
				this.is.finished = true;
				this.is.running = false;
				a.style.webkitTransform = "rotateY("+this.degree+"deg)";
				if(typeof c == "function") c.call(this);
			}
		}
	};
	this.unflip = function(a,b,c) {
		if(this.iterator==0) {
			this.iterator++;
			if(a.is.notification) {
				if(!b || typeof b == "function") {
					if(typeof b == "function") {
						c = b;
					} else {
						b = a.container;
						a = a.backside;
					}
				}
			}
			if(a.is.notification) {
				a = a.container;
			}
			if(b.is.notification) {
				b = b.container;
			}
		}
		this.frame.update();
		this.is.running = true;
		a.style.webKitPerspective = "1000px";
		a.style.webkitTransform = "rotateY("+this.degree+"deg)";
		a.style.webkitTransformStyle = "preserve-3d";
		this.frame.rate = this.frame.delta*1000;
		this.degree-=this.frame.distance;
		if(this.degree > this.limit.current) {
			this.frame.iteration = window.requestAnimationFrame(function() {
				self.unflip(a,b,c);
			});
		} else {
			if(this.is.flipped) {
				this.is.flipped = false;
				a.style.display = "none";
				this.degree = this.limit.saved;
				this.limit.current = 0;
				a = b;
				a.style.webkitTransform = "rotateY("+this.degree+"deg)";
				a.style.display = "block";
			}
			if(this.iteration == 0) {
				this.iteration++;
				this.unflip(a,b,c);
			} else {
				this.iteration = 0;
				this.limit.current = this.limit.saved+(this.limit.offset*2);
				this.degree = 0;
				this.timestamp.saved = false;
				this.limit.current = null;
				this.iterator = 0;
				this.is.finished = true;
				this.is.running = false;
				a.style.webkitTransform = "rotateY("+this.degree+"deg)";
				if(typeof c == "function") c.call(this);
			}
		}
	};
};
Animation.prototype = new _Prototype;