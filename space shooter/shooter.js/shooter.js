const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;
const keys = new Set();

const player = { x: W/2-20, y: H-80, w: 40, h: 40, speed: 5, cooldown: 0 };
const bullets = [];
const enemies = [];
let tick = 0, gameOver = false, score = 0;

window.addEventListener('keydown', e => { keys.add(e.code); });
window.addEventListener('keyup', e => { keys.delete(e.code); });

function rect(x,y,w,h,color){ ctx.fillStyle = color; ctx.fillRect(x,y,w,h); }

function spawnEnemy(){
  const w = 36, h = 24;
  const x = Math.random() * (W - w);
  const y = -h;
  const speed = 1 + Math.random()*1.5;
  enemies.push({ x, y, w, h, speed });
}

function update(){
  if(gameOver) return; tick++;

  if(keys.has('ArrowLeft')) player.x -= player.speed;
  if(keys.has('ArrowRight')) player.x += player.speed;
  if(keys.has('ArrowUp')) player.y -= player.speed;
  if(keys.has('ArrowDown')) player.y += player.speed;
  player.x = Math.max(0, Math.min(W - player.w, player.x));
  player.y = Math.max(0, Math.min(H - player.h, player.y));

  if(player.cooldown > 0) player.cooldown--;
  if(keys.has('Space') && player.cooldown === 0){
    bullets.push({ x: player.x + player.w/2 - 3, y: player.y - 10, w: 6, h: 14, speed: 9 });
    player.cooldown = 10;
  }

  for(const b of bullets) b.y -= b.speed;
  for(let i=bullets.length-1;i>=0;i--) if(bullets[i].y + bullets[i].h < 0) bullets.splice(i,1);

  if(tick % 45 === 0) spawnEnemy();
  for(const e of enemies) e.y += e.speed;
  for(let i=enemies.length-1;i>=0;i--) if(enemies[i].y > H+40) enemies.splice(i,1);

  function hit(a,b){ return !(a.x+a.w<b.x || b.x+b.w<a.x || a.y+a.h<b.y || b.y+b.h<a.y); }

  for(let i=enemies.length-1;i>=0;i--){
    const e = enemies[i];
    for(let j=bullets.length-1;j>=0;j--){
      const b = bullets[j];
      if(hit(e,b)){ enemies.splice(i,1); bullets.splice(j,1); score+=10; break; }
    }
    if(enemies[i] && hit(enemies[i], player)){ gameOver = true; break; }
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#0b1026'; ctx.fillRect(0,0,W,H);
  rect(player.x, player.y, player.w, player.h, '#5b8cff');
  for(const b of bullets) rect(b.x,b.y,b.w,b.h,'#39d353');
  for(const e of enemies) rect(e.x,e.y,e.w,e.h,'#ff6b6b');

  ctx.fillStyle = '#e6e8ef'; ctx.font = '16px system-ui';
  ctx.fillText(`Score: ${score}`, 12, 24);
  if(gameOver){
    ctx.font = '28px system-ui';
    ctx.fillText('Game Over — Refresh to restart', W/2 - 170, H/2);
  }
}

function loop(){ update(); draw(); requestAnimationFrame(loop); }
loop();
