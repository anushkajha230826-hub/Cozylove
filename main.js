const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const notice = document.getElementById("rotateNotice");

/* RESIZE + LANDSCAPE */
function resize() {
  const isLandscape = window.innerWidth > window.innerHeight;
  notice.style.display = isLandscape ? "none" : "flex";

  // Make canvas always fill screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 300));
resize();

/* ASSETS */
const assets = {
  map: new Image(),
  player: new Image(),
  partner: new Image(),
  heart: new Image(),
  sparkle: new Image()
};

assets.map.src = "assets/images/map.png";
assets.player.src = "assets/images/monkey.png";
assets.partner.src = "assets/images/penguin.png";
assets.heart.src = "assets/images/heart.png";
assets.sparkle.src = "assets/images/sparkle.png";

/* AUDIO */
const ambience = new Audio("assets/audio/location_ambience.mp3.mp3");
ambience.loop = true;
ambience.volume = 0.35;

const walkSound = new Audio("assets/audio/walk.mp3");
walkSound.loop = true;
walkSound.volume = 0.2;

const collectSound = new Audio("assets/audio/collect.mp3");

let audioStarted = false;
document.addEventListener("touchstart", () => {
  if (!audioStarted) {
    ambience.play();
    audioStarted = true;
  }
});

/* GAME OBJECTS */
const player = { x: 200, y: 200, size: 120 };
const partner = { x: 500, y: 300, size: 120 };
const heart = { x: 700, y: 350, size: 60, collected: false };

let moving = false;
function startFootsteps() {
  if (!moving) {
    walkSound.currentTime = 0;
    walkSound.play();
    moving = true;
  }
}
function stopFootsteps() {
  walkSound.pause();
  walkSound.currentTime = 0;
  moving = false;
}

/* TOUCH MOVE */
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  player.x = touch.clientX - player.size / 2;
  player.y = touch.clientY - player.size / 2;
  startFootsteps();
});
canvas.addEventListener("touchend", stopFootsteps);
canvas.addEventListener("touchcancel", stopFootsteps);

/* COLLISION DETECTION */
function hit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < 80;
}

/* WAIT UNTIL ALL IMAGES LOADED */
let loadedImages = 0;
const totalImages = Object.keys(assets).length;

for (let key in assets) {
  assets[key].onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      // Start game after images loaded
      drawInitialMap();
      loop();
    }
  };
}

/* DRAW INITIAL MAP SCALED PROPERLY */
function drawInitialMap() {
  // Scale map to fill width but maintain aspect ratio
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
