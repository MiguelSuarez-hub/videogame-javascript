const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', startGame);

function startGame() {
  let canvasSize;

  if (window.innerHeight > window.innerWidth) {
    canvasSize = (window.innerWidth * 0.75)-16;
  } else {
    canvasSize = (window.innerHeight * 0.75)-16;
  }

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  const elementSize = (canvasSize / 10) - 1;

  game.font = elementSize + 'px Serif';
  game.textAlign = 'end';

  for (let i = 1; i <= 10; i++) {
    game.fillText(emojis['X'], (i * elementSize) + 14, elementSize);
  }
  
}
