const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const notice = document.getElementById("rotateNotice");

/* RESIZE + LANDSCAPE */
function resize() {
  const isLandscape = window.innerWidth > window.innerHeight;
  notice.style.display = isLandscape ? "none" : "flex";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 300));
resize();

/* AUDIO */
const ambience = new Audio("audio/ambience.mp3");
ambience.loop = true;
ambience.volume = 0.3;

const walkSound = new Audio("audio/walk.mp3");
walkSound.loop = true;
walkSound.volume = 0.2;

const collectSound = new Audio("audio/collect.mp3");

let audioStarted = false;
document.addEventListener("touchstart", () => {
  if (!audioStarted) {
    ambience.play();
    audioStarted = true;
  }
});

/* GAME OBJECTS */
const player = { x: 100, y: 300, r: 40, vy:0, onGround:false };
const gravity = 0.8;
const jumpStrength = -15;

const platforms = [
  {x:0, y:400, width:canvas.width, height:20},
  {x:200, y:300, width:150, height:20},
  {x:400, y:200, width:150, height:20}
];

const heart = { x:450, y:150, r:20, collected:false };
let movingLeft=false, movingRight=false;

/* TOUCH CONTROLS */
canvas.addEventListener("touchstart", e => {
  if (!audioStarted) { ambience.play(); audioStarted = true; }
  const touch = e.touches[0];
  if (touch.clientX < canvas.width/2) movingLeft=true;
  else movingRight=true;
});

canvas.addEventListener("touchend", e => {
  movingLeft=false; movingRight=false;
});

/* COLLISION DETECTION */
function hit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}

/* DRAW FUNCTIONS */
function drawPlayer() {
  ctx.fillStyle="#a0522d";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r,0,Math.PI*2);
  ctx.fill();
  // Ears
  ctx.beginPath();
  ctx.arc(player.x - player.r*0.6, player.y - player.r*0.6, player.r*0.3, 0, Math.PI*2);
  ctx.arc(player.x + player.r*0.6, player.y - player.r*0.6, player.r*0.3, 0, Math.PI*2);
  ctx.fill();
}

function drawPartner() {
  ctx.fillStyle="#000";
  ctx.beginPath();
  ctx.arc(700,150,35,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle="#fff";
  ctx.beginPath();
  ctx.arc(700,155,21,0,Math.PI*2);
  ctx.fill();
}

function drawHeart(x,y,r) {
  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.arc(x-r/2,y,r/2,0,Math.PI*2);
  ctx.arc(x+r/2,y,r/2,0,Math.PI*2);
  ctx.lineTo(x,y+r);
  ctx.closePath();
  ctx.fill();
}

function drawPlatforms() {
  ctx.fillStyle="#654321";
  platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.width,p.height));
}

/* GAME LOOP */
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Gradient background
  const bg = ctx.createLinearGradient(0,0,0,canvas.height);
  bg.addColorStop(0,"#a0d8f1");
  bg.addColorStop(1,"#ffffff");
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawPlatforms();
  drawHeart(heart.x,heart.y,heart.r);
  drawPartner();
  drawPlayer();

  // Player movement
  if (movingLeft) { player.x-=5; if(!walkSound.paused) walkSound.play(); }
  if (movingRight) { player.x+=5; if(!walkSound.paused) walkSound.play(); }

  // Gravity
  player.vy += gravity;
  player.y += player.vy;
  player.onGround = false;

  // Platform collisions
  platforms.forEach(p=>{
    if(player.y+player.r>p.y && player.y+player.r< p.y + p.height && player.x>p.x && player.x<p.x+p.width){
      player.y=p.y - player.r;
      player.vy=0;
      player.onGround=true;
    }
  });

  // Jump automatically if touching ground (simplified for prototype)
  if(player.onGround && player.vy===0) player.vy=jumpStrength;

  // Collision with heart
  if(!heart.collected && hit(player, heart)){
    heart.collected=true;
    collectSound.play();
    // Show message overlay
    ctx.fillStyle="white";
    ctx.font="40px sans-serif";
    ctx.fillText("I", player.x-10, player.y-50);
  }

  requestAnimationFrame(loop);
}

loop();
