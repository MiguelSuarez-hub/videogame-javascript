const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');

let canvasSize;
let elementSize;
let playerPosition;
let playerPosX;
let playerPosY;
let map = maps[0].trim().split('\n');
map = map.map((row) => row.trim().split(''));

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
document.addEventListener('keydown', movePlayer)

btnUp.addEventListener('click', movePlayer);
btnLeft.addEventListener('click', movePlayer);
btnDown.addEventListener('click', movePlayer);
btnRight.addEventListener('click', movePlayer);



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
      if ( playerPosY === elementSize ) {

      } else {
        playerPosY = playerPosY - elementSize;
        game.fillText(emojis['PLAYER'], playerPosX, playerPosY);
      }      
      break;
    case 'Abajo':
    case 's':
    case 'ArrowDown':
      if ( playerPosY === (elementSize * 10) ) {

      } else {
        playerPosY = playerPosY + elementSize;
        game.fillText(emojis['PLAYER'], playerPosX, playerPosY);
      } 
      break;
    case 'Izquierda':
    case 'a':
    case 'ArrowLeft':
      if ( playerPosX === elementSize ) {

      } else {
        playerPosX = playerPosX - elementSize;
        game.fillText(emojis['PLAYER'], playerPosX, playerPosY);
      } 
      break;
    case 'Derecha':
    case 'd':
    case 'ArrowRight':
      if ( playerPosX === (elementSize * 10) ) {

      } else {
        playerPosX = playerPosX + elementSize;
        game.fillText(emojis['PLAYER'], playerPosX, playerPosY);
      } 
      break;
  
    default:
      break;
  }
}

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
        playerPosX = posX;
        playerPosY = posY;
        game.fillText(emojis['PLAYER'], playerPosX, playerPosY);
      }     
    });
  });
}