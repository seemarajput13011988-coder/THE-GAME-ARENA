const cells = Array.from(document.querySelectorAll('.cell'));
const resetBtn = document.getElementById('reset');
const msg = document.getElementById('message');
const turnEl = document.getElementById('turn');

let turnO = true;
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function setTurnText(){ turnEl.textContent = `Turn: ${turnO ? 'O' : 'X'}`; }
setTurnText();

cells.forEach((c) => {
  c.addEventListener('click', () => {
    c.textContent = turnO ? 'O' : 'X';
    c.style.color = turnO ? '#39d353' : '#e6e8ef';
    c.disabled = true;
    if (checkWinner()) return;
    turnO = !turnO;
    setTurnText();
  });
});

function checkWinner(){
  for(const [a,b,c] of wins){
    const v1 = cells[a].textContent, v2 = cells[b].textContent, v3 = cells[c].textContent;
    if(v1 && v1 === v2 && v2 === v3){
      show(`Winner: ${v1}`); disableAll(); return true;
    }
  }
  if(cells.every(cell => cell.textContent)){ show('Draw'); return true; }
  return false;
}

function disableAll(){ cells.forEach(c => c.disabled = true); }
function enableAll(){ cells.forEach(c => { c.disabled = false; c.textContent = ''; }); }
function show(text){ msg.textContent = text; msg.classList.remove('hidden'); }

function reset(){
  turnO = true; msg.classList.add('hidden'); enableAll(); setTurnText();
}

resetBtn.addEventListener('click', reset);
