const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnStart = document.querySelector('#start');
const btnPause = document.querySelector('#pause');
const btnReset = document.querySelector('#reset');
const btnPlayAgain = document.querySelector('#play_again');
const btnCloseModal = document.querySelector('.modal_close');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const hTitle = document.querySelector('#final_title');
const pMessage = document.querySelector('#message');
const pLogo = document.querySelector('#final_logo');
const pRecord = document.querySelector('#show_record');
const modal = document.querySelector('#modal');

let canvasSize;
let elementSize;
let elementPos;
let oldElementPos;
let level = 0;
let lives = 3;
let gameStarted = false;
let timePlayer = 0;
let record = localStorage.getItem('record_time');;
let timeInterval;
let gamePaused = false;
const playerPosition = {
  x: undefined,
  y: undefined,
  col: undefined,
  row: undefined,
};
const goalPosition = {
  x: undefined,
  y: undefined,
};
let fixPos;
let bombPositions = [];
//listeners para renderizar el canvas
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

//función para redondear los numerso y dejarlos con solo 2 decimales
function fixNumber(n) {
  return Number(n.toFixed(2));
}

//listeners para mover al jugador
document.addEventListener('keydown', movePlayer)
btnUp.addEventListener('click', movePlayer);
btnLeft.addEventListener('click', movePlayer);
btnDown.addEventListener('click', movePlayer);
btnRight.addEventListener('click', movePlayer);
btnStart.addEventListener('click', startGame);
btnPause.addEventListener('click', pauseGame);
btnReset.addEventListener('click', resetGame);
btnPlayAgain.addEventListener('click', playAgain);
btnCloseModal.addEventListener('click', closeModal);


//función para definir las medidas del canvas
function setCanvasSize() {

  if (window.innerHeight > window.innerWidth) {
    canvasSize = (window.innerWidth * 0.75);
  } else {
    canvasSize = (window.innerHeight * 0.75);
  }

  canvasSize = Number(canvasSize.toFixed(0));
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  canvasSize -= 8;
  if (elementPos) {
    oldElementPos = elementPos;
  } else {
    oldElementPos = (canvasSize / 10);
  }
  elementSize = (canvasSize / 10) - (canvasSize / 100);
  elementPos = (canvasSize/ 10);
  elementSize = fixNumber(elementSize);
  elementPos = fixNumber(elementPos);
  fixPos = (canvasSize / 200) - 1; 
  fixPos = fixNumber(fixPos);
  showRecord();
  renderGame();
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
  if(!gamePaused) {
    switch (direction) {
      case 'Arriba':
      case 'w':
      case 'W':
      case 'ArrowUp':
        if ( playerPosition.y > (elementPos * 1.3)) {
          playerPosition.row--;
          playerPosition.y = (elementPos * playerPosition.row) - fixPos;
          playerPosition.y = fixNumber(playerPosition.y);
        }      
        break;
      case 'Abajo':
      case 's':
      case 'S':
      case 'ArrowDown':
        if ( playerPosition.y < (elementPos * 9.7) ) {
          playerPosition.row++;
          playerPosition.y = (elementPos * playerPosition.row) - fixPos;
          playerPosition.y = fixNumber(playerPosition.y);
        } 
        break;
      case 'Izquierda':
      case 'a':
      case 'A':
      case 'ArrowLeft':
        if ( playerPosition.x > (elementPos * 1.3) ) {
          playerPosition.col--;
          playerPosition.x = (elementPos * playerPosition.col) - (elementPos/2) + fixPos;
          playerPosition.x = fixNumber(playerPosition.x);
        } 
        break;
      case 'Derecha':
      case 'd':
      case 'D':
      case 'ArrowRight':
        if ( playerPosition.x < (elementPos * 9.5) ) {
          playerPosition.col++;
          playerPosition.x = (elementPos * playerPosition.col) - (elementPos/2) + fixPos;
          playerPosition.x = fixNumber(playerPosition.x);
        } 
        break;
    
      default:
        break;
    }
  }
  renderGame();
}

function collitions() {
  //Verificación de completar nivel
  const goalCollition = (playerPosition.x == goalPosition.x) && (playerPosition.y == goalPosition.y);
  if (goalCollition) {
    levelPassed();
  }
  //Verificación de chocar contra una bomba
  const bombCollition = bombPositions.find(bomb => {
    return (playerPosition.x == bomb.x) && (playerPosition.y == bomb.y);
  });
  //Acción ante choque con una bomba
  if (bombCollition) {
    levelFailed();
  }
}

function levelPassed() {
  if (gameStarted) {
    level++;
  } else {
    playerPosition.x = undefined;
    playerPosition.y = undefined;
  }   
  renderGame();
}

function levelFailed() {
  if (gameStarted) {
    lives--;     
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined; 
  renderGame();
}

function gameWin() {
  clearInterval(timeInterval);
  gameStarted = false;
  hTitle.innerHTML = 'Victory';
  pLogo.innerHTML = '🏆';
  pMessage.innerHTML = 'Felicitaciones, completaste el juego!!';
  if (record) {
    if (timePlayer < record) {
      record = timePlayer;
      localStorage.setItem('record_time', timePlayer);
      
      pRecord.innerHTML = `Ademas rompiste tu record, con un nuevo tiempo de: ${timePlayer} s, Sigue asi!!`;
    } else {
      pRecord.innerHTML = `Tu tiempo fue de: ${timePlayer} s, tu record es de ${record} s!!`;
    }
  } else {
    record = timePlayer;
    localStorage.setItem('record_time', timePlayer);
    pRecord.innerHTML = `Completaste el juego por primera vez en un tiempo de: ${timePlayer} s, hora de romper tu record!!`;
  }
  showRecord();
  showModal(); 
}

function gameFailed() {
  hTitle.innerHTML = 'You Lost :c';
  pLogo.innerHTML = '☠️';
  pMessage.innerHTML = 'Uuuu, buena suerte la proxima vez!!';
  pRecord.innerHTML = `El record actual es de ${record} s!!`;
  playerPosition.x = (elementPos * playerPosition.col) - (elementPos/2) + fixPos;
  playerPosition.y = (elementPos * playerPosition.row) - fixPos;
  clearInterval(timeInterval);
  showModal();
}

function showModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function playAgain() {
  closeModal();
  resetGame();
}

function showLives() {
  const hearts = Array(lives).fill(emojis.HEART);
  spanLives.innerHTML = '';
  hearts.forEach(heart => spanLives.append(heart));
}

function showTime() {
  timePlayer++;
  spanTime.innerHTML = timePlayer; 
}

function showRecord() {
  spanRecord.innerHTML = record; 
}

function startGame() {
  if (!gameStarted) {
    timeInterval = setInterval(showTime,1000);
    gameStarted = true;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    renderGame();
  }
  if (gamePaused) {
    timeInterval = setInterval(showTime,1000);
    gamePaused = false;
  }
}

function pauseGame() {
  if (gameStarted) {
    clearInterval(timeInterval);
    gamePaused = true;
  }  
}

function resetGame() {
  if (timeInterval) {
    clearInterval(timeInterval);
  } 
  timePlayer = 0;
  level = 0;
  lives = 3;
  gameStarted = false;
  gamePaused = false;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  renderGame();
}

//función para inicializar el mapa
function renderGame() {
  game.font = elementSize + 'px Serif';
  game.textAlign = 'center';
  //renderizado del mapa

  const map = maps[level];
  if (!map) {
    gameWin();
    return;
  }

  if (lives <= 0) {
    gameFailed();
    return;
  } 

  const mapRow = map.trim().split('\n');
  const mapRowCol = mapRow.map((row) => row.trim().split(''));
  game.clearRect(0,0,canvasSize+20,canvasSize+20);
  bombPositions = [];
  mapRowCol.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      let posX = (elementPos * (colI + 1)) - (elementPos/2) + fixPos;
      let posY = (elementPos * (rowI + 1)) - fixPos;
      posX = fixNumber(posX);
      posY = fixNumber(posY);
      game.fillText(emoji, posX, posY);
      //renderizado del jugador
      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY; 
          playerPosition.col = colI + 1;    
          playerPosition.row = rowI + 1;
        }  
      } else if (col == 'I') {
        goalPosition.x = posX;
        goalPosition.y = posY;
      } else if (col == 'X') {
        const bombPosition = {x: posX, y: posY}
        bombPositions.push(bombPosition);
      }    
    });
  });
  if (oldElementPos !== elementPos) {
    playerPosition.x = (elementPos * playerPosition.col) - (elementPos/2) + fixPos;
    playerPosition.y = (elementPos * playerPosition.row) - fixPos;
    playerPosition.x = fixNumber(playerPosition.x);
    playerPosition.y = fixNumber(playerPosition.y);
    oldElementPos = elementPos;
  }
  spanTime.innerHTML = timePlayer; 
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
  collitions();
  showLives();
}