var initId = 0;
var player = function(){
	this.object = null;
	this.canJump = false;
};
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var keys = [];


function step() {

	if (player.object.GetCenterPosition().y > canvasHeight){
		player.object.SetCenterPosition(new b2Vec2(20,350),0)
	}	
	else if (player.object.GetCenterPosition().x > canvasWidth-50){
		showWin();
		return;	
	}



	handleInteractions();

	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);
	setTimeout('step()', 10);
}

function showWin(){
	ctx.fillStyle    = '#000';
	ctx.font         = '50px verdana';
	ctx.textBaseline = 'top';
	ctx.fillText('You', 250, 130);
	ctx.fillText('Win!',250, 180);
}

function handleInteractions(){
	// up arrow

	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				if (playerObj.y < groundObj.y){
					player.canJump = true;
				}
			}
		}
	}

	var vel = player.object.GetLinearVelocity();
	if (keys[38] && player.canJump){
		vel.y = -160;	
	}

	// left/right arrows
	if (keys[37]){
		vel.x = -50;
	}
	else if (keys[39]){
		vel.x = 50;
	}


	player.object.SetLinearVelocity(vel);
}


function initGame(){

	// create platforms	
	createBox(world,0,200,1,200, true, 'ground');	  //Left border
	createBox(world,300,0,300,1, true, 'ground');     //Top border
	createBox(world,20,400,40,1, true, 'ground');   //Bottom border
	createBox(world,600,200,1,200, true, 'ground');   //Right border
	createBox(world,575,360,25,100, true, 'ground');//"Finnish" block
	createBox(world,70,380,10,10, true, 'ground');
	createBox(world,120,360,10,10, true, 'ground');
	createBox(world,170,340,10,10, true, 'ground');
	createBox(world,220,320,10,10, true, 'ground');
	createBox(world,270,300,10,10, true, 'ground');
	createBox(world,320,280,10,10, true, 'ground');
	createBox(world,550,250,.8,150, true, 'ground');

	createBox(world,165,250,100,.8, true, 'ground');
	createBox(world,30,220,8,.8, true, 'ground');	
	createBox(world,60,70,10,.8, true, 'ground');	
	createBox(world,300,90,170,.8, true, 'ground');	

	createBox(world,540,100,10,.8, true, 'ground');

	

	// create player ball
	var ballSd = new b2CircleDef();
	ballSd.density = .1;
	ballSd.radius = 10;
	ballSd.restitution = .35
	ballSd.friction = 20;
	ballSd.userData = 'player';
	var ballBd = new b2BodyDef();
	ballBd.linearDamping = .03;
	ballBd.allowSleep = false;
	ballBd.AddShape(ballSd);
	ballBd.position.Set(20, 350);
	player.object = world.CreateBody(ballBd);

}

function handleKeyDown(evt){
	keys[evt.keyCode] = true;
}


function handleKeyUp(evt){
	keys[evt.keyCode] = false;
}

Event.observe(window, 'load', function() {
	world = createWorld();
	ctx = $('game').getContext('2d');
	var canvasElm = $('game');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);
	initGame();
	step();

	window.addEventListener('keydown',handleKeyDown,true);
	window.addEventListener('keyup',handleKeyUp,true);
});


// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}
