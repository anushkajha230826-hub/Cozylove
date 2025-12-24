const config = {
  type: Phaser.AUTO,
  parent: 'game',

  // IMPORTANT: RESIZE MODE
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

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
let walkSound;

function preload() {

  // IMAGES
  this.load.image('map', 'assets/images/map.png');
  this.load.image('player', 'assets/images/monkey.png');
  this.load.image('partner', 'assets/images/penguin.png');
  this.load.image('heart', 'assets/images/heart.png');
  this.load.image('sparkle', 'assets/images/sparkle.png');

  // AUDIO
  this.load.audio('bgm', 'assets/audio/bg.mp3');
  this.load.audio('walk', 'assets/audio/walk.mp3');
  this.load.audio('collect', 'assets/audio/sparkle.mp3');
  this.load.audio('emotion', 'assets/audio/emotion.mp3');
}

function create() {

  // Camera bounds = visible screen
  this.cameras.main.setBounds(
    0,
    0,
    this.scale.width,
    this.scale.height
  );

  // Background map (centered properly)
  this.map = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2,
    'map'
  ).setScale(2);

  // Background music
  this.sound.add('bgm', {
    loop: true,
    volume: 0.35
  }).play();

  // Walk sound (safe)
  walkSound = this.sound.add('walk', {
    loop: true,
    volume: 0.25
  });

  // Player (Monkey)
  player = this.physics.add.sprite(
    this.scale.width / 2,
    this.scale.height / 2 + 60,
    'player'
  )
  .setScale(0.25)
  .setCollideWorldBounds(true);

  // Partner (Penguin)
  partner = this.add.sprite(
    this.scale.width / 2,
    this.scale.height / 2 - 60,
    'partner'
  ).setScale(0.22);

  // Collectible heart
  heart = this.physics.add.sprite(
    this.scale.width / 2 + 120,
    this.scale.height / 2,
    'heart'
  ).setScale(0.12);

  this.physics.add.overlap(player, heart, collectHeart, null, this);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Touch move
  this.input.on('pointerdown', (pointer) => {
    this.physics.moveTo(player, pointer.x, pointer.y, 180);
    if (!walkSound.isPlaying) walkSound.play();
  });

  this.input.on('pointerup', () => {
    player.setVelocity(0);
    if (walkSound.isPlaying) walkSound.stop();
  });
}

function update() {

  let moving = false;
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-140);
    moving = true;
  } else if (cursors.right.isDown) {
    player.setVelocityX(140);
    moving = true;
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-140);
    moving = true;
  } else if (cursors.down.isDown) {
    player.setVelocityY(140);
    moving = true;
  }

  // Footstep sound logic
  if (moving && !walkSound.isPlaying) walkSound.play();
  if (!moving && walkSound.isPlaying) walkSound.stop();

  // Fake depth
  player.setDepth(player.y);
  partner.setDepth(partner.y);
  if (heart) heart.setDepth(heart.y);
}

function collectHeart(player, heart) {

  heart.destroy();

  this.sound.play('collect', { volume: 0.6 });
  this.sound.play('emotion', { volume: 0.5 });

  const sparkle = this.add.sprite(
    player.x,
    player.y - 30,
    'sparkle'
  ).setScale(0.2);

  this.tweens.add({
    targets: sparkle,
    alpha: 0,
    y: sparkle.y - 40,
    duration: 800,
    ease: 'Sine.easeOut',
    onComplete: () => sparkle.destroy()
  });
}  else if (cursors.right.isDown) {
    player.setVelocityX(140);
    moving = true;
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-140);
    moving = true;
  }
  else if (cursors.down.isDown) {
    player.setVelocityY(140);
    moving = true;
  }

  // WALK SOUND STATE LOGIC (NO REPEAT)
  if (moving && !walkSound.isPlaying) {
    walkSound.play();
  }

  if (!moving && walkSound.isPlaying) {
    walkSound.stop();
  }

  // FAKE 3D DEPTH
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
