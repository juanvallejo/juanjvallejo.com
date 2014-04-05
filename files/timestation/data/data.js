var Pictre = {
	_404:{
		div:document.createElement("div"),
		exists:false,
		put:function(a) {
			var self = this;
			var a = a || "There seems to be nothing here.";
			this.div.className = "Pictre-empty";
			this.div.innerHTML = a;
			this.exists = true;
			Pictre._settings.wrapper.appendChild(this.div);
			this.position();
			window.addEventListener('resize',function() {
				if(self.exists) {
					self.position();
				}
			});
		},
		remove:function() {
			if(this.exists) {
				this.exists = false;
				Pictre._settings.wrapper.removeChild(this.div);
			}
		},
		position:function() {
			this.div.style.left = (window.innerWidth/2 - (this.div.clientWidth/2))+"px";
			this.div.style.top = (window.innerHeight/2 - (this.div.clientHeight/2))+"px";
		}
	},
	_settings:{
		limit:40,
		maxCount:30,
		speed:500,
		wrapper:null
	},
	_storage:{
		_loadonready:function() {
			var self = this;
			this.gallery.onready.call(this.gallery);
			window.addEventListener('resize',function() {
				self.chisel();
				if(self.gallery.is.featuring) {
					if(self._storage.overlay.image) {
						self.gallery.overlay.image.position(self._storage.overlay.image);
					}
				}
			});
		},
		data:{
			anchor:0
		},
		iterator:0,
		loaded:0,
		overlay:{
			image:null,
			iterator:0,
			locked:false
		},
		page:{
			loaded:false
		},
		pictures:[]
	},
	create:{
		picture:function(a) {
			var self = Pictre;
			var img = new Image();
			var pic = document.createElement("div");
				img.src = a.thumb;
				img.addEventListener('load',function() {
					pic.innerHTML = "";
					pic.appendChild(img);
					self._storage.loaded++;
					if(self._storage.loaded == self._storage.pictures.length) {
						self._storage.loaded = 0;
						self.chisel();
						if(!self._storage.page.loaded) {
							self._storage.page.loaded = true;
							self._storage._loadonready.call(self);
						}
					}
				});
				pic.addEventListener('click',function() {
					self.gallery.feature(this);					
				});
				pic.className = self.properties.className;
				pic.innerHTML = "loading...";
				pic.data = {
					author:a.author,
					dbid:a.id,
					src:a.src,
					thumb:a.thumb,
					date:a.time
				};
				pic.data.id = self._storage.iterator;
				self._storage.iterator++;
			self._storage.pictures.push(pic);
			if(self._settings.wrapper) {
				self._settings.wrapper.appendChild(pic);
			}
			pic.in = function(a) {
				a.appendChild(this);
				self._settings.wrapper = a;
			};
			return pic;
		}
	},
	chisel:function() {
		var windowWidth = window.innerWidth;
		var itemWidth = this._storage.pictures[0].offsetWidth;
		var itemMargin = 0;
		var columnCount = 0;
		if(windowWidth && itemWidth) {
			itemMargin = parseInt(window.getComputedStyle(this._storage.pictures[0]).getPropertyValue('margin-left').split("px")[0]*2);
			columnCount = Math.floor(windowWidth / (itemWidth+itemMargin));
			if(columnCount > this._storage.pictures.length) {
				columnCount = this._storage.pictures.length;
			}
			this._settings.wrapper.style.width = (columnCount*(itemWidth+itemMargin))+"px";	
			for(var i=0;i<this._storage.pictures.length;i++) {
				this._storage.pictures[i].style.clear = "none";
				this._storage.pictures[i].first = false;
			}
			for(var i=0;i<this._storage.pictures.length;i++) {
				this._storage.pictures[i].style.top = "0";
			}
			for(var i=0;i<this._storage.pictures.length;i++) {
				this._storage.pictures[i].style.left = "0";
			}
			for(var i=0;i<this._storage.pictures.length;i+=columnCount) {
				this._storage.pictures[i].style.clear = "left";
				this._storage.pictures[i].first = true;
			}
			for(var i=0;i<this._storage.pictures.length;i++) {
				if(!this._storage.pictures[i].first) {
					this._storage.pictures[i].style.left = (parseInt(this._storage.pictures[i-1].style.left.split("px")[0])+this._storage.pictures[i-1].offsetWidth+itemMargin)+"px";
				}
			}
			for(var i=0;i<this._storage.pictures.length;i++) {
				if(this._storage.pictures[i+columnCount]) {
					this._storage.pictures[i+columnCount].style.top = ((this._storage.pictures[i].offsetTop+this._storage.pictures[i].offsetHeight+itemMargin)-(this._storage.pictures[i+columnCount].offsetTop))+"px";
				}
			}
		}
	},
	get:{
		_data:null,
		all:function() {
			return Pictre._storage.pictures;
		},
		db:function(a,b) {
			var self = this;
			var xhr = new XMLHttpRequest();
				xhr.open("POST","data/data.php",true);
				xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
				xhr.send("request="+a+"&anchor="+Pictre._storage.data.anchor+"&limit="+Pictre._settings.limit);
				xhr.addEventListener('readystatechange',function() {
					if(xhr.readyState == 4 && xhr.status == 200) {
						self._data = JSON.parse(xhr.responseText);
						if(typeof b == "function") b.call(Pictre,self._data);
					}
				});
		},
		picture:function(a) {
			return Pictre._storage.pictures[a];
		},
		total:function() {
			return Pictre._storage.pictures.length;
		},
		ui:{
			upload:{
				div:null,
				response:null,
				put:function() {
					var self = this;
					this.div = document.createElement("div");
					this.div.className = "Pictre-upload";
					Pictre.gallery.overlay.get().appendChild(this.div).addEventListener('click',function(e) {
						e.stopPropagation();
					});
					this.position();
					window.addEventListener('resize',function() {
						self.position();
					});
					var header = document.createElement("div");
						header.className = "Pictre-upload-header";
						header.innerHTML = "Upload";
					var input = document.createElement("input");
						input.type = "file";
						input.multiple = true;
					var p = document.createElement("p");
						p.innerHTML = "Drag and drop your files here. Or simply, click to select files from your device.";
					var shader = document.createElement("div");
						shader.className = "Pictre-upload-area-shader";
						shader.appendChild(p);
					var progress = document.createElement("div");
						progress.className = "Pictre-upload-area-progress";
					var area = document.createElement("div");
						area.className = "Pictre-upload-area";
						area.appendChild(shader);
						area.appendChild(progress);
						this.div.appendChild(header);
						this.div.appendChild(area);
						area.style.marginLeft = (-area.clientWidth / 2)+"px";
						area.style.marginTop = (-area.clientHeight / 2 + 20)+"px";
						area.addEventListener('dragover',function(e) {
							e.preventDefault();
							if(!area.locked) area.style.background = "rgb(52,56,55)";
						});
						area.addEventListener('click',function() {
							if(!area.locked) {
								input.click();
							}
						});
						area.addEventListener('drop',function(e) {
							upload(e);
						});
						input.addEventListener('change',function() {
							upload();
						});
						function upload(e) {
							if(e) e.preventDefault();
							if(!area.locked) {
								var files;
								if(e) {
									files = e.dataTransfer.files;
								} else {
									files = input.files;
								}
								Pictre._storage.overlay.locked = true;
								area.locked = true;
								area.style.background = "rgb(40,43,42)";
								progress.style.background = "rgb(66,29,77)";
								progress.style.width = "0";
								if(files.length == 1) {
									p.innerHTML = "Uploading "+files[0].name+"...";
								} else {
									p.innerHTML = "Uploading "+files.length+" images...";
								}
								var post = self.post(files,function(e) {
									if(e.response == "success") {	
										if(e.ignored.length > 0) {
											if(!e.pending.length) {
												p.innerHTML = "None of the files were uploaded because none of them were images...";
											} else {
												p.innerHTML = "Hey! only "+e.pending.length+" files were uploaded because "+e.ignored.length+" of them were not images.";
											}
										} else {
											p.innerHTML = "Yay! All of your images have been uploaded!";
											progress.style.background = "rgb(23,68,20)";
										}
										Pictre.get.db("all",function(data) {
											Pictre.load(data);
										});
									} else {
										p.innerHTML = e.response;
									}
									area.locked = false;
									Pictre._storage.overlay.locked = false;
								});
								if(post) {
									post.upload.addEventListener('progress',function(e) {
										if(e.lengthComputable) {
											var percent = parseInt(e.loaded / e.total * 100);
											progress.style.width = percent+"%";
										}
									});
									post.upload.addEventListener('load',function() {
										p.innerHTML = "Moving images into place...";
									});
									post.upload.addEventListener('error',function() {
										p.innerHTML = "There was an error uploading your images! Don't worry though, it's not your fault.";
									});
								} else {
									area.locked = false;
									Pictre._storage.overlay.locked = false;
									p.innerHTML = "No files were uploaded because none of the files you are trying to upload are images...";
								}
							}
						};
				},
				position:function() {
					if(this.div) {
						this.div.style.left = (window.innerWidth/2 - (this.div.clientWidth/2))+"px";
						this.div.style.top = (window.innerHeight/2 - (this.div.clientHeight/2))+"px";
					}
				},
				post:function(a,b) {
					var Files = {
						pending:[],
						ignored:[],
						total:a,
						response:null
					};
					for(var i=0;i<a.length;i++) {
						if(a[i].type.split("/")[0] == "image") {
							Files.pending.push(a[i]);
						} else {
							Files.ignored.push(a[i]);
						}
					}
					if(Files.pending.length) {
						var data = new FormData();
						for(var i=0;i<Files.pending.length;i++) {
							data.append(i,Files.pending[i]);
						}
						this.response = Files;
						var xhr = new XMLHttpRequest();
							xhr.open("POST","data/data.php",true);
							xhr.upload.addEventListener("progress");
							xhr.send(data);
							xhr.addEventListener('readystatechange',function() {
								if(xhr.status == 200 && xhr.readyState == 4) {
									Files.response = xhr.responseText;
									if(typeof b == "function") b.call(this,Files);
								}
							});
						return xhr;
					} else {
						return false;
					}
				},
				remove:function() {
					document.body.removeChild(this.div);
					this.div = null;
				}
			}
		}
	},
	gallery:{
		feature:function(a) {
			var self = Pictre;
			var pic = document.createElement("div");
				pic.className = "Pictre-overlay-pic";
				pic.data = a.data;
				pic.innerHTML = "Loading...";
				self._storage.overlay.image = pic;
				self._storage.overlay.iterator = a.data.id;
				self.gallery.overlay.get(a).add(pic);
		},
		get:{
			all:function() {
				return this.images;
			},
			total:function() {
				return this.images.length;
			}
		},
		is:{
			featuring:false
		},
		images:[],
		load:function(a) {
			
		},
		onready:function(){},
		overlay:{
			get:function(a) {
				if(a) a.style.opacity = "0.1";
				Pictre.gallery.is.featuring = true;
				var overlay = document.createElement("div");
					overlay.className = "Pictre-overlay";
					overlay.style.display = "none";
					overlay.tabIndex = "1";
					overlay.addEventListener('click',exit);
				function exit() {
					if(!Pictre._storage.overlay.locked) {
						if(a) a.style.opacity = "1.0";
						Pictre.gallery.is.featuring = false;
						Pictre.remove(overlay);
					}
				}
				overlay.add = function(b) {
					var self = this;
					var img = new Image();
						img.src = b.data.src;
						img.addEventListener('click',function(e) {
							if(Pictre._storage.pictures[Pictre._storage.overlay.iterator+1]) {
								e.stopPropagation();
								Pictre._storage.overlay.iterator++;
								this.src = Pictre._storage.pictures[Pictre._storage.overlay.iterator].data.src;
							}
						});
						overlay.addEventListener('keydown',function(e) {
							if(e.keyCode == 39 || e.keyCode == 32 || e.keyCode == 38) {
								if(Pictre._storage.pictures[Pictre._storage.overlay.iterator+1]) {
									e.stopPropagation();
									e.preventDefault();
									Pictre._storage.overlay.iterator++;
									img.src = Pictre._storage.pictures[Pictre._storage.overlay.iterator].data.src;
								}
							} else if(e.keyCode == 37 || e.keyCode == 40) {
								if(Pictre._storage.pictures[Pictre._storage.overlay.iterator-1]) {
									e.stopPropagation();
									e.preventDefault();
									Pictre._storage.overlay.iterator--;
									img.src = Pictre._storage.pictures[Pictre._storage.overlay.iterator].data.src;
								}
							} else if(e.keyCode == 27) {
								exit();
							}
						});
						img.addEventListener('load',function() {
							b.innerHTML = "";
							b.appendChild(img);
							Pictre.gallery.overlay.image.position(b);
						});
					overlay.appendChild(b);
				};
				document.body.appendChild(overlay);
				$(overlay).fadeIn(Pictre._settings.speed);
				overlay.focus();
				return overlay;
			},
			image:{
				get:function() {
					return Pictre._storage;
				},
				position:function(a) {
					var img = a.childNodes[0];
					var width = img.width;
					var height = img.height;
					if(img.width > 700) {
						var w = img.width;
						var h = img.height;
						width = 700;
						height = 700 * h / w;
					}
					var offset = window.innerHeight - height;
					a.style.width = width+"px";
					a.style.marginTop = (offset/2)+"px";
				}
			}
		}
	},
	init:function(a) {
		if(a) this.set.wrapper(a);
		Pictre.get.db("all",function(data) {
			Pictre.load(data);
		});
	},
	load:function(a) {
		var self = this;
		if(a) {
			this._storage.iterator = 0;
			this._storage.pictures = [];
			while(Pictre._settings.wrapper.hasChildNodes()) {
				Pictre._settings.wrapper.removeChild(Pictre._settings.wrapper.lastChild);
			}
			for(var i=0;i<a.length;i++) {
				Pictre.gallery.images[i] = a[i];
				Pictre.create.picture(a[i]);
			}
			if(!Pictre.gallery.images.length) {
				Pictre._404.put();				
			}
		}
		return {
			in:function(b) {
				Pictre.set.wrapper(b);
			}
		};
	},
	properties:{
		className:"Pictre-pic"
	},
	remove:function(a,b) {
		document.body.removeChild(a);
		if(typeof b == "function") b.call(Pictre);
	},
	set:{
		wrapper:function(a,b) {
			Pictre._settings.wrapper = a;
			if(typeof b == "function") b.call(Pictre);
		}
	}
};
window.Pictre = Pictre;
window.onload = function() {
	var top = document.getElementById("top");
	var wrapper = document.getElementById("picture-wrapper");
	Pictre.init(wrapper);
	top.addEventListener('click',function() {
		Pictre.get.ui.upload.put();
	});
};