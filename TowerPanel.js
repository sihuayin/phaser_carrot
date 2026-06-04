import Phaser from 'phaser'

export class TowerPanel extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y)
    this.setTexture('select_01')
    this.scene = scene
    this.callback = () => {}
  }

  loadProperty (args) {
    if (args.cel < 0) {
      console.log('TowerPanel: 列数必须大于0')
      return
    }
    if (args.row < 0) {
      console.log('TowerPanel: 行号必须大于0')
      return
    }
    if (args.x === undefined) {
      console.log('TowerPanel: x坐标必须制定')
      return
    }

    if (args.y === undefined) {
      console.log('TowerPanel: Y坐标必须制定')
      return
    }

    this.cel = args.cel
    this.row = args.row
    this.setPosition(args.x + this.width / 2, args.y + this.height / 2)
    this.loadTower()
  }

  loadTower () {
    this.bot = this.scene.add.sprite(0, 0, 'Bottle01').setInteractive()
    this.bot.setName('bottle')
    this.bot.setDepth(10)
    this.bot.setOrigin(0.5, 0)
    if (this.y > this.scene.cameras.main.height - 2 * this.height) {
      this.bot.setPosition(this.x, this.y - this.height - this.bot.height / 2)
    } else {
      this.bot.setPosition(this.x, this.y + this.height / 2)
    }

    const bottleCost = this.scene.towerCosts?.bottle ?? 0
    this.costText = this.scene.add.text(this.bot.x, this.bot.y + this.bot.height + 12, `${bottleCost}`, {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#fff4b1',
      stroke: '#4a341d',
      strokeThickness: 4
    })
    this.costText.setOrigin(0.5, 0.5)
    this.costText.setDepth(10)

    this.bot.on('pointerup', (pointer) => {
      pointer.event?.preventDefault()
      this.callback(this.bot.name)
    })
  }

  setCallback (callback) {
    this.callback = callback
  }

  matchesCell (row, cel) {
    return this.row === row && this.cel === cel
  }

  destroyAll () {
    this.destroy()
    this.bot && this.bot.destroy()
    this.costText && this.costText.destroy()
    return false
  }
}
