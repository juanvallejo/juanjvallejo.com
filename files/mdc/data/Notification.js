function Notification(a,b) {
	var self = this;
	this.backside = null;
	this.container = document.createElement("div");
	this.container.is = {
		notification:true
	};
	this.i = 0;
	this.id = undefined;
	this.is = {
		notification:self.container.is.notification
	};
	this.options = [];
	this.styles = [
		{
			name:"alert",
			className:{
				backside:"",
				container:"menu",
				header:"menu-header",
				input:"text",
				text:"text",
				options:{
					ul:"",
					li:""
				},
				paragraph:""
			},
			options:{
				center:true,
				display:null
			}
		},
		{
			name:"note",
			className:{
				backside:"note-backside",
				container:"note",
				header:"note-title",
				input:"text input",
				text:"",
				options:{
					ul:"buttons",
					li:""
				},
				paragraph:""
			},
			options:{
				center:false
			}
		}
	];
	this.style = {
		i:b ? b-1 : 0,
		name:self.styles[this.i].name
	};
	this.title = a || "Untitled Notification";
	this.wrapper = document.body;
	this._add = function(a) {
		this.options[this.i] = document.createElement("li");
		this.options[this.i].num = this.i;
		if(this.options[this.i].num == 0) {
			this.options[this.i].style.borderTop = "0";
		}
		this.options[this.i].on = function(a,b) {
			this.addEventListener(a,function(e) {
				b.call(this,e);
			});
		};
		this.i++;
		if(typeof a == 'function') {
			a.call(this.options[this.i-1]);
		} else {
			this.options[this.i-1].innerHTML = a;
		}
	};
	this._create = [
		function(a) {
			if(self.id) {
				self.container.id = self.id;
			}
			self.container.className = self.styles[self.style.i].className.container;
			var header = document.createElement("div");
				header.className = self.styles[self.style.i].className.header;
				header.innerHTML = self.title;
			var ul = document.createElement("ul");
				ul.className = self.styles[self.style.i].className.options.ul;
			for(var i=0;i<self.options.length;i++) {
				if(self.options[i].num == self.options.length-1) {
					self.options[i].style.borderBottom = "0";
				}
				ul.appendChild(self.options[i]);
			}
			self.container.appendChild(header);
			self.container.appendChild(ul);
			self.wrapper.appendChild(self.container);
			self.container.focus();
			if(self.styles[self.style.i].options.display) {
				self.container.style.display = self.styles[self.style.i].options.display;
			}
			if(self.styles[self.style.i].options.center) {
				ul.style.marginTop = ((self.container.clientHeight-ul.clientHeight)/2)+"px";
			}
			if(typeof a == "function") a.call(self);
			return self;
		},
		function(a) {
			this[0](a);
		}
	];
	this.add = {
		paragraph:function(a) {
			var p = document.createElement("p");
				p.className = self.styles[self.style.i].className.paragraph;
				p.innerHTML = a;
				p.on = function(a,b) {
					p.addEventListener(a,function(e) {
						b.call(p,e);
					});
				};
			self.container.appendChild(p);
			return p;
		},
		text:function(a) {
			self._add(a);
			self.options[self.i-1].className = self.styles[self.style.i].className.text;
			return self.options[self.i-1];
		},
		button:function(a) {
			self._add(a);
			return self.options[self.i-1];
		},
		input:function(a) {
			var input = document.createElement("input");
			input.placeholder = a;
			self._add(function() {
				this.appendChild(input);
			});
			self.options[self.i-1].className = self.styles[self.style.i].className.input;
			self.options[self.i-1].input = function() {
				return input;
			};
			self.options[self.i-1].input().on = function(a,b) {
				this.addEventListener(a,function(e) {
					b.call(this,e);
				});
			};
			return input;
		}
	};
	this.create = function(a,b) {
		return this._create[this.style.i](a,b);
	};
	this.create.backside = function() {
		var back = document.createElement("div");
			back.className = self.styles[self.style.i].className.backside;
			back.style.minHeight = window.getComputedStyle(self.container,null).getPropertyValue('height');
			back.style.display = "none";
			back.on = function(a,b) {
				back.addEventListener(a,function(e) {
					b.call(self,e);
				});
			};
		self.wrapper.appendChild(back);
		self.backside = back;
		return back;
	}
	this.hide = function() {
		this.container.style.display = "none";
	};
	this.input = function(a) {
		return this.options[a-1].getElementsByTagName("input")[0];
	};
	this.on = function(a,b) {
		this.container.addEventListener(a,function(e) {
			b.call(self,e);
		});
	};
	this.remove = function() {
		if(this.wrapper.removeChild(this.container)) {
			this.container = null;
		}
	};
	this.show = function(a) {
		this.container.style.display = a || "block";
	};
	this.set = {
		display:function(a) {
			self.styles[self.style.i].options.display = a;
		},
		style:function(a) {
			self.style.i = a-1;
		},
		wrapper:function(a) {
			self.wrapper = a;
		}
	};
	this.option = function(a) {
		return this.options[a-1];
	};
	this.container.tabIndex = 1;
}