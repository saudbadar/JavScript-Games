import { GroundEnemey } from "./enemies.js";
import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { collisionAnimation } from "./collisionAnimation.js";
import { FloatingMesage } from "./floatingMessages.js";

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), 
            new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        this.rollingLimit = 2000;
        this.rollingTimer = 0;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // Horizontal Movement
        this.x += this.speed;
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // Horizontal Boundaries
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // Vertical Movement
        this.y += this.vy
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // Vertical Boundaries
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        // Sprite Animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // if(this.frameX < this.maxFrame) this.frameX++;
        // else this.frameX = 0
        // Rolling Limit
        if(this.currentState !== this.states[4]){
            if(this.rollingTimer > 0){
                this.rollingTimer -= deltaTime;
            }
        }
        else{
            this.rollingTimer += deltaTime
            if(this.rollingTimer > this.rollingLimit){
                if(!this.onGround()){
                    this.setState(3, 1);
                }
                else{
                    this.setState(1, 1);
                }
            }
        }
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
            this.width, this.height, this.x, this.y, this.width, this.height)
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter()
    }
    checkCollision(){
        this.game.enemies.forEach(enemy =>{
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                // Collision Detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new collisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]){
                    if(this.currentState != this.states[6]){
                        this.game.score++;
                        this.game.floatingMessages.push(new FloatingMesage('+1', enemy.x, enemy.y, 150, 50));
                    }
                }
                else{
                    this.setState(6, 0)
                    this.game.lives--;
                    this.game.score -= 5;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }
}