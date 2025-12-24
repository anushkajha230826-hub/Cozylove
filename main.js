const config = {
  type: Phaser.AUTO,
  parent: 'game',

  // LANDSCAPE SIZE
  width: 760,
  height: 430,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

let player;
let partner;
let heart;
let cursors;
let bgm;
let walkSound;

function preload() {

  // IMAGES (AS-IS)
  this.load.image('map', 'assets/images/map.png');
  this.load.image('player', 'assets/images/monkey.png');   // PLAYER
  this.load.image('partner', 'assets/images/penguin.png'); // YOU
  this.load.image('heart', 'assets/images/heart.png');
  this.load.image('sparkle', 'assets/images/sparkle.png');

  // AUDIO
  this.load.audio('bgm', 'assets/audio/bg.mp3');
  this.load.audio('walk', 'assets/audio/walk.mp3');
  this.load.audio('collect', 'assets/audio/sparkle.mp3');
  this.load.audio('emotion', 'assets/audio/emotion.mp3');
}

function create() {

  // ---- SHARPNESS FIX ----
  this.game.renderer.config.antialias = false;

  // ---- MAP ----
  this.add.image(380, 215, 'map')
    .setScale(2)
    .setDepth(0);

  // ---- AUDIO ----
  bgm = this.sound.add('bgm', {
    loop: true,
    volume: 0.35
  });
  bgm.play();

  walkSound = this.sound.add('walk', {
    volume: 0.2,
    loop: true
  });

  // ---- PLAYER (MONKEY) ----
  player = this.physics.add.sprite(380, 280, 'player')
    .setScale(0.25)
    .setCollideWorldBounds(true);

  // ---- PARTNER (PENGUIN) ----
  partner = this.add.sprite(380, 160, 'partner')
    .setScale(0.22);

  // ---- COLLECTIBLE ----
  heart = this.physics.add.sprite(520, 230, 'heart')
    .setScale(0.12);

  // ---- OVERLAP ----
  this.physics.add.overlap(player, heart, collectHeart, null, this);

  // ---- CONTROLS ----
  cursors = this.input.keyboard.createCursorKeys();

  // TOUCH MOVE
  this.input.on('pointerdown', (pointer) => {
    this.physics.moveTo(player, pointer.x, pointer.y, 180);
    if (!walkSound.isPlaying) walkSound.play();
  });

  // STOP WALK SOUND
  this.input.on('pointerup', () => {
    walkSound.stop();
    player.setVelocity(0);
  });
}

function update() {

  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-140);
    if (!walkSound.isPlaying) walkSound.play();
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(140);
    if (!walkSound.isPlaying) walkSound.play();
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-140);
    if (!walkSound.isPlaying) walkSound.play();
  }
  else if (cursors.down.isDown) {
    player.setVelocityY(140);
    if (!walkSound.isPlaying) walkSound.play();
  }

  // STOP SOUND IF NO MOVEMENT
  if (
    !cursors.left.isDown &&
    !cursors.right.isDown &&
    !cursors.up.isDown &&
    !cursors.down.isDown
  ) {
    walkSound.stop();
  }

  // ---- FAKE 3D DEPTH ----
  player.setDepth(player.y);
  partner.setDepth(partner.y);
  if (heart) heart.setDepth(heart.y);
}

function collectHeart(player, heart) {

  heart.destroy();

  this.sound.play('collect', { volume: 0.6 });
  this.sound.play('emotion', { volume: 0.5 });

  const sparkle = this.add.sprite(player.x, player.y - 30, 'sparkle')
    .setScale(0.2)
    .setDepth(999);

  this.tweens.add({
    targets: sparkle,
    alpha: 0,
    y: sparkle.y - 40,
    duration: 800,
    ease: 'Sine.easeOut',
    onComplete: () => sparkle.destroy()
  });
}
