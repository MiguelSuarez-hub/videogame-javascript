const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;
let map = maps[0].trim().split('\n');
map = map.map((row) => row.trim().split(''));

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {

  if (window.innerHeight > window.innerWidth) {
    canvasSize = (window.innerWidth * 0.75)-16;
  } else {
    canvasSize = (window.innerHeight * 0.75)-16;
  }

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  elementSize = (canvasSize / 10) - 1;

  startGame();
}

function startGame() {
  game.font = elementSize + 'px Serif';
  game.textAlign = 'end';

  for (let row = 0; row < 10; row++) {   
    for (let col = 0; col < 10; col++) {
      game.fillText(emojis[map[row][col]], ((col + 1) * elementSize) + 14, (row + 1) * elementSize);
    }    
  } 
}