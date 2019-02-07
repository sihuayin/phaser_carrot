class Bullet extends  Phaser.Physics.Arcade.Sprite {
  constructor (scene) {
    super(scene, 0, 0)

    this.setPosition(0, 0)
    this.setTexture('PBottle31')
    this.speed = 10
  }

  fire  (x, y) {
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  }

}