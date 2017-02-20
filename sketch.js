/*
    Pong
    Version 1.0
    Guilherme Andrade
    February 2017

    Game plays best out of 5. One player uses SHIFT and CTRL to move
    left paddle, the other uses UP and DOWN arrows to move right paddle.

    Key points:
     -Two Players on Same Keyboard
     -Dynamic Alignment
     -Made with p5 JS
*/

// VARIABLES

// Colors
var black = 0;
var white = 255;

// Sounds
var soundLeftPaddle;
var soundRightPaddle;
var soundGoal;
var sound = true;

// Buttons
var buttonSound;
var buttonReplay;
var buttonInstructions;

// Game Information
var maxBallsPerGame = 5;
var ballsNum = maxBallsPerGame;
var pointsPlayer1 = 0;
var pointsPlayer2 = 0;

// Players bars
var rect_width = 8;
var rect_height = 50;
var rect1_y = 2;
var rect2_y = 2;
var rectSpaceLeft = 2;


// Ball
var minStartPosX = 300;
var maxStartPosX = 500;
var minStartPosY = 50;
var maxStartPosY = 450;
var startSpeed = 3;
var ball_x;
var ball_y;
var ball_width = 15;
var ball_height = 15;
var xSpeed = startSpeed;
var ySpeed = startSpeed;

// FUNCTIONS

function preload() {
    // Preload sounds
    soundLeftPaddle = loadSound("audio/sound_leftpaddle.wav");
    soundRightPaddle = loadSound("audio/sound_rightpaddle.wav");
    soundGoal = loadSound("audio/goal.wav");
}

function setup() {
    stroke(white); // Set line drawing color to white
    createCanvas(900, 500);
    createButtons();
    startBall();
}

function draw() {
    background(black);
    centerDots();
    drawRectangles();
    drawPoints();
    checkEndGame();
    ellipse(ball_x, ball_y, ball_width, ball_height);
    moveBall();
}

function createButtons() {
    buttonSound = createButton("Mute Game");
    buttonSound.position(230, 590);
    buttonSound.mousePressed(toggleSound);
    buttonReplay = createButton("Replay");
    buttonReplay.position(640, 590);
    buttonReplay.mousePressed(toggleReplay);
    buttonInstructions = createButton("Instructions");
    buttonInstructions.position(1030, 590);
    buttonInstructions.mousePressed(toggleInstructions);
}

function toggleSound() {
    if (sound) {
        sound = false;
        buttonSound.html("Unmute Game");
    } else {
        sound = true;
        buttonSound.html("Mute Game");
    }
}

function toggleReplay() {
  location.reload();
}

function toggleInstructions() {
    alert("Each Game has 5 balls. One player uses SHIFT and CTRL " +
        "to move left paddle,\nthe other uses UP and DOWN arrows to move right paddle." +
        "\nIn the end, the player with more balls scored wins!");
}

function startBall() {
    if (ballsNum > 0) {
        // New ball
        if (ballsNum < maxBallsPerGame) {
            randomInitDir();
        }
        startPositionX = random(minStartPosX, maxStartPosX);
        startPositionY = random(minStartPosY, maxStartPosY);
        ball_x = startPositionX;
        ball_y = startPositionY;
        ballsNum -= 1;
    } else {
        // Game ended
        xSpeed = 0;
        ySpeed = 0;
        textSize(58);
        var endGame = "END OF GAME \n";
        var posTextY = height / 2;
        var posTextX = (width / 2) - 190;
        fill(white);
        text(endGame, posTextX, posTextY);
    }

}

function randomInitDir() {
    // Invert Speed at each iteration
    xSpeed = startSpeed;
    ySpeed = startSpeed;
    var ran = round(random(3)); //  ran = 0, 1 or 2
    if (ran == 0) {
        xSpeed *= -1;
    } else if (ran == 1) {
        ySpeed *= -1;
    } else {
        xSpeed *= -1;
        ySpeed *= -1;
    }
}

function centerDots() {
    // function to draw middle line
    var middle = width / 2;
    var posY = height;
    while (posY > 0) {
        line(middle, posY, middle, posY - 20);
        stroke(white);
        posY -= 30;
    }
}

function drawRectangles() {
    // function to draw player rectangles
    player1 = rect(rectSpaceLeft, rect1_y, rect_width, rect_height);
    player2 = rect(width - 11, rect2_y, rect_width, rect_height);
}

function drawPoints() {
    var yPoints = height / 4 - 40;
    var xPointsLeft = width / 4;
    var xPointsRight = width * (3 / 4);
    textSize(56);
    fill(white);
    text(pointsPlayer1, xPointsLeft, yPoints);
    text(pointsPlayer2, xPointsRight, yPoints);
}

function checkEndGame() {
    if ((pointsPlayer1 + pointsPlayer2) == maxBallsPerGame) {
        noLoop();
    }
}

function moveBall() {
    // function to manage ball movement
    hasCollidedWall();
    collidedPlayer();

    ball_x += xSpeed;
    ball_y += ySpeed;
}

function hasCollidedWall() {
    // function to reverse and get more speed on wall collisions

    if (ball_x <= 0) {
        pointsPlayer2++;
        startBall();
        if (sound) {
            soundGoal.play();
        }

    } else if (ball_x >= width) {
        pointsPlayer1++;
        startBall();
        if (sound) {
            soundGoal.play();
        }
    }

    if (ball_y <= 0) {
        ySpeed *= -1;
        ySpeed += 0.5;
    } else if (ball_y >= height) {
        ySpeed *= -1;
        ySpeed -= 0.5;
    }

}

function collidedPlayer() {
    // function to send ball after colliding with player

    // side of rectangles
    if (ball_x <= (rectSpaceLeft + rect_width) && (ball_y >= rect1_y && ball_y <= (rect1_y + rect_height))) {
        xSpeed *= -1;
        xSpeed += 1;
        if (sound) {
            soundLeftPaddle.play();
        }
    } else if (ball_x >= (width - 11) && (ball_y >= rect2_y && ball_y <= (rect2_y + rect_height))) {
        xSpeed *= -1;
        xSpeed -= 1;
        if (sound) {
            soundRightPaddle.play();
        }
    }
}

function keyPressed() {
    // function to move rectangles with keys
    if (keyIsDown(SHIFT)) {
        if (rect1_y > rect_height) {
            rect1_y -= rect_height;
        }
    }
    if (keyIsDown(CONTROL)) {
        if (rect1_y < (height - rect_height)) {
            rect1_y += rect_height;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        if (rect2_y > rect_height) {
            rect2_y -= rect_height;
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (rect2_y < (height - rect_height)) {
            rect2_y += rect_height;
        }
    }
}
