// UI elements
const btns = document.querySelectorAll('[data-move]');
const youEl = document.getElementById('you');
const cpuEl = document.getElementById('cpu');
const resultEl = document.getElementById('result');

let you = 0, cpu = 0;

// MP3 sounds in /assets/sounds
const sClick = new Audio('../../assets/sounds/click.mp3');
const sWin   = new Audio('../../assets/sounds/win.mp3');
const sLose  = new Audio('../../assets/sounds/lose.mp3');
const sDraw  = new Audio('../../assets/sounds/draw.mp3');

// Play and optionally stop after ms (good for long 5s clips)
function playShort(audio, ms = 300){
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    if (ms && ms > 0) {
      setTimeout(() => { audio.pause(); audio.currentTime = 0; }, ms);
    }
  } catch {}
}

function cpuMove(){
  return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
}

function judge(p, c){
  if (p === c) return 'Draw';
  if (
    (p === 'rock' && c === 'scissors') ||
    (p === 'paper' && c === 'rock') ||
    (p === 'scissors' && c === 'paper')
  ) return 'You win';
  return 'CPU wins';
}

btns.forEach(b => b.addEventListener('click', () => {
  playShort(sClick, 120);
  playRound(b.dataset.move);
}));

function playRound(pick){
  const c = cpuMove();
  const res = judge(pick, c);

  if (res === 'You win') { you++; playShort(sWin, 350); }
  else if (res === 'CPU wins') { cpu++; playShort(sLose, 350); }
  else { playShort(sDraw, 180); }

  youEl.textContent = `You: ${you}`;
  cpuEl.textContent = `CPU: ${cpu}`;
  const em = { rock:'✊', paper:'✋', scissors:'✌️' };
  resultEl.textContent = `You: ${em[pick]||pick} • CPU: ${em[c]||c} → ${res}`;
}
