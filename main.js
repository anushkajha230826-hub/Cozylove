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
const player = { x: 100, y: 100, r: 40 };
const partner = { x: 500, y: 300, r: 35 };
const heart = { x: 700, y: 200, r: 20, collected: false };
let moving = false;

/* TOUCH MOVE */
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  player.x = touch.clientX;
  player.y = touch.clientY;
  if (!moving) { walkSound.play(); moving = true; }
});
canvas.addEventListener("touchend", () => { walkSound.pause(); moving = false; });
canvas.addEventListener("touchcancel", () => { walkSound.pause(); moving = false; });

/* COLLISION DETECTION */
function hit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}

/* DRAW CHARACTER SHAPES */
function drawPlayer() {
  // Monkey: brown circle body + ears
  ctx.fillStyle = "#a0522d";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.arc(player.x - player.r*0.6, player.y - player.r*0.6, player.r*0.3, 0, Math.PI*2);
  ctx.arc(player.x + player.r*0.6, player.y - player.r*0.6, player.r*0.3, 0, Math.PI*2);
  ctx.fill();
}

function drawPartner() {
  // Penguin: black circle with white belly
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(partner.x, partner.y, partner.r, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(partner.x, partner.y + 5, partner.r*0.6, 0, Math.PI*2);
  ctx.fill();
}

function drawHeart(x, y, r) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x - r/2, y, r/2, 0, Math.PI*2);
  ctx.arc(x + r/2, y, r/2, 0, Math.PI*2);
  ctx.lineTo(x, y + r);
  ctx.closePath();
  ctx.fill();
}

/* GAME LOOP */
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Floor gradient
  const floorGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  floorGradient.addColorStop(0, "#a0d8f1");
  floorGradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw heart
  if (!heart.collected) drawHeart(heart.x, heart.y, heart.r);

  // Draw partner & player
  drawPartner();
  drawPlayer();

  // Collision with heart
  if (!heart.collected && hit(player, heart)) {
    heart.collected = true;
    collectSound.play();

    // Sparkle effect
    for (let i=0;i<8;i++){
      setTimeout(() => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(player.x + Math.random()*50 - 25, player.y + Math.random()*50 - 25, 5, 5);
      }, i*50);
    }
  }

  requestAnimationFrame(loop);
}

loop();  if (!heart.collected && hit(player, heart)) {
    heart.collected = true;
    collectSound.play();
    // Sparkle effect (simple circle)
    for (let i=0;i<8;i++){
      setTimeout(()=>ctx.fillRect(player.x+Math.random()*50-25, player.y+Math.random()*50-25,5,5), i*50);
    }
  }

  requestAnimationFrame(loop);
}

loop();    drawWidth = canvas.height * mapAspect;
  }

  ctx.drawImage(
    assets.map,
    0, 0, assets.map.width, assets.map.height,
    0, 0, drawWidth, drawHeight
  );
}

/* GAME LOOP */
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map stretched with aspect ratio
  const mapAspect = assets.map.width / assets.map.height;
  let drawWidth = canvas.width;
  let drawHeight = canvas.width / mapAspect;

  if (drawHeight < canvas.height) {
    drawHeight = canvas.height;
    drawWidth = canvas.height * mapAspect;
  }

  ctx.drawImage(
    assets.map,
    0, 0, assets.map.width, assets.map.height,
    0, 0, drawWidth, drawHeight
  );

  // Draw heart collectible
  if (!heart.collected) {
    ctx.drawImage(assets.heart, heart.x, heart.y, heart.size, heart.size);
  }

  // Draw partner
  ctx.drawImage(assets.partner, partner.x, partner.y, partner.size, partner.size);

  // Draw player
  ctx.drawImage(assets.player, player.x, player.y, player.size, player.size);

  // Collision
  if (!heart.collected && hit(player, heart)) {
    heart.collected = true;
    collectSound.play();

    // Sparkle effect
    ctx.drawImage(assets.sparkle, player.x, player.y - 30, 80, 80);
  }

  requestAnimationFrame(loop);
  }  // Draw partner
  ctx.drawImage(assets.partner, partner.x, partner.y, partner.size, partner.size);

  // Draw player
  ctx.drawImage(assets.player, player.x, player.y, player.size, player.size);

  // Collision
  if (!heart.collected && hit(player, heart)) {
    heart.collected = true;
    collectSound.play();

    // Sparkle effect
    ctx.drawImage(assets.sparkle, player.x, player.y - 30, 80, 80);
  }

  requestAnimationFrame(loop);
               }    // Sparkle effect
    ctx.drawImage(assets.sparkle, player.x, player.y - 30, 80, 80);
  }

  requestAnimationFrame(loop);
}

loop();
