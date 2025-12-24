const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 430,
  height: 760,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: { preload, create, update },
  pixelArt: false
};

const game = new Phaser.Game(config);

let player, partner, cursors, bgm;

function preload() {
  // Images
  this.load.image('map', 'assets/images/map.png');
  this.load.image('player', 'assets/images/monkey.png');
  this.load.image('partner', 'assets/images/penguin.png');
  this.load.image('heart', 'assets/images/heart.png');
  this.load.image('sparkle', 'assets/images/sparkle.png');

  // Audio
  this.load.audio('bgm', 'assets/audio/bg.mp3');
  this.load.audio('walk', 'assets/audio/walk.mp3');
  this.load.audio('collect', 'assets/audio/sparkle.mp3');
  this.load.audio('emotion', 'assets/audio/emotion.mp3');
}

function create() {
  // Disable blur
  this.game.renderer.config.antialias = false;

  // Map
  const map = this.add.image(215, 380, 'map').setScale(2);

  // Sounds
  bgm = this.sound.add('bgm', { loop: true, volume: 0.3 });
  bgm.play();

  // Player (Monkey)
  player = this.physics.add.sprite(215, 500, 'player')
    .setScale(0.25)
    .setDepth(2);

  // Partner (Penguin)
  partner = this.add.sprite(215, 300, 'partner')
    .setScale(0.22)
    .setDepth(1);

  // Collectible
  const heart = this.physics.add.sprite(215, 400, 'heart')
    .setScale(0.12)
    .setDepth(1);

  // Overlap logic
  this.physics.add.overlap(player, heart, () => {
    heart.destroy();
    this.sound.play('collect', { volume: 0.6 });

    const sparkle = this.add.sprite(player.x, player.y - 30, 'sparkle')
      .setScale(0.2)
      .setDepth(3);

    this.tweens.add({
      targets: sparkle,
      alpha: 0,
      y: sparkle.y - 40,
      duration: 800,
      onComplete: () => sparkle.destroy()
    });

    this.sound.play('emotion', { volume: 0.5 });
  });

  // Controls (tap + keyboard)
  cursors = this.input.keyboard.createCursorKeys();

  this.input.on('pointerdown', pointer => {
    this.physics.moveTo(player, pointer.x, pointer.y, 200);
    this.sound.play('walk', { volume: 0.2 });
  });
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-120);
  else if (cursors.right.isDown) player.setVelocityX(120);

  if (cursors.up.isDown) player.setVelocityY(-120);
  else if (cursors.down.isDown) player.setVelocityY(120);

  // Fake 3D depth
  player.setDepth(player.y);
  partner.setDepth(partner.y);
}
