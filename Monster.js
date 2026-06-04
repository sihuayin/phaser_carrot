import Phaser from 'phaser'
import themeAtlasData from './res/GamePlay/Object/Theme1/Monster/my_theme_1.json'

export class Monster extends  Phaser.Physics.Arcade.Sprite {
  static PATH_FOLLOW_OFFSET_X = 0
  static PATH_FOLLOW_OFFSET_Y = 0

  constructor (scene, x, y, texture, frame)
  {
      super(scene, x, y)
      this.scene = scene

      frame && this.setTexture(texture, frame) || this.setTexture(texture)
      this.setPosition(
        x + Monster.PATH_FOLLOW_OFFSET_X,
        y + Monster.PATH_FOLLOW_OFFSET_Y
      )
      this.setScale(0.68)
      this.setOrigin(0.5, 0.5)
      this.roadIndex = 0
      this.centerDebugMarker = null
      this.lastAlignedFrameName = null

      if (this.scene.debugPathMarkers) {
        this.centerDebugMarker = this.scene.add.circle(this.x, this.y, 5, 0xe74c3c, 0.95)
        this.centerDebugMarker.setDepth(121)
        this.centerDebugMarker.setStrokeStyle(2, 0x7b241c, 1)
      }
  }

  setData (data) {
    this.configData = data
    this.speed = data.speed
    this.road = data.road
    this.index = data.index
    this.namePrefix = data.namePrefix
  }

  setKill (callback) {
    this.eat = callback
  }
  run () {
    this.runNextRoad();
    this.playRunAnimation();
  }

  runNextRoad () {
    // 转方向
    if (this.road[this.roadIndex].x <= this.road[this.roadIndex + 1].x) {
      this.setFlipX(false)
    } else {
      this.setFlipX(true)
    }
    const distance = Phaser.Math.Distance.Between(this.road[this.roadIndex].x, this.road[this.roadIndex].y, this.road[this.roadIndex + 1].x, this.road[this.roadIndex + 1].y)

    // Cocos moveTo uses seconds; Phaser tween duration uses milliseconds.
    const time = Math.max(120, (distance / this.speed) * 1000)
    if (!this.scene) {
      return
    }
    this.scene.tweens.add({
      targets: this,
      props: {
        x: {
          value: this.road[this.roadIndex + 1].x + Monster.PATH_FOLLOW_OFFSET_X,
          ease: 'Power1',
          duration: time
        },
        y: {
          value: this.road[this.roadIndex + 1].y + Monster.PATH_FOLLOW_OFFSET_Y,
          ease: 'Power1',
          duration: time
        }
      },
      onComplete: () => {
        if (this.roadIndex < this.road.length - 1) {
          this.runNextRoad()
        } else {
          if (this.eat) {
            this.eat(this)
          } else {
            this.destroy()
          }
        }
      }
    })

    this.roadIndex++
  }

  playRunAnimation () {
    const animationKey = `monster_move_${this.namePrefix}`
    if (!this.scene.anims.exists(animationKey)) {
      const frames = []
      for (let i = 1; i < 4; i++) {
        frames.push({
          key: 'theme',
          frame: `Theme1/Monster/${this.namePrefix}${i}.png`
        })
      }

      this.scene.anims.create({
        key: animationKey,
        frames,
        repeat: -1,
        frameRate: 6.67
      })
    }

    this.play(animationKey)
  }

  applyFrameAlignment () {
    const frameName = this.frame?.name
    if (!frameName || this.lastAlignedFrameName === frameName) {
      return
    }

    const atlasFrame = themeAtlasData.frames[frameName]
    if (!atlasFrame) {
      this.lastAlignedFrameName = frameName
      return
    }

    const visibleWidth = atlasFrame.frame.w
    const visibleHeight = atlasFrame.frame.h
    const centerOffsetX = atlasFrame.spriteSourceSize.x + (atlasFrame.spriteSourceSize.w / 2) - (atlasFrame.sourceSize.w / 2)
    const centerOffsetY = atlasFrame.spriteSourceSize.y + (atlasFrame.spriteSourceSize.h / 2) - (atlasFrame.sourceSize.h / 2)

    this.setDisplayOrigin(
      (visibleWidth / 2) + centerOffsetX,
      (visibleHeight / 2) + centerOffsetY
    )

    this.lastAlignedFrameName = frameName
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta)
    this.applyFrameAlignment()
    if (this.centerDebugMarker) {
      this.centerDebugMarker.setPosition(this.x, this.y)
    }
  }

  des () {
    this.centerDebugMarker?.destroy()
    this.destroy()
  }

  destroy (fromScene) {
    this.centerDebugMarker?.destroy()
    this.centerDebugMarker = null
    return super.destroy(fromScene)
  }
}
