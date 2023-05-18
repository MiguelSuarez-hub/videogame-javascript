const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');

let canvasSize;
let elementSize;
let oldElementSize;
let level = 0;
let lives = 3;
const playerPosition = {
  x: undefined,
  y: undefined,
};
const goalPosition = {
  x: undefined,
  y: undefined,
};
let bombPositions = [];
let map;
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
  if (elementSize) {
    oldElementSize = elementSize;
  } else {
    oldElementSize = (canvasSize / 10) - 1;
  }
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
      if ( playerPosition.y.toFixed(3) > elementSize ) {
        playerPosition.y -= elementSize;
      }      
      break;
    case 'Abajo':
    case 's':
    case 'ArrowDown':
      if ( playerPosition.y.toFixed(3) < (elementSize * 10) ) {
        playerPosition.y += elementSize;
      } 
      break;
    case 'Izquierda':
    case 'a':
    case 'ArrowLeft':
      if ( playerPosition.x.toFixed(3) > elementSize ) {
        playerPosition.x -= elementSize;
      } 
      break;
    case 'Derecha':
    case 'd':
    case 'ArrowRight':
      if ( playerPosition.x.toFixed(3) < (elementSize * 10) ) {
        playerPosition.x += elementSize;
      } 
      break;
  
    default:
      break;
  }
  //Verificación de completar nivel
  if ( (playerPosition.x.toFixed(3) == goalPosition.x.toFixed(3)) && (playerPosition.y.toFixed(3) == goalPosition.y.toFixed(3))) {
    level++;
  }
  //Verificación de chocar contra una bomba
  const bombCollition = bombPositions.find(bomb => {
    return (playerPosition.x.toFixed(3) == bomb.x.toFixed(3)) && (playerPosition.y.toFixed(3) == bomb.y.toFixed(3));
  });

  if (bombCollition) {
    lives--;
    if (lives <= 0) {
      level = 0;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
  }
  startGame();
}

function levelUp() {

}
//función para inicializar el mapa
function startGame() {
  game.font = elementSize + 'px Serif';
  game.textAlign = 'end';
  //renderizado del mapa
  map = maps[level].trim().split('\n');
  map = map.map((row) => row.trim().split(''));
  game.clearRect(0,0,canvasSize,canvasSize);
  bombPositions = [];
  map.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);
      game.fillText(emoji, posX, posY);
      //renderizado del jugador
      if (!playerPosition.x && !playerPosition.y){
        if (col == 'O') {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }      
      } else {
        playerPosition.x = elementSize * (Math.round(playerPosition.x/oldElementSize));
        playerPosition.y = elementSize * (Math.round(playerPosition.y/oldElementSize));
      } 
      if (col == 'I') {
        goalPosition.x = posX;
        goalPosition.y = posY;
      } else if (col == 'X') {
        const bombPosition = {x: posX, y: posY}
        bombPositions.push(bombPosition);
      }
           
    });
  });
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}