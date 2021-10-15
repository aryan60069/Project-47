//declaring the variables
var mainCarImg, muddyRoadImg, brokenRoadImg, roadImg, sidePathImg;
var muddyRoadAccidentImg, brokenCar;
var redLightImg, greenLightImg, playButtonImg, stopButtonImg;
var diversionImg;
var gameOverImg, restartImg;
var bg, initialBg;
var mainCar, muddyRoad, brokenRoad, sidePathLeft, sidePathRight;
var muddyRoadGroup, brokenRoadGroup, tLightGroup, diversionGroup;
var lpl, rpl;
var tLight, playButton, stopButton;
var diversion;
var PLAY = 1;
var END = 0;
var INITIAL_STATE = 2;
var gameState = INITIAL_STATE;
var restart, gameOver;
var gameOverSound;

function preload(){
  //preloading the images and sounds
   roadImg = loadImage("images/Road.jpe");
   initialBg = loadImage("images/initialBg.jpe")
   mainCarImg = loadImage("images/Main Car.png");
   muddyRoadImg = loadImage("images/MuddyRoad.png");
   brokenRoadImg = loadImage("images/Broken Road.png");
   muddyRoadAccidentImg = loadImage("images/MuddyRoadAccident.png");
   brokenCar = loadImage("images/Broken Car.png");
   sidePathImg = loadImage("images/SidePath.png");
   diversionImg = loadImage("images/Diversion Ahead.png")
   gameOverImg = loadImage("images/GameOver.png");
   restartImg = loadImage("images/Restart.png");
   gameOverSound = loadSound("sound/GameOverSound.mpeg");
   redLightImg = loadImage("images/redLight.png");
   greenLightImg = loadImage("images/greenLight.png");
   playButtonImg = loadImage("images/Play Button.png");
   stopButtonImg = loadImage("images/Stop Button.png");
}

  function setup() {
  createCanvas(1000,570);

  //creating the road
  bg = createSprite(500,900,400,400);
  bg.addImage("road",roadImg);
  bg.velocityY = 3;
  bg.scale = 0.8;

  //creating the left side Path
  sidePathLeft = createSprite(100,300, 400, 400);
  sidePathLeft.addImage("1", sidePathImg);
  sidePathLeft.velocityY = 3;
  sidePathLeft.scale = 0.7;

  //creating an invisible line on left with which play and stop buttons would collide
  lpl = createSprite(100, 260, 10, 600);
  lpl.visible = false;

  //creating the right side path
  sidePathRight = createSprite(900,300, 400, 400);
  sidePathRight.addImage("1", sidePathImg);
  sidePathRight.velocityY = 3;
  sidePathRight.scale = 0.7;

  //creating an invisible line on right with which play and stop buttons would collide
  rpl = createSprite(780, 300, 10, 600);
  rpl.visible = false;
  
  // creating the player character
  mainCar = createSprite(200,480,400,400);
  mainCar.addImage("main",mainCarImg);
  mainCar.scale = 0.8;
  mainCar.setCollider("rectangle",0,0,100,240);

  //creating the play button
  playButton = createSprite(mainCar.x-60, mainCar.y-10, 10,10);
  playButton.addImage("play", playButtonImg);
  playButton.scale = 0.15;

  //creating the stop button
  stopButton = createSprite(mainCar.x-60, mainCar.y+25, 10,10);
  stopButton.addImage("stop", stopButtonImg);
  stopButton.scale = 0.15;

  //creating the game over image
  gameOver = createSprite(530,170, 10, 10);
  gameOver.addImage("over", gameOverImg);
  gameOver.scale = 1.6

  //creating the restart button
  restart = createSprite(510, 300, 10,10);
  restart.addImage("restart", restartImg);
  restart.scale = 0.35

  //declaring/creating groups
  muddyRoadGroup = new Group();
  brokenRoadGroup = new Group();
  tLightGroup = new Group();
  diversionGroup = new Group();
}

function draw() {
  //background("black");

  if(gameState === INITIAL_STATE){
    background(initialBg);

    strokeWeight(5);
    stroke(10);
    fill("red")
    textSize(45);
    text("Welcome to Game !", 300, 70);
    textSize(30)
    text("Instructions :- ", 100, 120);
    strokeWeight(0);
    textSize(20);
    text("1. Move the car with your left and Right arrow key.",100, 160);
    text("2. There are green and red lights on the Right Hand side.", 100, 200);
    text("3. Use the Pause button to stop the car on red light.", 100, 240);
    text("4. Use the Resume button to start the car as the red light disappears.", 100, 280);
    text("5. Prevent the car for colliding with other obstacles, else you would lose the game",100, 320);
    text("6. Press Reset in case you lose the game.",100,360);
    text("7. Press SPACE key to start the game.",100,400);

    if(keyCode(32)){
      clear();
      gameState = PLAY;
    }
  }

  //segregating the code into play and end conditions
  if(gameState === PLAY){

    background(0);

    //infinite running road
    if(bg.y > 350){
      bg.y = height/2;
    }

    //infiniting running side paths
    if(sidePathLeft.y > 350){
      sidePathLeft.y = height/2;
    }
    if(sidePathRight.y > 350){
      sidePathRight.y = height/2;
    }

    //moving the car left with left arrrow
    if(keyDown(LEFT_ARROW)){
      mainCar.x = mainCar.x - 5;
      playButton.x = playButton.x-5;
      stopButton.x = stopButton.x-5;
    }
  
    //moving the car with right arrow
    if(keyDown(RIGHT_ARROW)){
      mainCar.x = mainCar.x + 5;
      playButton.x = playButton.x+5;
      stopButton.x = stopButton.x+5;
    }

    // code of collisions of Sprites
    mainCar.collide(sidePathLeft);
    mainCar.collide(sidePathRight);
    playButton.collide(lpl);
    stopButton.collide(lpl);
    playButton.collide(rpl);
    stopButton.collide(rpl);

    //declaring user-defines functions
    spawnMuddyRoad();
    spawnBrokenRoad(); 
    trafficLight();

    //reaching to end state if broken road touches main car
  if(brokenRoadGroup.isTouching(mainCar)){
    mainCar.addImage("broke",brokenCar);
    mainCar.changeAnimation("broke",brokenCar);
    mainCar.scale = 0.6;
    gameOverSound.play();
    gameState = END;
  }

  //reaching to end state if muddy road touches main car
  if(muddyRoadGroup.isTouching(mainCar)){
    mainCar.addImage("mud",muddyRoadAccidentImg);
    mainCar.changeAnimation("mud",muddyRoadAccidentImg);
    mainCar.scale = 0.5;
    gameOverSound.play();
    gameState = END;
  }

   //stopping the game if stop button is pressed
   if(mousePressedOver(stopButton)){
    sButton();
  }

  //resuming the game if play button is pressed
  if(mousePressedOver(playButton)){
    pButton();
  }

  gameOver.visible = false;
  restart.visible = false;

  } else {

    //the things which should happen in end state
    gameOver.visible = true;
    restart.visible = true;
    stopButton.visible = false;
    playButton.visible = false;

    diversionGroup.destroyEach();
    muddyRoadGroup.destroyEach();
    brokenRoadGroup.destroyEach();

    bg.velocityY = 0;
    sidePathLeft.velocityY = 0;
    sidePathRight.velocityY = 0;
    muddyRoadGroup.setVelocityYEach(0);
    muddyRoadGroup.setLifetimeEach(-1);
    brokenRoadGroup.setVelocityYEach(0);
    brokenRoadGroup.setLifetimeEach(-1);
    tLightGroup.destroyEach();

    //reseting the game if reset button is pressed
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnMuddyRoad(){
  if(frameCount % 300 === 0){
    //creating the muddy road
    muddyRoad = createSprite(Math.round(random(200, 700)),20,400,400);
  muddyRoad.addImage("muddy",muddyRoadImg);
  muddyRoad.velocityY = (1.5*frameCount/80);
  muddyRoad.scale = 3;
  muddyRoad.setCollider("rectangle",0,0,25,30);
  muddyRoad.lifetime = 400;
  mainCar.depth = muddyRoad.depth;
  mainCar.depth = mainCar.depth + 1;

  // creating a diversion of muddy road
  diversion = createSprite(muddyRoad.x-10, muddyRoad.y+100 + 20, 20,20);
  diversion.addImage("divert", diversionImg);
  diversion.velocityY = (1.5*frameCount/80);
  diversion.scale = 0.06;
  diversion.lifetime = 400;
  mainCar.depth = diversion.depth;
  mainCar.depth = mainCar.depth + 1;

  //adding into groups
  muddyRoadGroup.add(muddyRoad);
  diversionGroup.add(diversion);
}
}

function spawnBrokenRoad(){
  if(frameCount % 500 === 0){
    //creating the broken road
  brokenRoad = createSprite(Math.round(random(290, 710),20,400,400));
  brokenRoad.addImage("broken",brokenRoadImg);
  brokenRoad.velocityY = (1.5*frameCount/80);
  brokenRoad.scale = 0.5;
  brokenRoad.setCollider("rectangle", 0,0,215,200);
  brokenRoad.lifetime = 400;
  mainCar.depth = brokenRoad.depth;
  mainCar.depth = mainCar.depth + 1;

  //creating diversion of broken road
  diversion = createSprite(brokenRoad.x, brokenRoad.y+90, 20,20);
  diversion.addImage("divert", diversionImg);
  diversion.velocityY = (1.5*frameCount/80);
  diversion.scale = 0.06;
  diversion.lifetime = 400;
  mainCar.depth = diversion.depth;
  mainCar.depth = mainCar.depth + 1;

  //adding into groups
  brokenRoadGroup.add(brokenRoad);
  diversionGroup.add(diversion);
}
}

function reset(){
  //things which should happen when reset button is pressed
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  bg.velocityY = 3;
  sidePathLeft.velocityY = 3;
  sidePathRight.velocityY = 3;
  frameCount = 0;

  muddyRoadGroup.destroyEach();
  brokenRoadGroup.destroyEach();
  mainCar.changeAnimation("main",mainCarImg);
  mainCar.scale = 0.8;
}

function trafficLight(){
  if(frameCount%700 === 0){
    //creating the traffic lights
    tLight = createSprite(900,50, 10,10);
    tLight.velocityY = 3;
    tLight.scale = 0.5;
    tLight.lifetime = 350;

    //giving it random colours to display on the screen
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1 : tLight.addImage(redLightImg);
      break; 
      case 2 : tLight.addImage(greenLightImg);
      break;
      default : break;
  }
  //adding into groups
  tLightGroup.add(tLight);
}
}

function sButton(){
  //code which should happen when stop button is pressed
  bg.velocityY = 0;
  sidePathLeft.velocityY = 0;
  sidePathRight.velocityY = 0;
  diversionGroup.setVelocityYEach(0);
  muddyRoadGroup.setVelocityYEach(0);
  brokenRoadGroup.setVelocityYEach(0);
  muddyRoadGroup.setLifetimeEach(-1);
  brokenRoadGroup.setLifetimeEach(-1);
  tLightGroup.setVelocityYEach(0);
}

function pButton(){
  //code which should happen when play button is pressed
  bg.velocityY = 3;
  sidePathLeft.velocityY = 3;
  sidePathRight.velocityY = 3;
  diversionGroup.setVelocityYEach(1.5*frameCount/80);
  muddyRoadGroup.setVelocityYEach(1.5*frameCount/80);
  brokenRoadGroup.setVelocityYEach(1.5*frameCount/80);
  muddyRoadGroup.setLifetimeEach(400);
  brokenRoadGroup.setLifetimeEach(400);
  tLightGroup.setVelocityYEach(3);
}