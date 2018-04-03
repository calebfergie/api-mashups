
var currentImgSrc = "";
var currentGIF;

function getNewSticker() {
  $.ajax({
      headers: {},
      url: "http://api.giphy.com/v1/stickers/random?api_key=yP2X5cFY8PfvX4TtYMjR9UNDD6GiHAkf",
    })
    .done(function(data) {
			currentGIF = loadImage(data.data.images.preview_gif.url);
			console.log("success!", currentImgSrc);
			sticker = new Sticker(currentGIF, 10,10,100,100);
    })
    .fail(function() {
      console.log("error loading sticker");
    })
    .always(function() {
      console.log("tried to get new sticker");
    })
}

//Called once when the page is ready
function setup() {
	console.log("Setup");

	//ALT - using the p5Dom library
  var canvas = createCanvas(800,400);
  canvas.parent('container');
	getNewSticker();
	currentGIF = loadImage(currentImgSrc);
	defaultGIF = createImage("https://media0.giphy.com/media/xUOwFVUaRCAcXNGj5u/giphy.gif");
	sticker = new Sticker(currentGIF, 10,10,100,100);
}

//Called every frame after setup is called
function draw() {
	console.log("Drawing");
	background(0);
	sticker.display();
	image(defaultGIF,50,50,50,50);
}

function makeEllipse(){
	ellipse(mouseX, mouseY, 50,50);
}

function mousePressed(){
	console.log("X:" + mouseX + " Y:" + mouseY);
	getNewSticker();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//sticker class
function Sticker(gif, xPos, yPos, xSize, ySize){
	this.gif = gif;
	this.xPos = xPos;
	this.yPos = yPos;
	this.xSize = xSize;
	this.ySize = ySize;

	this.display = function() {
		image(this.gif,this.xPos,this.yPos);
		ellipse(50,50,50,50);
	}
};
