export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.liveImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // Score
        context.fillText('Score: ' + this.game.score, 20, 50);
        // SuperPower
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Special Power Timer: ' + ((this.game.player.rollingLimit - this.game.player.rollingTimer) * 0.001).toFixed(1), 20, 80)
        // Timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 105);
        // Lives
        for(let i = 0; i < this.game.lives; i++){
            context.drawImage(this.liveImage, 30 * i + 20, 120, 25, 25);
        }
        // Game Over Message
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > this.game.highScore){
                context.fillText('WELL DONE: New highscore created', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('The new highscore is ' + this.game.score, this.game.width * 0.5, this.game.height * 0.5 + 20);
                this.game.highScore = this.game.score;
            }
            else{
                console.log(this.game.highScore)
                context.fillText('GAME OVER: Your Score is ' + this.game.score, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You need to defeat ' + (this.game.highScore - this.game.score + 1) + ' more enemies to beat the highscore', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}