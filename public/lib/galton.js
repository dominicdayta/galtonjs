const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = 'black';
    ctx.stroke();

    class Ball {
        constructor(ball_num) {
            this.num = ball_num;
            this.x = 250;
            this.y = 50;
            this.radius = 10;
            this.dx = 0; 
            this.dy = 5;
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }

    }

    function generateObstacles() {
        let obstacles = [];

        // alternating obstacles
        /*
        for(let j=100; j < 550; j++) {
            if(j % 50 != 0) continue;
            nudge = 0;
            if(j % 100 == 0) nudge = 20;
            for(let i=0; i < canvas.width; i++) {
                if(i % 40 != 0) continue;
                obstacles.push({
                    type: "block",
                    x: i + nudge, y: j,
                    width: 5, height: 10
                });
            }	
        }*/

        // walls
        for(let j=550; j < canvas.height; j++){
            for(let i=0; i < canvas.width; i++){
                if(i % 40 != 0) continue;
                obstacles.push({
                    type: "block",
                    x: i, y: j,
                    width:5, height:10
                });
            }
        }
        
        return(obstacles)
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw obstacles
        obstacles.forEach(function(obstacle){
            if(obstacle.type === "block"){
                ctx.fillStyle = 'red';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        });		

        // call to ball physics
        for(const ball of balls) {
            ball.update();
            let hasHitBall = false;
            for(const obstacle of obstacles){
                if(obstacle.type === "block" &&
                    ball.x + ball.radius > obstacle.x &&
                    ball.x - ball.radius < obstacle.x + obstacle.width &&
                    ball.y + ball.radius > obstacle.y &&
                    ball.y - ball.radius < obstacle.y + obstacle.height &&
                    ball.dy > 0){
                    
                    ball.y = obstacle.y - ball.radius;
                    ball.x += (Math.random() - 0.5) * 20;
                }

                if(obstacle.type === "ball" &&
                    ball.x + ball.radius > obstacle.x &&
                    ball.x - ball.radius < obstacle.x + obstacle.width &&
                    ball.y + ball.radius > obstacle.y &&
                    ball.y - ball.radius < obstacle.y + obstacle.height){
                    
                    ball.y = obstacle.y - obstacle.height - ball.radius;
                    ball.dy = 0;
                    hasHitBall = true;

                    obstacles.push({
                        type: "ball",
                        x: ball.x, y: ball.y + ball.radius, height: ball.radius, width: ball.radius
                    });
                }
            }

            if(!hasHitBall && ball.y + ball.radius > canvas.height){
                ball.y = canvas.height - ball.radius;
                ball.dy = 0;
                obstacles.push({
                    type: "ball",
                    x: ball.x, y: ball.y + ball.radius, height: ball.radius, width: ball.radius
                });
            }
        }

        for(const ball of balls) {
            ball.draw();
        }

        requestAnimationFrame(animate);
    }

    const balls = [];
    var obstacles = generateObstacles();
    let ballCount = 1;
    const maxBalls = 5;
    const interval = setInterval(()=>{
        if(ballCount <= maxBalls) {
            balls.push(new Ball(ballCount));
            ballCount++;
            console.log(balls);
        } else {
            clearInterval(interval);
        }
    }, 1000);

    animate();