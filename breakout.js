var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var score = 0;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 4;
var dy = -4;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 6;
var brickColCount = 11;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var lives = 5;
var audioExplode = new Audio('explosion.wav');
var audioHit = new Audio('hit.wav');
var enterPressed = false;

//all the controlls
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

var bricks = [];
for(var col = 0; col < brickColCount; col++) 
{
    bricks[col] = [];
    for(var row = 0; row < brickRowCount; row++) 
    {
         bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}

function makeBricks() 
{
    for(var col = 0; col < brickColCount; col++) 
    {
        for(var row = 0; row < brickRowCount; row++) 
        {
            if(bricks[col][row].status == 1) 
            {
                var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#A52A2A";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function keyDownHandler(e)
{
	if(e.keyCode == 39)
    {	
		rightPressed = true;	
	}
	else if(e.keyCode == 37)
    {	
		leftPressed = true;
	}
    else if(e.keyCode == 13)
    {
        enterPressed = true;
    }		
}//end of keypressdown
	
function keyUpHandler(e)
{	
	if(e.keyCode == 39)
    {
		rightPressed = false;
	}
	else if(e.keyCode == 37)
    {	 
		leftPressed = false;	
	}
    else if(e.keyCode = 13)
    {
        enterPressed = false;
    }
}//end of keypressup

function makeBall()
{
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,2*Math.PI);
	ctx.fillstyle = "#000000";
	ctx.fillStroke = "#FFFFFF";
	ctx.Stroke = "10"
	ctx.fill();
	ctx.closePath();
}

function makePaddle()
{
	ctx.beginPath();
	ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
	ctx.fillstyle = "#00FF00";
	ctx.fill();
	ctx.closePath();
}

function liveLabel() 
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function gameOverLabel() 
{
    ctx.font = "64px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Game Over", 300, 320);
}

function enterLabel()
{
    ctx.font = "24px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Press Enter to Restart", 350, 350);

}

function winnerLabel() 
{
    ctx.font = "64px Arial";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("You Won", 330, 320);
}

function scoreLabel() 
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Score: "+score, 8, 20);
}

function collisionDetection() 
{
    for(var col = 0; col < brickColCount; col++) 
    {
        for(var row = 0; row < brickRowCount; row++) 
        {
            var b = bricks[col][row];
            if(b.status == 1) 
            {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) 
                {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    audioExplode.play();
                    if(score == brickRowCount * brickColCount) 
                    {
                        winnerLabel();
                        enterLabel();
                        dy = 0;
                        dx = 0;
                        if(enterPressed)
                        {
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function checkOutOfBounce()
{
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) 
    {
        audioHit.play();
        dx = -dx;
    }
    if(y + dy < ballRadius) 
    {
        audioHit.play();
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) 
    {
        if(x > paddleX && x < paddleX + paddleWidth) 
        {
             if(y= y-paddleHeight)
             {
                dy = -dy  ;
             }
        }
        else 
        {
            lives--;
            if(lives <= 0) 
            {
                enterLabel();
                gameOverLabel();
                dx = 0;
                dy = 0;
                if(enterPressed)
                {
                    document.location.reload();
                }
            }
            else 
            {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

}

function runGame()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	makeBricks();
	makeBall();
	makePaddle();
	liveLabel();
	scoreLabel();
	collisionDetection();
    checkOutOfBounce();
	if(rightPressed && paddleX < canvas.width-paddleWidth)
    {	
		paddleX+=7;
	}
	else if(leftPressed && paddleX > 0 )
    {
		paddleX-=7;	 
	}

    if(lives <= 0) 
    {
        gameOverLabel();
        enterLabel();
        dx = 0;
        dy = 0;
        if(enterPressed)
        {
            document.location.reload();
        }
    }

    if(score == brickRowCount * brickColCount) 
    {
        winnerLabel();
        enterLabel();
        dy = 0;
        dx = 0;
        if(enterPressed)
        {
            document.location.reload();
        }
    }
		 
	x=x+dx;
	y=y+dy;
	requestAnimationFrame(runGame);
}

runGame();