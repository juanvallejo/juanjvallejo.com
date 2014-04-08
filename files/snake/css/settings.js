$(document).ready(function() {
	var speed = 10;
	var range = 22;
	var doc = $(document);
	var snake = $('#snake');
	var prey = $('#prey');
	var x = snake.css('left').split("px")[0];
	var y = snake.css('top').split("px")[0];
	var preyX = Math.floor(Math.random()*(doc.width()-(prey.width())-50))+50;
	var preyY = Math.floor(Math.random()*(doc.height()-(prey.height())-50))+50;
	var width = snake.width();
	var loop;
	var moving;
	var running = false;
	
	prey.css({'left':preyX+'px','top':preyY+'px'});
	
	doc.keydown(function(e) {
		if(e.keyCode == 39 && moving != "right" && moving != "left") {
			right();
			moving = "right";
			running = true;
		}
	});
	
	doc.keydown(function(e) {
		if(e.keyCode == 37 && moving != "left" && moving != "right") {
			left();
			moving = "left";
			running = true;
		} else if(e.keyCode == 40 && moving != "down" && moving != "up") {
			down();
			moving = "down";
			running = true;
		} else if(e.keyCode == 38 && moving != "up" && moving != "down") {
			up();
			moving = "up";
			running = true;
		} if(e.keyCode == 32) {
			window.location.reload();
		}
	});
	
	function right() {
		snake.css({'left':x+'px'});
		x++;
		if(x < (doc.width()-snake.width())-2) {
			if(running) {
				clearTimeout(loop);
			}
			if(y <= (preyY+range) && y >= (preyY-range) && x <= (preyX+range) && x >= (preyX-range)) {
				eat();
			}
			loop = setTimeout(right,speed);
		} else {
			moving = null;
			running = false;
			kill();
		}
	}
	
	function left() {
		snake.css({'left':x+'px'});
		x--;
		if(x > -2) {
			if(running) {
				clearTimeout(loop);
			}
			if(y <= (preyY+range) && y >= (preyY-range) && x <= (preyX+range) && x >= (preyX-range)) {
				eat();
			}
			loop = setTimeout(left,speed);
		} else {
			moving = null;
			running = false;
			kill();
		}
	}
	
	function down() {
		snake.css({'top':y+'px'});
		y++;
		if(y < (doc.height()-snake.height())-2) {
			if(running) {
				clearTimeout(loop);
			}
			if(y <= (preyY+range) && y >= (preyY-range) && x <= (preyX+range) && x >= (preyX-range)) {
				eat();
			}
			loop = setTimeout(down,speed);
		} else {
			moving = null;
			running = false;
			kill();
		}
	}
	
	function up() {
		snake.css({'top':y+'px'});
		y--;
		if(y > 0) {
			if(running) {
				clearTimeout(loop);
			}
			if(y <= (preyY+range) && y >= (preyY-range) && x <= (preyX+range) && x >= (preyX-range)) {
				eat();
			}
			loop = setTimeout(up,speed);
		} else {
			moving = null;
			running = false;
			kill();
		}
	}
	
	function kill() {
		snake.hide();
		$('#kill').fadeIn('normal').html("Game Over");
	}
	
	function eat() {
		preyX = Math.floor(Math.random()*(doc.width()-(prey.width())-50))+50;
		preyY = Math.floor(Math.random()*(doc.height()-(prey.height())-50))+50;
		prey.css({'left':preyX+'px','top':preyY+'px'});
		if(speed > 1) {
			width+=20;
			snake.css({'width':width});
			speed-=0.25;
		}
	}
});