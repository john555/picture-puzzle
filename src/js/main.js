'use strict';

const select = function(id) {
  return document.getElementById(id);
};

const gameContainer = select('gameContainer');
const startButton = select('startButton');
const minute = select('minute');
const seconds = select('seconds');

let bestTime = 0;

const { width } = gameContainer.getBoundingClientRect();
const columns = 4;
const rows = 4;
const tileSize = Math.round(width / columns);

const gameOptions = {
  tileSize,
  columns,
  rows,
  difficulty: 0.08,
  image: {
    url: 'https://images.pexels.com/photos/1307662/pexels-photo-1307662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    preserve: 'height',
    offset: -50,
  }
};

const puzzle = new PicturePuzzle(gameOptions);

startButton.addEventListener('click', () => {
  puzzle.start();
  startButton.style.visibility = 'hidden';
});

function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;

  m = (m < 10) ? `0${m}` : m;
  s = (s < 10) ? `0${s}` : s;
  return {
    minutes: m,
    seconds: s,
  };
}

puzzle.onTimeUpdate(function(event) {
  const time = formatTime(event.time);
  minute.innerText = time.minutes;
  seconds.innerText = time.seconds;
  console.log('-->', event.time);
});

puzzle.onSolve(function(event) {
  console.log(event.time);
  startButton.style.visibility = 'visible';
  if (event.time < bestTime) {
    bestTime = event.time;
  } 
  
});

gameContainer.appendChild(puzzle.stage);
