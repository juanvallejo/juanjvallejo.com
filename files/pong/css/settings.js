window.onload = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var timeout;
	
	function Paddle() {
		this.width = 10;
		this.height = 70;
		this.color = "white";
		this.posY = parseInt(canvas.height/2)-(this.height/2);
		this.posX = 0;
		this.isMovingUp = false;
		this.isMovingDown = false;
		this.moveSpeed = 1.5;
		this.upKey = 38;
		this.downKey = 40;
		this.draw = function(a,b,c,d) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.posX,this.posY,this.width,this.height);
		}
	}
	function Ball() {
		this.width = 10;
		this.height = 8;
		this.x = 0;
		this.y = parseInt(canvas.height/2)-this.height;
		this.incX = 2;
		this.incY = 1.5;
		this.color = "white";
		this.draw = function(a,b,c,d) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		};
	}
	function Score() {
		this.x = 25;
		this.y = 25;
		this.value = 0;
		this.color = "white";
		this.align = "left";
		this.draw = function() {
			ctx.fillStyle = this.color;
			ctx.font = "bold 1em sans-serif";
			ctx.fillText(this.value,this.x,this.y);
		};
	}
	function Game() {
		this.ai = true;
		this.goal = 10;
		this.speed = 7;
		this.win = function(player) {
			ctx.fillText(player,(canvas.width/2)-29,68);
			ctx.fillText("wins!",(canvas.width/2)-18,85);
			canvas.onclick = function() {
				var game = new Game();
				game.start();
			};
		};
		this.splash = function() {
			ctx.font = "bold 3.5em sans-serif";
			ctx.fillStyle = "white";
			ctx.fillText("Pong",(canvas.width/2.48),canvas.height/2.2);
			ctx.font = "bold 1.5em sans-serif";
			ctx.fillText("one player",(canvas.width/2.37),canvas.height/1.5);
			ctx.fillText("two player",(canvas.width/2.36),canvas.height/1.3);
			canvas.onclick = function(e) {
				var left = e.pageX-canvas.offsetLeft;
				var top = e.pageY-canvas.offsetTop;
				if(left >= (canvas.width/2.4) && left <= canvas.width/1.7 && top >= canvas.height/1.59 && top <= canvas.height/1.45) {
					game.ai = true;
				} else if(left >= (canvas.width/2.4) && left <= canvas.width/1.7 && top >= canvas.height/1.37 && top <= canvas.height/1.26) {
					game.ai = false;
				}
				game.start();
			};
		};
		this.start = function(e) {
			canvas.style.backgroundImage = "url(css/i/bg.png)";
			canvas.style.backgroundRepeat = "repeat-y";
			canvas.style.backgroundPosition = "center -5px";
			object = this;
			var exited = false;
			var paused = false;
			var paddle = new Paddle();
			var paddle2 = new Paddle();
			var score = new Score();
			var score2 = new Score();
			score2.x = canvas.width-35;
			score2.align = "right";
			paddle.upKey = 87;
			paddle.downKey = 83;
			paddle2.posX = (canvas.width-paddle2.width);
			var ball = new Ball();

			doAnimation();
			function doAnimation() {
				ctx.clearRect(0,0,canvas.width,canvas.height);
				score.draw();
				score2.draw();
				ball.draw();
				paddle.draw();
				paddle2.draw();
				ball.x+=ball.incX;
				ball.y+=ball.incY;
				if(game.ai) {
					var math = parseInt(12*Math.random());
					if(paddle.posY+ball.incY >= 0 && paddle.posY + paddle.height+ball.incY <= canvas.height) {
						if(math >=2) {
							paddle.posY += ball.incY;
						} else {
							paddle.posY += 0;
						}
					}
				}
					if(ball.x > (canvas.width+ball.width)) {
						score.value += 1;
						respawnBall();
					}
					if(ball.x < -2*ball.width) {
						ball.incX *= -1;
						score2.value += 1;
						respawnBall();
					}
					if(paddle.isMovingUp && paddle.posY >= 0) {
						paddle.posY -= paddle.moveSpeed;
					}
					if(paddle.isMovingDown && paddle.posY + paddle.height <= canvas.height) {
						paddle.posY += paddle.moveSpeed;
					}
					if(paddle2.isMovingUp && paddle2.posY >= 0) {
						paddle2.posY -= paddle.moveSpeed;
					}
					if(paddle2.isMovingDown && paddle2.posY + paddle2.height <= canvas.height) {
						paddle2.posY += paddle.moveSpeed;
					}
					if(ball.x <= paddle.width && (ball.y >= paddle.posY && ball.y + ball.height <= (paddle.posY+paddle.height)) && ball.incX < 0) {
						ball.incX *= -1;
					}
					if(ball.x + ball.width >= (canvas.width-paddle2.width) && (ball.y >= paddle2.posY && ball.y + ball.height <= (paddle2.posY+paddle2.height)) && ball.incX > 0) {
						ball.incX *= -1;
					}
					if(ball.y > (canvas.height-ball.height) || ball.y < 0) {
						ball.incY *= -1;
					}
					if(!paused) {
						if(score.value == game.goal || score2.value == game.goal) {
							var player;
							if(score.value > score2.value) {
								player = "Player 1";
							} else {
								player = "Player 2";
							}
							game.win(player);
						} else {
							clearTimeout(timeout);
							timeout = setTimeout(doAnimation,game.speed);
						}
					}
				function respawnBall() {
					ball.x = 0;
					ball.y = (canvas.height/2 - ball.height);
					paused = true;
					timeout = setTimeout(function() {paused = false;doAnimation();},1000);
				}
			}
			window.onkeydown = function(e) {
				if(!game.ai) {
					if(e.keyCode == paddle.upKey) {
						paddle.isMovingUp = true;
					}
					if(e.keyCode == paddle.downKey) {
						paddle.isMovingDown = true;
					}
				}
				if(e.keyCode == paddle2.upKey) {
					paddle2.isMovingUp = true;
				}
				if(e.keyCode == paddle2.downKey) {
					paddle2.isMovingDown = true;
				}
				if(e.keyCode == 82 || e.keyCode == 27) {
					if(!exited) {
						clearTimeout(timeout);
						exited = true;
						paused = true;
						canvas.style.background = "";
						ctx.clearRect(0,0,canvas.width,canvas.height);
						game.splash();
					}
				}
				if(e.keyCode == 80) {
					if(paused && !exited) {
						paused = false;
						doAnimation();
					} else {
						paused = true;
					}
				}
			};
			window.onkeyup = function(e) {
				if(e.keyCode == paddle.upKey) {
					paddle.isMovingUp = false;
				}
				if(e.keyCode == paddle.downKey) {
					paddle.isMovingDown = false;
				}
				if(e.keyCode == paddle2.upKey) {
					paddle2.isMovingUp = false;
				}
				if(e.keyCode == paddle2.downKey) {
					paddle2.isMovingDown = false;
				}
			};
			window.onblur = function() {
				paused = true;
			};
			canvas.onclick = function() {
				if(paused) {
					paused = false;
					doAnimation();
				} else {
					paused = true;
				}
			};
		};
	}
	
	var game = new Game();
	game.splash();
	
};