var status = 'loading';
WebFontConfig = {
	google: { families: [ 'Aldrich::latin' ] },
	loading:function(a,b) {
		status = 'loading';
	},
	fontactive:function(a,b) {
		status = 'loaded';
	},
	inactive:function(a,b) {
		status = 'failed';
	}
};
var Browser = {
	name:'Unknown',
	os:navigator.platform,
	online:navigator.onLine,
	id:null,
	checked:false
};
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
window.onload = function() {
	var canvas = document.getElementById("canvas");
	canvas.tabIndex = 1;
	var ctx = canvas.getContext("2d");
	var timeout;
	function Menu(a) {
		var self = this;
		this.id = undefined;
		this.i = 0;
		this.options = [];
		this.title = a || "Untitled menu";
		this.wrapper = document.getElementById("canvas-wrapper");
		this.container = document.createElement("div");
		this._addOption = function(a) {
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
		this.on = function(a,b) {
			this.container.addEventListener(a,function(e) {
				b.call(self,e);
			});
		};
		this.remove = function() {
			if(this.wrapper.removeChild(this.container)) {
				this.container = null;
				canvas.focus();
			}
		};
		this.hide = function() {
			this.container.style.display = "none";
		};
		this.show = function(a) {
			this.container.style.display = a || "block";
		};
		this.option = function(a) {
			return this.options[a-1];
		};
		this.input = function(a) {
			return this.options[a-1].getElementsByTagName("input")[0];
		};
		this.addText = function(a) {
			this._addOption(a);
			this.options[this.i-1].className = "text";
			return this.options[this.i-1];
		};
		this.addOption = function(a) {
			this._addOption(a);
			return this.options[this.i-1];
		};
		this.addInput = function(a) {
			var input = document.createElement("input");
			input.placeholder = a;
			this._addOption(function() {
				this.appendChild(input);
			});
			this.options[this.i-1].className = "text";
			this.options[this.i-1].input = function() {
				return input;
			};
			this.options[this.i-1].input().on = function(a,b) {
				this.addEventListener(a,function(e) {
					b.call(this,e);
				});
			};
			return input;
		};
		this.create = function(a,b) {
			if(this.id) {
				this.container.id = this.id;
			}
			this.container.className = "menu";
			var header = document.createElement("div");
				header.className = "menu-header";
				header.innerHTML = "<p>"+this.title+"</p>";
			var ul = document.createElement("ul");
			for(var i=0;i<this.options.length;i++) {
				if(this.options[i].num == this.options.length-1) {
					this.options[i].style.borderBottom = "0";
				}
				ul.appendChild(this.options[i]);
			}
			this.container.appendChild(header);
			this.container.appendChild(ul);
			this.wrapper.appendChild(this.container);
			this.container.focus();
			ul.style.marginTop = ((this.container.clientHeight-ul.clientHeight)/2)+"px";
			return this;
		};
		this.container.tabIndex = 1;
	}
	function Paddle() {
		this.width = 15;
		this.height = 80;
		this.color = "white";
		this.posY = parseInt(canvas.height/2)-(this.height/2);
		this.posX = 0;
		this.isMovingUp = false;
		this.isMovingDown = false;
		this.moveSpeed = 2;
		this.upKey = null;
		this.downKey = null;
		this.draw = function(a,b,c,d) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.posX,this.posY,this.width,this.height);
		}
	}
	function Ball() {
		this.radius = 12;
		this.height = this.radius;
		this.x = 0;
		this.y = parseInt(canvas.height/2)-this.height;
		this.incX = 2;
		this.incY = 1.7;
		this.color = "white";
		this.draw = function() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
			ctx.fill();
		};
	}
	function Score() {
		this.x = 35;
		this.y = 60;
		this.value = 0;
		this.color = "white";
		this.align = "left";
		this.draw = function() {
			ctx.textAlign = "left";
			ctx.fillStyle = this.color;
			ctx.font = "normal 2em 'Aldrich'";
			ctx.fillText(this.value,this.x,this.y);
		};
	}
	function Game() {
		var self = this;
		this._init = null;
		this.ai = true;
		this.bgImageURI = "url(data/i/bg.png)";
		this.controls = {
			player1:{
				up:38,
				down:40
			},
			player2:{
				up:87,
				down:83
			}
		};
		this.difficulty = 24;
		this.exited = false;
		this.goal = 5;
		this.loaded = false;
		this.menu = null;
		this.paused = false;
		this.pauseMenuOpen = false;
		this.speed = 1;
		this.timeout = null;
		this.setControls = function(a) {
			var a = a || 1;
			var charkey = {
				"%":"Left Arrow",
				"&":"Up Arrow",
				"\'":"Right Arrow",
				"(":"Down Arrow"
			};
			var charUp = charkey[String.fromCharCode(game.controls["player"+a].up)] || String.fromCharCode(game.controls["player"+a].up);
			var charDown = charkey[String.fromCharCode(game.controls["player"+a].down)] || String.fromCharCode(game.controls["player"+a].down);
			var menu = new Menu("Control Settings (Player "+a+")");
			menu.addText("To change a control for player "+a+", enter the desired key below:");
			menu.addInput("Move up ("+charUp+")").maxLength = 1;
			menu.addInput("Move down ("+charDown+")").maxLength = 1;
			menu.addOption("Back To Settings").on('click',function() {
				if(menu.option(2).input().value != "") {
					if(menu.option(2).input().data) {
						game.controls["player"+a].up = menu.option(2).input().data;
					} else {
						game.controls["player"+a].up = menu.option(2).input().value.toUpperCase().charCodeAt(0);
					}
				}
				if(menu.option(3).input().value != "") {
					if(menu.option(3).input().data) {
						game.controls["player"+a].up = menu.option(3).input().data;
					} else {
						game.controls["player"+a].down = menu.option(3).input().value.toUpperCase().charCodeAt(0);
					}
				}
				menu.remove();
				game.settings();
			});
			menu.option(2).input().on('keydown',function(e) {
				if(e.keyCode != 9) {
					this.value = "";
				}
				if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
					this.value = e.keyIdentifier+" Arrow";
					this.data = e.keyCode;
				} else {
					this.data = null;
				}
			});
			menu.option(3).input().on('keydown',function(e) {
				if(e.keyCode != 9) {
					this.value = "";
				}
				if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
					this.value = e.keyIdentifier+" Arrow";
					this.data = e.keyCode;
				} else {
					this.data = null;
				}
			});
			menu.create();
		};
		this.setScoreLimit = function() {
			var menu = new Menu("Change score limit");
			menu.addText("The current score limit is "+game.goal);
			menu.addInput("Enter a new score limit");
			menu.addOption("Back To Settings").on('click',function() {
				menu.remove();
				if(menu.option(2).input().value != "") {
					var goal = parseInt(menu.option(2).input().value);
					if(goal < 99) {
						game.goal = goal;
					} else {
						game.goal = 99;
					}
				}
				game.settings();
			});
			menu.create();
		};
		this.settings = function() {
			var menu = new Menu("Change settings");
			menu.addOption("Change Score Limit ("+game.goal+")").on('click',function() {
				menu.remove();
				game.setScoreLimit();
			});
			menu.addOption("Change Player 1 Controls").on('click',function() {
				menu.remove();
				game.setControls(1);
			});
			menu.addOption("Change Player 2 Controls").on('click',function() {
				menu.remove();
				game.setControls(2);
			});
			menu.addOption("Back To Menu").on('click',function() {
				menu.remove();
				canvas.style.backgroundImage = "";
				game.splash();
			});
			menu.create().on('keydown',function(e) {
				if(e.keyCode == 27) {
					menu.remove();
					game.splash();
				}
			});
		};
		this.detectBrowser = function() {
			if(navigator.userAgent.indexOf("AppleWebKit") != -1) {
				if(navigator.userAgent.indexOf("Chrome") != -1) {
					Browser.name = "Chrome";
					Browser.id = 1;
				} else {
					if(navigator.userAgent.indexOf("Mobile") != -1) {
						Browser.name = "Mobile Safari";
						Browser.id = 3;
					} else {
						Browser.name = "Safari";
						Browser.id = 2;
					}
				}
			} else {
				if(navigator.userAgent.indexOf("Firefox") != -1) {
					Browser.name = "Firefox";
					Browser.id = 4;
				} else if(navigator.userAgent.indexOf("Opera") != -1) {
					Browser.name = "Opera";
					Browser.id = 5;
				} else if(navigator.userAgent.indexOf("MSIE ") != -1) {
					if(navigator.userAgent.indexOf("Trident") != -1) {
						var nav = navigator.userAgent.split(";")[1];
						nav = parseInt(nav.split(" ")[2]);
						Browser.name = "Internet Explorer "+nav;
						if(nav > 8) Browser.id = 6;
						else Browser.id = 7
					} else {
						Browser.name = "Internet Explorer (Old)";
						Browser.id = 8;
					}
				}
			}
			if(Browser.id != 1 && !Browser.checked) {
				Browser.checked = true;
				var menu = new Menu("You are using "+Browser.name);
				if(Browser.id == 7 || Browser.id == 8) {
					menu.addText("");
					menu.addText("Unfortunately Canvas Pong is not supported in your browser, please consider upgrading to Google Chrome for an optimal browsing experience.").on('click',function() {
						window.open("http://chrome.google.com","_blank");
					});
					menu.addText("");
				} else if(Browser.id == 3) {
					menu.addText("Canvas Pong has not been optimized to work on mobile devices. The game will run but will be unplayable in your current device.").on('click',function() {
						menu.remove();
					});
					menu.addOption("Tap here to continue").on('click',function() {
						menu.remove();
					});
				} else {
					menu.addOption("While Canvas Pong will work in your current browser, Canvas Pong is better optimized to run on Google Chrome.").on('click',function() {
						menu.remove();
					});
					menu.addOption("Click here to continue").on('click',function() {
						menu.remove();
					});
				}
				menu.create();
			}
		};
		this.pause = function() {
			if(game.paused && !game.pauseMenuOpen) {
				game.resume();
			} else {
				clearTimeout(game.timeout);
				game.pauseMenuOpen = true;
				canvas.onclick = null;
				game.paused = true;
				var menu = new Menu("Game paused");
				menu.addOption("Resume").on('click',function() {
					menu.remove();
					game.resume();
					game.pauseMenuOpen = false;
				});
				menu.addOption("Restart").on('click',function() {
					menu.remove();
					game.start();
				});
				menu.addOption("Quit").on('click',function() {
					menu.remove();
					ctx.clearRect(0,0,canvas.width,canvas.height);
					canvas.style.backgroundImage = "";
					game.exited = true;
					game.splash();
				});
				menu.create();
				menu.on('keydown',function(e) {
					if((e.keyCode == 27 && Browser.id != 2) || e.keyCode == 80 || e.keyCode == 82) {
						menu.remove();
						game.resume();
						game.pauseMenuOpen = false;
					}
				});
			}
		};
		this.resume = function() {
			game.paused = false;
			game._init();
		};
		this.setDifficulty = function() {
			var menu = new Menu("Choose a difficulty setting");
			menu.addOption("Easy").data = 24;
			menu.addOption("Medium").data = 26;
			menu.addOption("Hard").data = 28;
			menu.create();
			menu.on('keydown',function(e) {
				if(e.keyCode == 27) {
					menu.remove();
					game.splash();
				}
			});
			for(var i=0;i<menu.options.length;i++) {
				menu.options[i].onclick = function() {
					game.difficulty = this.data;
					game.start();
					menu.remove();
				};
			}
		};
		this.win = function(player) {
			game.exited = true;
			if(player == "Computer") {
				var win = "wins!"; 
			} else {
				var win = game.ai === true ? "win!" : "wins!";
			}
			var menu = new Menu(player+" "+win);
			menu.addOption("New Game").on('click',function() {
				menu.remove();
				game.setDifficulty();
			});
			menu.addOption("Back To Menu").on('click',function() {
				menu.remove();
				ctx.clearRect(0,0,canvas.width,canvas.height);
				canvas.style.backgroundImage = "";
				game.exited = true;
				game.splash();
			});
			menu.addOption("Buy Game").on('click',function() {
				window.open("http://codecanyon.net/user/juuanv/profile","_blank");
			});
			menu.create();
		};
		this.splash = function(e) {
			_splash();
			game.detectBrowser();
			function _splash() {
				ctx.textAlign = "center";
				if(status == 'loaded') {
					_init();
				} else if(status == 'loading') {
					if(!game.loaded) {
						ctx.fillStyle = "white";
						ctx.font = "normal 2em sans-serif";
						ctx.fillText("Loading...",canvas.width/2,canvas.height/2+20);
						game.loaded = true;
					}
					setTimeout(_splash,500);
				} else {
					status = 'loaded';
					ctx.font = "normal 1em sans-serif";
					ctx.fillText("Failed to load web-fonts",canvas.width/2,canvas.height/2+50);
					setTimeout(_splash,2250);
				}
				function _init() {
					ctx.clearRect(0,0,canvas.width,canvas.height);
					canvas.style.backgroundColor = "rgb(4,83,7)";
					ctx.font = "normal 3.5em 'Aldrich'";
					ctx.fillStyle = "white";
					ctx.fillText("Pong",(canvas.width/2),canvas.height/2.2);
					ctx.font = "normal 1.5em 'Aldrich',impact,sans-serif";
					ctx.fillText("one player",(canvas.width/2),canvas.height/1.5);
					ctx.fillText("two player",(canvas.width/2),canvas.height/1.3);
					canvas.addEventListener('click',function(e) {
						var left = e.pageX-canvas.parentElement.offsetLeft-20;
						var top = e.pageY-canvas.parentElement.offsetTop-20;
						if(left > canvas.width/2-100 && left < canvas.width/2+100 && top < canvas.height/2+96 && top > canvas.height/2+50) {
							ctx.clearRect(0,0,canvas.width,canvas.height);
							this.removeEventListener('click',arguments.callee);
							game.ai = true;
							game.setDifficulty();
						} else if(left >= (canvas.width/2-100) && left <= canvas.width/2+100 && top >= canvas.height/2+97 && top <= canvas.height/2+140) {
							this.removeEventListener('click',arguments.callee);
							game.ai = false;
							game.start();
						} else if(left >= (canvas.width/2-100) && left <= canvas.width/2+100 && top >= canvas.height/2-70 && top <= canvas.height/2+10) {
							this.removeEventListener('click',arguments.callee);
							game.settings();
						}
					});
				}
			}
		};
		this.start = function(e) {
			canvas.style.backgroundImage = game.bgImageURI;
			canvas.style.backgroundColor = "rgb(4,83,7)";
			canvas.style.backgroundRepeat = "repeat-y";
			canvas.style.backgroundPosition = "center -5px";
			object = this;
			game.exited = false;
			game.paused = false;
			game.pauseMenuOpen = false;
			var drawPause = true;
			var paddle = new Paddle();
			var paddle2 = new Paddle();
			var score = new Score();
			var score2 = new Score();
			score2.x = canvas.width-55;
			score2.align = "right";
			paddle.upKey = game.controls.player2.up;
			paddle.downKey = game.controls.player2.down;
			paddle2.upKey = game.controls.player1.up;
			paddle2.downKey = game.controls.player1.down;
			paddle2.posX = (canvas.width-paddle2.width);
			var ball = new Ball();
			if(Browser.id == 2) {
				ball.incX *= 1.7;
				ball.incY *= 1.7;
				paddle.moveSpeed *= 1.7;
				paddle2.moveSpeed *= 1.7;
				if(game.difficulty == 28) {
					game.difficulty = 27;
				}
			} else if(Browser.id == 3) {
				ball.incX *= 7.7;
				ball.incY *= 7.7;
				paddle.moveSpeed *= 7.7;
				paddle2.moveSpeed *= 7.7;
			}
			game._init = function() {
				ctx.clearRect(0,0,canvas.width,canvas.height);
				score.draw();
				score2.draw();
				ball.draw();
				paddle.draw();
				paddle2.draw();
				ball.x+=ball.incX;
				ball.y+=ball.incY;
				if(game.ai) {
					var chance = Math.round(51*Math.random());
					var cons = game.difficulty;
					if(ball.incX > 0) {
						if((paddle.posY+paddle.height/2) < canvas.height/2) {
							if((paddle.posY+paddle.height) < canvas.height) {
								if(chance < cons) {
									if(paddle.posY+paddle.height/2+paddle.moveSpeed-canvas.height/2 < 5 && paddle.posY+paddle.height/2+paddle.moveSpeed-canvas.height/2 > 0 && (Browser.id == 2 || Browser.id == 3)) {
										paddle.posY = canvas.height/2-paddle.height/2;
									} else {
										paddle.posY += paddle.moveSpeed;
									}
								} else {
									paddle.posY += paddle.moveSpeed / 2;
								}
							}
						} else if((paddle.posY+paddle.height/2) > canvas.height/2) {
							if(paddle.posY > 0) {
								if(chance < cons) {
									paddle.posY -= paddle.moveSpeed;
								} else {
									paddle.posY -= paddle.moveSpeed / 2;
								}
							}
						}
					} else {
						if((paddle.posY+paddle.height/2) != (ball.y)) {
							if(ball.y < (paddle.posY+paddle.height/2)) {
								if(paddle.posY > 0) {
									if(chance < cons) {
										paddle.posY -= paddle.moveSpeed;
									} else {
										paddle.posY -= paddle.moveSpeed / 2;
									}
								}
							} else if(ball.y > (paddle.posY+paddle.height/2)) {
								if((paddle.posY+paddle.height) < canvas.height) {
									if(chance < cons) {
										paddle.posY += paddle.moveSpeed;
									} else {
										paddle.posY += paddle.moveSpeed / 2;
									}
								}
							}
						}
					}
				}
					if(ball.x > (canvas.width+ball.radius)) {
						score.value += 1;
						respawnBall();
					}
					if(ball.x < -2*ball.radius) {
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
					if(ball.x > 0 && ball.x <= paddle.width && ball.y <= paddle.posY + paddle.height && ball.y >= paddle.posY && ball.incX < 0) {
						ball.incX *= -1;
					}
					if(ball.x <= paddle.width && ball.y >= paddle.posY && ball.y <= paddle.posY+paddle.height && (ball.x > 0 && ball.y <= paddle.posY + paddle.height) && ball.incX < 0) {
						ball.incX *= -1;
					}
					if(ball.x + ball.radius >= (canvas.width-paddle2.width) && (ball.y >= paddle2.posY && ball.y + ball.height <= (paddle2.posY+paddle2.height+ball.radius/2)) && (ball.x < canvas.width && ball.y <= paddle2.posY + paddle2.height) &&ball.incX > 0) {
						ball.incX *= -1;
					}
					if(ball.y > (canvas.height-ball.height) || ball.y < 0) {
						ball.incY *= -1;
					}
					if(!game.paused) {
						if(score.value == game.goal || score2.value == game.goal) {
							var player;
							if(score.value > score2.value) {
								if(game.ai) {
									player = "Computer";
								} else {
									player = "Player 1";
								}
							} else {
								if(game.ai) {
									player = "You";
								} else {
									player = "Player 2";
								}
							}
							game.win(player);
						} else {
							clearTimeout(game.timeout);
							game.timeout = setTimeout(game._init,game.speed);
						}
					} else {
						if(drawPause) {
							ctx.fillStyle = this.color;
							ctx.font = "normal 2em 'Aldrich'";
							ctx.fillText("Pause",canvas.width/2-50,canvas.height/2+20);
						}
					}
				function respawnBall() {
					ball.x = 0;
					ball.y = (canvas.height/2 - ball.height);
					game.paused = true;
					drawPause = false;
					game.timeout = setTimeout(function() {drawPause=true;game.paused = false;game._init();},1000);
				}
			};
			game._init();
			canvas.onkeydown = function(e) {
				e.preventDefault();
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
					if(!game.exited && !game.pauseMenuOpen) {
						game.pauseMenuOpen = true;
						game.pause();
					}
				}
				if(e.keyCode == 80) {
					if(!game.exited && !game.pauseMenuOpen) {
						game.pauseMenuOpen = true;
						game.pause();
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
				if(!game.paused && !game.exited) {
					game.pause();					
				}
			};
		};
	}
	var game = new Game();
	if(navigator.onLine && window.location.protocol == "http:") {
		if(window.location.href.match(/juanjvallejo.com\/files\/pong/gi)) {
			game.splash();
		}
	} else {
		if(window.location.hash == "#f62b84a6ddcccbcba1ab1820367dc42b") {
			game.splash();
		} else {
			canvas.style.backgroundImage = "url(data/i/eye.gif)";
			canvas.style.backgroundRepeat = "repeat-x";
			canvas.style.backgroundPosition = "-30px 0";
			var menu = new Menu("Invalid Game Instance");
			menu.addText("");
			menu.addOption("Please click here to purchase this game.").on('click',function() {
				window.location.assign("http://codecanyon.net/user/juuanv/portfolio");
			});
			menu.addText("");
			menu.create();
		}
	}
};