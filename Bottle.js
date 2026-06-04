import Phaser from 'phaser'
import { Bullet } from './Bullet.js'

export class Bottle extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, config) {
    super(scene, x, y, config)
    this.scene = scene
    this.setPosition(x, y)
    this.setTexture('Bottle31')
    this.angle = 0
    this.scope = config.scope || 0
    this.x = x
    this.y = y
    this.onOver = () => {}

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    })

    this.scene.physics.add.collider(this.scene.monsters, this.bullets, this.hitBrick, null, this)
    this.timedEvent = scene.time.addEvent({ delay: 500, callback: this.onRotateAndFire, callbackScope: this, loop: true })
  }

  setOverCallback (callback) {
    this.onOver = callback
  }

  hitBrick (monster, bullet)
  {
    bullet.destroy()
    this.scene.resolveMonster(monster, { defeated: true })
  }

  onRotateAndFire () {
    if (this.scene.isGameOver || this.scene.isGameplayPaused) {
      return
    }
    const nearestEnemy = this.findNearestMonster()
    if (nearestEnemy != null) {
      const point1 = new Phaser.Geom.Point(nearestEnemy.x, nearestEnemy.y)
      const point2 = new Phaser.Geom.Point(this.x, this.y)
      const angle = Phaser.Math.Angle.BetweenPoints(point2, point1)
      const speed = 1 / Phaser.Math.PI2
      const rotateDuration = Math.abs(angle * speed)

      this.scene.tweens.add({
        delay: 10,
        targets: this,
        rotation: { value: angle, duration: rotateDuration, ease: 'Expo.easeOut' },
        onComplete: () => {
          this.onFire(nearestEnemy)
        }
      })
    }
  }

  onFire (nearestEnemy) {
    const bullet = this.bullets.get()
    if (bullet) {
      bullet.setActive(true)
      bullet.setVisible(true)
      bullet.body?.reset(this.x, this.y)
      bullet.setPosition(this.x, this.y)
      bullet.rotation = this.scene.physics.moveToObject(bullet, nearestEnemy, 1000, 500)
    }
  }

  findNearestMonster () {
    const monsterArray = this.scene.monsters.getChildren()
    let currMinDistant = this.scope
    let nearestEnemy = null
    let monster = null
    let distance = 0
    for (var i = 0; i < monsterArray.length; i++) {
      monster = monsterArray[i]
      distance = Phaser.Math.Distance.Between(this.x, this.y, monster.x, monster.y)
      if (distance < currMinDistant) {
        currMinDistant = distance
        nearestEnemy = monster
      }
    }
    this.nearestEnemy = nearestEnemy
    return nearestEnemy
  }
}
