class LevelEffect extends Phaser.GameObjects.Sprite {

  constructor (scene, x, y)
  {
      super(scene, x, y);

      this.setTexture('level_effect');
      this.setPosition(x, y);

      this.play(scene)
  }

  play (scene) {
    this.setScale(0.35, 0.35)

    this.setAlpha(1)

    scene.time.addEvent({ delay: 640, callback: () => {
      scene.tweens.add({
        targets: this,
        alpha: {value: 0, duration: 560, ease: 'Expo.easeOut'}
      })
    }, callbackScope: this, loop: false })

    // 
    this.ani(scene)
  }
  ani (scene) {
    scene.tweens.add({
      targets: this,
      scaleX: { value: 1.35, duration: 800, ease: 'Power1' },
      scaleY: { value: 1.35, duration: 800, ease: 'Power1' },
      yoyo: false,
      onComplete: () => {
        scene.time.addEvent({ delay: 1000, callback: () => {
          this.play(scene)
        }, callbackScope: this, loop: false })
      }
    })
  }
}