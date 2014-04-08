window.onload = function() {
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
};