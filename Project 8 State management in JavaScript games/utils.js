export function drawStatusText(context, input, player){
    context.font = '20px Helvetica'
    context.fillText('Last input: ' + input.lastKey, 10, 20);
    context.fillText('Active state: ' + player.currentState.state, 10, 50);
}