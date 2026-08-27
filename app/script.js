const SIZE = 4;
const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const messageTextEl = document.getElementById('message-text');
const newGameBtn = document.getElementById('new-game-btn');
const tryAgainBtn = document.getElementById('try-again-btn');

let grid = [];
let score = 0;
let best = Number(localStorage.getItem('best2048') || 0);
let gameOver = false;
let won = false;

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function startGame() {
  grid = emptyGrid();
  score = 0;
  gameOver = false;
  won = false;
  messageEl.classList.add('hidden');
  addRandomTile();
  addRandomTile();
  render();
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  boardEl.innerHTML = '';

  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    boardEl.appendChild(cell);
  }

  const boardRect = boardEl.getBoundingClientRect();
  const gap = 8;
  const cellSize = (boardRect.width - gap * (SIZE + 1)) / SIZE;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const value = grid[r][c];
      if (value === 0) continue;
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.value = value;
      tile.textContent = value;
      tile.style.width = `${cellSize}px`;
      tile.style.height = `${cellSize}px`;
      tile.style.left = `${gap + c * (cellSize + gap)}px`;
      tile.style.top = `${gap + r * (cellSize + gap)}px`;
      tile.style.fontSize = `${cellSize * 0.4}px`;
      boardEl.appendChild(tile);
    }
  }

  scoreEl.textContent = score;
  if (score > best) {
    best = score;
    localStorage.setItem('best2048', String(best));
  }
  bestEl.textContent = best;
}

function slideRowLeft(row) {
  const filtered = row.filter((v) => v !== 0);
  const merged = [];
  let gained = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      merged.push(mergedValue);
      gained += mergedValue;
      if (mergedValue === 2048) won = true;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < SIZE) merged.push(0);
  return { row: merged, gained };
}

function rotateGrid(g) {
  const newGrid = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newGrid[c][SIZE - 1 - r] = g[r][c];
    }
  }
  return newGrid;
}

function move(direction) {
  if (gameOver) return;

  let rotations = 0;
  if (direction === 'up') rotations = 3;
  if (direction === 'right') rotations = 2;
  if (direction === 'down') rotations = 1;

  let working = grid;
  for (let i = 0; i < rotations; i++) working = rotateGrid(working);

  let moved = false;
  let totalGained = 0;
  const result = emptyGrid();

  for (let r = 0; r < SIZE; r++) {
    const { row, gained } = slideRowLeft(working[r]);
    result[r] = row;
    totalGained += gained;
    if (row.some((v, idx) => v !== working[r][idx])) moved = true;
  }

  let finalGrid = result;
  const reverseRotations = (4 - rotations) % 4;
  for (let i = 0; i < reverseRotations; i++) finalGrid = rotateGrid(finalGrid);

  if (moved) {
    grid = finalGrid;
    score += totalGained;
    addRandomTile();
    render();

    if (won) {
      showMessage('You win!');
      return;
    }
    if (!hasMovesLeft()) {
      gameOver = true;
      showMessage('Game over!');
    }
  }
}

function hasMovesLeft() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function showMessage(text) {
  messageTextEl.textContent = text;
  messageEl.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right',
  };
  if (map[e.key]) {
    e.preventDefault();
    move(map[e.key]);
  }
});

let touchStartX = 0;
let touchStartY = 0;

boardEl.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

boardEl.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? 'right' : 'left');
  } else {
    move(dy > 0 ? 'down' : 'up');
  }
});

newGameBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', startGame);
window.addEventListener('resize', render);

startGame();