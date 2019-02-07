class TowerPanel extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y)
    this.setTexture('select_01')
    this.scene = scene
    this.callback = () => {}
  }

  loadProperty (args) {
    if (args.cel < 0) {
      console.log('TowerPanel: 列数必须大于0')
      return ;
    }
    if (args.row < 0) {
      console.log('TowerPanel: 行号必须大于0')
      return ;
    }
    if (args.x === undefined) {
      console.log('TowerPanel: x坐标必须制定');
      return ;
    }

    if (args.y === undefined) {
      console.log('TowerPanel: Y坐标必须制定');
      return ;
    }

    this.cel = args.cel;
    this.row = args.row;
    // this.x = args.x + this.width / 2;
    // this.y = args.y + this.height / 2;
    console.log(args.x + this.width / 2, args.y + this.height / 2)
    this.setPosition(args.x + this.width / 2, args.y + this.height / 2)
    this.loadTower()
    // this.scene.input.on('gameobjectdown', (pointer, gameObject) => {
    //   pointer.event.preventDefault()
    //   pointer.event.stopPropagation()
    //   // gameObject.destroy();
    //   if (gameObject.getData('name') === 'bottle') {
    //     this.callback()
    //   }
    //   return false;
    // });
  }

  loadTower () {
    this.bot = this.scene.add.sprite(0, 0, 'Bottle01').setInteractive()
    this.bot.setName('bottle')
    this.bot.setDepth(10)
    this.bot.setOrigin(0.5, 0)
    if (this.y > this.scene.cameras.main.height - 2 * this.height) {
      this.bot.setPosition(this.x , this.y - this.height - this.bot.height / 2)
    } else {
      this.bot.setPosition(this.x, this.y + this.height/ 2)
    }

    this.bot.on('pointerdown', (pointer) => {
      pointer.event.preventDefault()
      this.scene.input.stopPropagation()

        this.callback()
      
    })
  }

  setCallback(callback) {
    this.callback = callback
  }

  destroyAll () {
    this.scene.input.off('gameobjectdown')
    this.destroy()
    this.bot && this.bot.destroy()
    return false
  }
}