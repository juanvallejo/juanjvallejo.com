window.onload = function() {
	//slider logic
	var slider = {
		control:document.getElementsByClassName('carousel-control'),
		self:document.getElementById('carousel-slides'),
		slides:[],
		size:8,
		slide:{
			current:0,
			add:function(amount,callback) {
				if(typeof amount == 'function') {
					callback = amount;
					amount = null;
				}

				if(amount > 0 || amount === null) {
					var slide = document.createElement('div');
					slide.className = 'item'+(!slider.slides.length ? ' active':'');
					slide.style.cssFloat = 'left';
					slide.add = function(error) {
						var container = document.createElement('div');
						container.className = 'container';

						var caption = document.createElement('div');
						caption.className = 'carousel-caption';
						slider.slides.push(this);
						if(!error && amount && amount-1 > 0) slider.slide.add(amount-1,callback);
						else callback.call(this,error,slider.slides);
					};

					var img = new Image();
					img.src = '../img/thumbs/'+(slider.slides.length+1)+'.jpg';
					img.addEventListener('load',function() {
						this.className = 'img-responsive';
						slide.appendChild(this);
						slide.add();
					});
					img.addEventListener('error',function(e) {
						console.log('Error adding image.');
						console.log(e);
						slide.add('There was an error adding this image to the slider array.');
					});
				}
			},
			next:function() {
				var current = slider.self.children[slider.slide.current];
				current.style.display = "none";

				if(slider.slide.current == slider.size-1) {
					slider.slide.current = -1;
				}

				var next = slider.self.children[++slider.slide.current];
				next.style.display = "block";
			},
			previous:function() {
				var current = slider.self.children[slider.slide.current];
				current.style.display = "none";

				if(slider.slide.current == 0) {
					slider.slide.current = slider.size;
				}

				var next = slider.self.children[--slider.slide.current];
				next.style.display = "block";
			},
			remove:function(index) {

			}
		},
		init:function() {
			var self = this;

			self.slide.add(self.size,function(err,slides) {
				slides.forEach(function(slide) {
					slider.self.appendChild(slide);
				});
			});

			slider.control[0].addEventListener('click',function() {
				slider.slide.previous();
			});
			slider.control[1].addEventListener('click',function() {
				slider.slide.next();
			});
		}
	};

	//make page slide to local href instead of jumping
	var a = document.getElementsByTagName('a');
	var triggs = ['#register','#pics'];

	for(var i=0;i<a.length;i++) {
		a[i].addEventListener('click',function(e) {
			var attr = this.getAttribute('href');
			if(triggs.indexOf(attr) != -1) {
				e.preventDefault();
				$('html,body').animate({scrollTop:$(attr).offset().top},1000);
			}
		});
	}

	//init slider
	slider.init();
};