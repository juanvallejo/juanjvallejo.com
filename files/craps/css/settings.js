window.onload = function() {
	var DiceProperties = {
		posY:0,
		posX:0,
		bgImage:"url(css/i/dice_sprite.png)",
		repeat:"no-repeat"
	};
	function Dice(object) {
		this.object = object;
		this.show = function(object) {
			this.object.style.backgroundPositionY = this.posY+"px";
			this.object.style.backgroundPositionX = this.posX+"px";
			this.object.style.backgroundImage = this.bgImage;
			this.object.style.backgroundRepeat = this.repeat;
		};
	}
	Dice.prototype = DiceProperties;
	
	var diceContainer = document.getElementById("diceContainer");
	var data1 = document.getElementById("data1");
	var data2 = document.getElementById("data2");
	var score = document.getElementById("score");
	var bestScore = document.getElementById("best");
	var wins = document.getElementById("wins");
	var point = document.getElementById("playerPoint");
	var status = document.getElementById("status");
	var dice = diceContainer.getElementsByClassName("dice");
	var round = document.getElementById("round");
	var rolls = document.getElementById("rolls");
	var busy = false;
	var roundCount = 1;
	var rollCount = 0;
	var winCount = 0;
	var scoreKeeper = 0;
	var bestScoreKeeper = 0;
	var playerPoint = 0;
	var over = false;
	var d1 = new Dice(dice.item(0));
	var d2 = new Dice(dice.item(1));
	d1.posY = parseInt(-6*Math.random())*65;
	d2.posY = parseInt(-6*Math.random())*65;
	d1.show();
	d2.show();
	var origPosY = [d1.posY,d2.posY];
	var timeout = [];
	var diceReady = 0;
	diceContainer.onclick = function() {
		if(!busy) {
			if(over) {
				gameReset();
			} else {
				busy = true;
				numDiceReady = 0;
				var speed = 6;
				var limit = [parseInt(-6*Math.random())*65,parseInt(-6*Math.random())*65];
				scrollDie1();
				scrollDie2();
				function scrollDie1() {
					if(origPosY[0] > limit[0]) {
						d1.posY -= 1;
						d1.show(dice.item(0));
						if(d1.posY > limit[0]) {
							timeout[0] = setTimeout(scrollDie1,speed);
						} else {
							origPosY[0] = d1.posY;
							clearTimeout(timeout[0]);
							animFinish();
						}
					} else if(origPosY[0] == limit[0]) {
						animFinish();
					} else if(origPosY[0] < limit[0]) {
						d1.posY += 1;
						d1.show(dice.item(0));
						if(d1.posY < limit[0]) {
							timeout[0] = setTimeout(scrollDie1,speed);
						} else {
							origPosY[0] = d1.posY;
							clearTimeout(timeout[0]);
							animFinish();
						}
					}
				}
				function scrollDie2() {
					if(origPosY[1] > limit[1]) {
						d2.posY -= 1;
						d2.show(dice.item(1));
						if(d2.posY > limit[1]) {
							timeout[1] = setTimeout(scrollDie2,speed);
						} else {
							origPosY[1] = d2.posY;
							clearTimeout(1);
							animFinish();
						}
					} else if(origPosY[1] == limit[1]) {
						animFinish();
					} else if(origPosY[1] < limit[1]) {
						d2.posY += 1;
						d2.show(dice.item(1));
						if(d2.posY < limit[1]) {
							timeout[1] = setTimeout(scrollDie2,speed);
						} else {
							origPosY[1] = d2.posY;
							clearTimeout(1);
							animFinish();
						}	
					}
				}
			}
		}
		function animFinish() {
			diceReady++;
			if(diceReady==2) {
				var die1 = -1*(d1.posY/65)+1;
				var die2 = -1*(d2.posY/65)+1;
				diceReady = 0;
				rollCount++;
				rolls.innerHTML = rollCount;
				if(d1.posY == d2.posY) {
					data2.innerHTML += "You have rolled doubles!<br />";
					scoreKeeper += (5*die1);
				} else {
					data2.innerHTML += "You have rolled a "+(die1+die2)+"<br />";
				}
				if(rollCount == 1) {
					if((die1+die2) == 7 || (die1+die2) == 11) {
						winCount++;
						data2.innerHTML += "The sum on your dice is "+(die1+die2)+", you win!<br />";
						status.innerHTML = "You Win!";
						scoreKeeper += parseInt((die1+die2)*10);
						over = true;
					} else if((die1+die2) == 2 || (die1+die2) == 3 || (die1+die2) == 12) {
						data2.innerHTML += "Sorry, you have crapped out, you lose!<br />";
						status.innerHTML = "Reset";
						scoreKeeper = 0;
						roundCount = 0;
						over = true;
					} else {
						playerPoint = (die1+die2);
						point.innerHTML = playerPoint;
						data2.innerHTML += "Your player point is "+playerPoint+"<br />";
					}
				} else {
					if((die1+die2) == 7) {
						data2.innerHTML += "Sorry, you got a seven-out, you lose!<br />";
						status.innerHTML = "Reset";
						scoreKeeper = 0;
						roundCount = 0;
						over = true;
					} else if((die1+die2) == playerPoint) {
						winCount++;
						data2.innerHTML += "Player point achieved, you win!<br />";
						status.innerHTML = "You Win!";
						scoreKeeper += parseInt(100/rollCount);
						over = true;
					}
				}
				wins.innerHTML = winCount;
				score.innerHTML = scoreKeeper;
				if(scoreKeeper > bestScoreKeeper) {
					bestScoreKeeper = scoreKeeper;
				}
				bestScore.innerHTML = bestScoreKeeper;
				busy = false;
			}
		}
		function gameReset(type) {
			over = false;
			playerPoint = 0;
			rollCount = 0;
			roundCount++;
			status.innerHTML = "Roll Dice";
			rolls.innerHTML = rollCount;
			data2.innerHTML = "";
			round.innerHTML = roundCount;
			point.innerHTML = 0;
		}
	};
};