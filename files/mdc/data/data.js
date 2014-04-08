window.onload = function() {
	var anim = new Animation(300);
	var note = new Notification("Aren't you glad it's not your birthday?");
	var back = new Notification("Happy Mother's Day!");
	var wrap = document.getElementById("intro-wrapper");
	var ready = true;
	back.set.style(2);
	back.set.display("none");
	back.set.wrapper(wrap);
	back.add.paragraph(". . .");
	back.add.paragraph("<span id='video-embed'><span></span></span>").on('click',function() {
		if(!back.is.flipped && ready) {
			ready = false;
			document.getElementById("video-embed").innerHTML = '<object width="544" height="306"><param name="movie" value="http://www.youtube.com/v/9J0o65u73Nc?version=3&amp;hl=en_US&start=30&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/9J0o65u73Nc?version=3&amp;hl=en_US&start=30&autoplay=1" type="application/x-shockwave-flash" width="544" height="306" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
		}
	});
	back.add.paragraph(". . .");
	back.add.button("Back to Front").on('click',function() {
		back.container.removeEventListener('click',arguments.callee,false);
		document.getElementById("video-embed").innerHTML = "<span id='video-embed'><span></span></span>";
		anim.unflip(back,note);
	});
	back.create();
	note.set.style(2);
//	note.set.display("none");
	note.set.wrapper(wrap);
	note.add.paragraph("<img src='http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/256/Kitchen-Birthday-cake-icon.png'/>");
	note.add.paragraph(". . .");
	note.add.paragraph("<span class='cursive'>This may seem like an ordinary card, but this is not Hallmark! Go ahead and tap on the button below!</span>");
	note.add.button("Flip Card").on('click',function() {
		ready = true;
		anim.flip(note,back);
	});
	note.create();
};