window.onload = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var GroundProto = {
		x:0,y:0,width:0,height:0,isGround:true,isStatic:true,isSolid:true,color:"rgba(0,0,0,0.5)",chars:0,fallsDown:false
	}
	
	function Char() {
		this.x = 20;
		this.y = canvas.height/1.5;
		this.groundY = 0;
		this.width = 32;
		this.height = 32;
		this.weight = 12.2;
		this.speed = 0.7;
		this.hasGravity = true;
		this.accelY = 1;
		this.isJumping = false;
		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isMovingUp = false;
		this.color = "black";
		this.spawn = function() {
			var img = new Image();
			img.src = "css/i/char.png";
			ctx.drawImage(img,this.x,this.y,this.width,this.height);
		};
	}
	function Ground(chars,a,b,c,d) {
		this.x = a;
		this.y = b;
		this.width = c;
		this.height = d;
		this.chars = chars;
		this.draw = function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
			for(var i=0;i<this.chars.length;i++) {
				if(this.chars[i].y + this.chars[i].height >= this.y && this.chars[i].y + this.chars[i].height < this.y + this.height && this.chars[i].x + this.chars[i].width > this.x && this.chars[i].x < this.x + this.width) {
					if(this.isSolid) {
						this.chars[i].accelY = 0;
						this.chars[i].isJumping = false;
						if(!this.isStatic) {
							if(this.direction) {
								this.chars[i].y = this.y - this.chars[i].height;
							} else {
								this.chars[i].x += this.speed;
							}
						}
						if(this.fallsDown) {
							this.y += 0.5*(game.gravity/this.chars[i].weight);
						}
					}
				}
				if(this.chars[i].y > this.y && this.chars[i].y <= this.y + this.height && this.chars[i].x + this.chars[i].width >= this.x && this.chars[i].x <= this.x + this.width) {
					this.chars[i].isJumping = false;
					this.chars[i].isMovingUp = false;
				}		
			}
		};
	};
	function Platform(chars,a,b,c,d) {
		this.x = a;
		this.y = b;
		this.width = c;
		this.height = d;
		this.chars = chars;
		this.direction = 0;
		this.isStatic = false;
		this.isMoving = false;
		this.speed = 0.7;
		this.maxX = 0;
		this.minX = 0;
		this.maxY = 0;
		this.minY = 0;
	}
	function Item(chars) {
		this.x = 0;
		this.y = 0;
		this.width = 32;
		this.height = 32;
		this.isCollectible = true;
		this.isCollected = false;
		this.isGoal = true;
		this.chars = chars;
		this.draw = function() {
			if(!this.isCollected) {
				var img = new Image();
				img.src = "css/i/flower.png";
				ctx.drawImage(img,this.x,this.y,this.width,this.height);
			}
			for(var i=0;i<this.chars.length;i++) {
				if(this.chars[i].x + this.chars[i].width >= this.x && this.chars[i].x <= this.x + this.width && this.chars[i].y + this.chars[i].height >= this.y && this.chars[i].y + this.chars[i].height <= this.y + this.height) {
					this.isCollected = true;
					if(this.isGoal) {
						game.win = true;
					}
				}
			}
		};
	}
	Ground.prototype = GroundProto;
	Platform.prototype = new Ground;
	Platform.prototype.constructor = Platform;
	function Game() {
		this.gravity = 9.81;
		this.speed = 1;
		this.win = false;
		this.over = false;
		this.paused = false;
		this.reset = function() {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			game.over = false;
			game.win = false;
			game.run();
		};
		this.gameOver = function() {
			ctx.fillStyle = "white";
			ctx.font = "bold 2em helvetica";
			ctx.textAlign = "center";
			ctx.fillText("Game Over",canvas.width/2,canvas.height/2);
			var game = new Game();
			setTimeout(function() {game.reset();},2000);
		};
		this.showWin = function() {
			ctx.fillStyle = "white";
			ctx.font = "bold 2em helvetica";
			ctx.textAlign = "center";
			ctx.fillText("yay... you win",canvas.width/2,canvas.height/2);
			var game = new Game();
			setTimeout(function() {game.reset();},2000);
		};
		this.run = function() {
			var timeout;
			var chars = [];
			var item = [];
			var ground = [];
			chars[0] = new Char();
			ground[0] = new Ground(chars,0,canvas.height - 26,205,26);
			ground[1] = new Ground(chars,450,canvas.height - 26,350,26);
			ground[2] = new Platform(chars,280,canvas.height - 26,50,26);
				ground[2].minX = ground[2].x - ground[2].width;
				ground[2].maxX = ground[2].x + (ground[2].width*2);
			ground[3] = new Ground(chars,660,420,50,26);
			ground[4] = new Platform(chars,720,375,50,26);
				ground[4].direction = 1;
				ground[4].minY = ground[4].y-30;
				ground[4].maxY = ground[4].y + (ground[4].height*2);
				ground[4].speed = 0.5;
			ground[5] = new Ground(chars,400,300,60,26);
				ground[5].fallsDown = true;
			ground[6] = new Platform(chars,500,300,60,26);
				ground[6].minX = ground[6].x-30;
				ground[6].maxX = ground[6].x + (ground[6].width*2.4);
			ground[7] = new Ground(chars,103,298,262,44);
				ground[7].color = "transparent";
			ground[8] = new Ground(chars,0,252,100,44);
				ground[8].color = "transparent";
			item[0] = new Item(chars);
				item[0].x = 40;
				item[0].y = 222;
			loop();		
			function loop() {
				ctx.clearRect(0,0,canvas.width,canvas.height);
				for(var i=0;i<chars.length;i++) {
					if(chars[i].hasGravity) {
						chars[i].y += chars[i].accelY*(chars[i].weight / game.gravity);
					}
					if(chars[i].y > canvas.height) {
						game.over = true;
					}
					if(chars[i].isMovingRight && chars[i].x+chars[i].width <= canvas.width) {
						chars[i].x += chars[i].speed;
					}
					if(chars[i].isMovingLeft && chars[i].x >= 0) {
						chars[i].x -= chars[i].speed;
					}
					if(chars[i].isMovingUp && !chars[i].isJumping) {
						chars[i].y -= 1.27*(chars[i].height / chars[i].weight);
					}
					chars[i].spawn();
					chars[i].accelY = 1;
				}
				
				for(var i=0;i<ground.length;i++) {
					ground[i].draw();
					if(!ground[i].isStatic) {
						if(ground[i].direction == 0) {
							if(ground[i].x >= ground[i].maxX || ground[i].x <= ground[i].minX) {
								ground[i].speed = -1*ground[i].speed;
							}
							ground[i].x += ground[i].speed;
						} else if(ground[i].direction == 1) {
							if(ground[i].y <= ground[i].minY || ground[i].y >= ground[i].maxY) {
								ground[i].speed = -1*ground[i].speed;
							}
							ground[i].y += ground[i].speed;
						}
					}
				}
				
				for(var i=0;i<item.length;i++) {
					item[i].draw();
				}
				if(game.over) {
					clearTimeout(timeout);
					game.gameOver();
				} else if(game.win) { 
					clearTimeout(timeout);
					game.showWin();
				} else {
					if(!game.paused) {
						timeout = setTimeout(loop,game.speed);
					}
				}
			}
			window.onkeydown = function(e) {
				if(e.keyCode == 39) {
					chars[0].isMovingRight = true;
				}
				if(e.keyCode == 38) {
					if(!chars[0].isJumping && chars[0].accelY == 0) {
						chars[0].isMovingUp = true;
						setTimeout(function() {chars[0].isMovingUp = false;chars[0].isJumping = true;},240);
					}
				}
				if(e.keyCode == 37) {
					chars[0].isMovingLeft = true;
				}
				if(e.keyCode == 82) {
					clearTimeout(timeout);
					game.run();
				} else if(e.keyCode == 80) {
					if(game.paused) {
						game.paused = false;
						timeout = setTimeout(loop,game.speed);
					} else {
						game.paused = true;
						clearTimeout(timeout);
					}
				}
			};
			
			window.onkeyup = function(e) {
				if(e.keyCode == 39) {
					chars[0].isMovingRight = false;
				}
				if(e.keyCode == 38) {
					chars[0].isMovingUp = false;
					chars[0].isJumping = true;
				}
				if(e.keyCode == 37) {
					chars[0].isMovingLeft = false;
				}
			};
		};
	}
	
	var game = new Game();
	game.run();
};