// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extraction with MobileNet. Built with p5.js
This example uses a callback pattern to create the classifier
=== */


let featureExtractor;
let classifier;
let video;
let loss;
let rightImages = 0;
let leftImages = 0;

var direction = 'right';

// Variables for the ball
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var diameter = 50;
var xBallChange = 5;
var yBallChange = 5;

// Variables for the paddle
var xPaddle;
var yPaddle;
var paddleWidth = 200;
var paddleHeight = 25;

var started = false;
var score = 0;

var speed = 10;

function setup() {
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video, videoReady);
  // Set up the UI buttons
  setupButtons();
  
  createCanvas(windowWidth, windowHeight);
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!✅');
}

// A function to be called when the video has loaded
function videoReady () {
  select('#videoStatus').html('Video ready!✅');
}

// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  buttonA = select('#rightButton');
  buttonA.mousePressed(function() {
    classifier.addImage('right');
    select('#amountOfRightImages').html(rightImages++);
  });

  buttonB = select('#leftButton');
  buttonB.mousePressed(function() {
    classifier.addImage('left');
    select('#amountOfLeftImages').html(leftImages++);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! ✅ Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
}

function Draw() {
  background(0);
  
  // Ball bounces off walls
	xBall += xBallChange;
	yBall += yBallChange;
	if (xBall < diameter/2 || 
      xBall > windowWidth - 0.5*diameter) {
		xBallChange *= -1;
  }
	if (yBall < diameter/2 || 
      yBall > windowHeight - diameter) {
    yBallChange *= -1;
  }
  
  // Detect collision with paddle
  if ((xBall > xPaddle &&
      xBall < xPaddle + paddleWidth) &&
      (yBall + (diameter/2) >= yPaddle)) {
    xBallChange *= -1;
    yBallChange *= -1;
    score++;
  }
  
  // Draw ball
	fill(182, 66, 244);
	noStroke();
	ellipse(xBall, yBall, diameter, diameter);
  
  // Update paddle location
  if (!started) {
    xPaddle = windowWidth / 2;
    yPaddle = windowHeight - 100;
    started = true;
  }
  
  // Draw paddle
  fill(244, 66, 200);
  noStroke();
  rect(xPaddle, yPaddle, paddleWidth, paddleHeight);
  
  // Draw score
  fill(0, 255, 255);
  textSize(24);
  text("Score: " + score, 10, 30);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result);
  classify();
  Draw();

  //Display Model Name
  fill(0, 255, 255);
  textSize(24);
  text("Model: " + result, 10, 60);

  xPaddle = constrain(xPaddle,0,width-200);
  if (result == "left") {
    console.log("moving left!");
    keyCode === LEFT_ARROW;
      xPaddle = xPaddle - speed;
  } else if (result == "right") {
    console.log("moving right!");
    keyCode === RIGHT_ARROW;
      xPaddle = xPaddle + speed;
  }

  if (yBall > windowHeight - diameter) {
  alert("Game Over!")
}

}