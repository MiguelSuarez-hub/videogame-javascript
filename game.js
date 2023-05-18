const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');

let canvasSize;
let elementSize;
let playerPosition= {
  x: undefined,
  y: undefined,
};
//variable map, contiene cada nivel
let map = maps[0].trim().split('\n');
map = map.map((row) => row.trim().split(''));
//listeners para renderizar el canvas
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

//listeners para mover al jugador
document.addEventListener('keydown', movePlayer)
btnUp.addEventListener('click', movePlayer);
btnLeft.addEventListener('click', movePlayer);
btnDown.addEventListener('click', movePlayer);
btnRight.addEventListener('click', movePlayer);


//función para definir las medidas del canvas
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

//función para mover al jugador
function movePlayer(e) {
  let direction;
  if (e.key) {
    direction = e.key
  } else {
    let btn = e.currentTarget;
    direction = btn.textContent;
  }
  

  switch (direction) {
    case 'Arriba':
    case 'w':
    case 'ArrowUp':
      if ( playerPosition.y === elementSize ) {

      } else {
        playerPosition.y -= elementSize;
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
      }      
      break;
    case 'Abajo':
    case 's':
    case 'ArrowDown':
      if ( playerPosition.y === (elementSize * 10) ) {

      } else {
        playerPosition.y += elementSize;
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
      } 
      break;
    case 'Izquierda':
    case 'a':
    case 'ArrowLeft':
      if ( playerPosition.x === elementSize ) {

      } else {
        playerPosition.x -= elementSize;
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
      } 
      break;
    case 'Derecha':
    case 'd':
    case 'ArrowRight':
      if ( playerPosition.x === (elementSize * 10) ) {

      } else {
        playerPosition.x += elementSize;
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
      } 
      break;
  
    default:
      break;
  }
}

//función para inicializar el mapa
function startGame() {
  game.font = elementSize + 'px Serif';
  game.textAlign = 'end';
  //renderizado del mapa
  map.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);
      game.fillText(emoji, posX, posY);
      //renderizado del jugador
      if (col === 'O') {
        playerPosition.x = posX;
        playerPosition.y = posY;
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
      }     
    });
  });
}