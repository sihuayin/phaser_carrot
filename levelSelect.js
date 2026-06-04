import Phaser from 'phaser'
import { LevelEffect } from './levelEffect.js'

let controls

export class levelSelect extends Phaser.Scene {
  constructor () {
    super('level_select')
    this.scrollWidth = 0
    this.isDraggingMap = false
    this.lastPointerX = 0
    this.dragStartX = 0
    this.dragMovedEnough = false
    this.handleCanvasPointerDown = null
    this.handleCanvasPointerMove = null
    this.handleCanvasPointerUp = null
    this.routeButtonArray = []
    this.levelLabelArray = []
    this.currentLevel = 2
    this.maxPlayableLevel = 3
    this.unlockedLevelCount = 1
    this.fixedUiPressed = false
    this.zOrderMap = {
      route: 1,
      routeButtonEffect: 5,
      routeButtonEffectNode: 5,
      levelButton: 10,
      levelLabel: 12
    }
  }

  preload () {
    this.load.tilemapTiledJSON('map', 'res/ChooseLevel/Map/TiledMap.json')
    for (let i = 0; i < 14; i++) {
      this.load.image(`stage_map_${i}`, `res/ChooseLevel/Map/stage_map_${i}.png`)
    }
    for (let i = 1; i < 135; i++) {
      this.load.image(`route_${i}`, `res/ChooseLevel/Route/route_${i}.png`)
    }

    this.load.image('choose_level_adv', 'res/ChooseLevel/stagepoint_adv.png')
    this.load.image('choose_level_boss', 'res/ChooseLevel/stagepoint_gate.png')
    this.load.image('choose_level_time', 'res/ChooseLevel/stagepoint_time.png')
    this.load.image('choose_level_chance', 'res/ChooseLevel/stagepoint_chance.png')
    this.load.image('choose_level_leftbg', 'res/ChooseLevel/stagemap_toolbar_leftbg.png')
    this.load.image('choose_level_home_button', 'res/ChooseLevel/stagemap_toolbar_home.png')
    this.load.image('choose_level_shop_button', 'res/ChooseLevel/stagemap_toolbar_shop.png')
    this.load.image('choose_level_ranking_button', 'res/ChooseLevel/stagemap_toolbar_leaderboard.png')
    this.load.image('choose_level_discount', 'res/ChooseLevel/zh/discount_tag_stone.png')
    this.load.image('numbers', 'res/ChooseLevel/discount.png')
    this.load.image('choose_level_rightbg', 'res/ChooseLevel/stagemap_toolbar_rightbg.png')
    this.load.image('choose_level_overten', 'res/ChooseLevel/zh/stagemap_toolbar_overten.png')
    this.load.image('level_effect', 'res/ChooseLevel/stagemap_local.png')
  }

  create () {
    if (!this.sound.get('front_bg_music')?.isPlaying) {
      const bgMusic = this.sound.add('front_bg_music', { loop: true })
      bgMusic.play()
    }

    this.loadProperty()
    this.loadBackgroundLayer()
    this.loadMainLayer()
    this.registerDragScroll()
    this.loadUI()
  }

  loadProperty () {
    this.routeButtonArray = []
    this.levelLabelArray = []
    this.unlockedLevelCount = Phaser.Math.Clamp(
      Number(window.localStorage.getItem('carrot_unlocked_level_count') || 1),
      1,
      this.maxPlayableLevel
    )
    this.currentLevel = this.resolveCurrentLevel()
  }

  resolveCurrentLevel () {
    const selectedLevelIndex = Number(this.registry.get('selectedLevelIndex') ?? 0)
    return Phaser.Math.Clamp(selectedLevelIndex + 1, 1, this.unlockedLevelCount)
  }

  loadBackgroundLayer () {
    const map = this.add.tilemap('map')
    this.scrollContainer = this.add.container(0, 0)

    let nextPosX = 0
    for (let i = 0; i < 14; i++) {
      const imageView = this.add.sprite(0, 0, `stage_map_${i}`)
      imageView.setOrigin(0, 0.5)
      imageView.setPosition(nextPosX, this.cameras.main.height / 2)
      this.scrollContainer.add(imageView)
      nextPosX += imageView.width
    }

    this.scrollWidth = nextPosX
    this.cameras.main.setBounds(0, 0, nextPosX, this.cameras.main.height)

    const cursors = this.input.keyboard.createCursorKeys()
    controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 1.0
    })

    this.loadTiledMap(map)
    this.loadLevel(this.currentLevel)
  }

  loadTiledMap (map) {
    const objectLayer = map.getObjectLayer('point')
    this.buttonContainer = this.add.container(0, 0)
    this.buttonContainer.setDepth(this.zOrderMap.levelButton)
    this.labelContainer = this.add.container(0, 0)
    this.labelContainer.setDepth(this.zOrderMap.levelLabel)

    const objs = objectLayer.objects
    for (let i = 0; i < objs.length; i++) {
      const button = this.add.sprite(0, 0, 'choose_level_adv').setInteractive()
      let texture = 'choose_level_adv'
      if (objs[i].isBoos === 'YES') {
        texture = 'choose_level_boss'
      } else if (objs[i].isTime === 'YES') {
        texture = 'choose_level_time'
      } else if (objs[i].isChange === 'YES') {
        texture = 'choose_level_chance'
      }

      button.setTexture(texture)
      button.setPosition(objs[i].x, objs[i].y)
      button.setData('levelIndex', i)
      const isUnlocked = i < this.unlockedLevelCount
      button.setAlpha(isUnlocked ? 1 : 0.45)
      if (isUnlocked) {
        button.on('pointerup', () => {
          if (this.dragMovedEnough) {
            return
          }
          this.sound.get('front_bg_music')?.stop()
          this.registry.set('selectedLevelIndex', i)
          this.scene.start('game_play', { levelIndex: i })
        })
      }

      this.buttonContainer.add(button)
      this.routeButtonArray.push(button)

      if (i < this.maxPlayableLevel) {
        const label = this.add.text(objs[i].x, objs[i].y - 2, String(i + 1), {
          fontFamily: 'Arial',
          fontSize: 24,
          color: isUnlocked ? '#fffbe8' : '#d7cab1',
          stroke: '#5b3b1a',
          strokeThickness: 5
        })
        label.setOrigin(0.5, 0.5)
        this.labelContainer.add(label)
        this.levelLabelArray.push(label)
      }
    }
  }

  loadMainLayer () {
    this.routeContainer = this.add.container(0, 0)
    this.routeContainer.setDepth(this.zOrderMap.route)
  }

  loadLevel (level) {
    this.loadRoute(level)
    this.loadLevelEffects(level)
    this.focusCurrentLevel(level)
  }

  loadRoute (level) {
    this.routeContainer.removeAll(true)
    for (let i = 0; i < level - 1; i++) {
      const node = this.add.sprite(0, 0, `route_${i + 1}`)
      if (i % 10 === 9) {
        node.setOrigin(0, 0.5)
      }
      node.x = node.width / 2 + Math.floor(i / 10) * node.width
      node.y = this.cameras.main.height / 2
      this.routeContainer.add(node)
    }
  }

  loadLevelEffects (level) {
    const button = this.routeButtonArray[level - 1]
    if (!button) {
      return
    }
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(250 * i, () => {
        const effect = new LevelEffect(this, button.x, button.y)
        this.add.existing(effect)
      })
    }
  }

  focusCurrentLevel (level) {
    const button = this.routeButtonArray[level - 1]
    if (!button) {
      return
    }
    const maxScrollX = Math.max(0, this.scrollWidth - this.cameras.main.width)
    this.cameras.main.scrollX = Phaser.Math.Clamp(button.x - this.cameras.main.width / 2, 0, maxScrollX)
  }

  loadUI () {
    this.loadTopLeftButtons()
    this.loadDiscountButton()
    this.loadLifeStar()
  }

  loadTopLeftButtons () {
    const leftPanel = this.add.image(0, this.cameras.main.height, 'choose_level_leftbg')
    leftPanel.setOrigin(0, 1)

    this.leftContainer = this.add.container(0, 0, [leftPanel])
    this.leftContainer.setScrollFactor(0)

    this.loadHomeButton(leftPanel)
    this.loadShopButton(leftPanel)
    this.loadRankingButton(leftPanel)
  }

  loadHomeButton () {
    const homeButton = this.add.sprite(10, 10, 'choose_level_home_button').setInteractive()
    homeButton.setData('fixedUi', true)
    homeButton.setOrigin(0, 0)
    homeButton.on('pointerdown', () => {
      this.fixedUiPressed = true
    })
    homeButton.on('pointerdown', () => {
      this.scene.start('main_menu')
    })
    this.leftContainer.add(homeButton)
  }

  loadShopButton () {
    const shopButton = this.add.sprite(111, 10, 'choose_level_shop_button').setInteractive()
    shopButton.setData('fixedUi', true)
    shopButton.setOrigin(0, 0)
    shopButton.on('pointerdown', () => {
      this.fixedUiPressed = true
    })
    this.leftContainer.add(shopButton)
  }

  loadRankingButton () {
    const rankingButton = this.add.sprite(212, 10, 'choose_level_ranking_button').setInteractive()
    rankingButton.setData('fixedUi', true)
    rankingButton.setOrigin(0, 0)
    rankingButton.on('pointerdown', () => {
      this.fixedUiPressed = true
    })
    this.leftContainer.add(rankingButton)
  }

  loadDiscountButton () {
    this.midContainer = this.add.container(0, 0)
    this.midContainer.setScrollFactor(0)

    const discount = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height, 'choose_level_discount').setInteractive()
    discount.setData('fixedUi', true)
    discount.setOrigin(0.5, 1)
    discount.on('pointerdown', () => {
      this.fixedUiPressed = true
    })
    this.midContainer.add(discount)

    const config = {
      image: 'numbers',
      width: 24,
      height: 30,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET8,
      charsPerRow: 8,
      spacing: { x: 0, y: 0 }
    }
    this.cache.bitmapFont.add('numbers', Phaser.GameObjects.RetroFont.Parse(this, config))

    const dynamic = this.add.bitmapText(this.cameras.main.centerX + 35, this.cameras.main.height - 65, 'numbers', '8')
    dynamic.setOrigin(0, 0)
    this.midContainer.add(dynamic)
  }

  loadLifeStar () {
    const button = this.add.sprite(this.cameras.main.width, this.cameras.main.height, 'choose_level_rightbg').setInteractive()
    button.setData('fixedUi', true)
    button.setOrigin(1, 1)
    button.on('pointerdown', () => {
      this.fixedUiPressed = true
    })

    const starImage = this.add.image(this.cameras.main.width, this.cameras.main.height, 'choose_level_overten')
    starImage.setOrigin(1, 1)

    const text = this.add.text(this.cameras.main.width - 60, this.cameras.main.height - 34, '010')
      .setFontFamily('Arial')
      .setFontSize(24)
    text.setOrigin(1, 0.5)

    this.rightContainer = this.add.container(0, 0, [button, starImage, text])
    this.rightContainer.setScrollFactor(0)
  }

  registerDragScroll () {
    const cam = this.cameras.main
    const minScrollX = 0
    const maxScrollX = Math.max(0, this.scrollWidth - cam.width)
    const canvas = this.game.canvas
    const getSceneX = (event) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = this.scale.width / rect.width
      return (event.clientX - rect.left) * scaleX
    }

    this.handleCanvasPointerDown = (event) => {
      if (this.fixedUiPressed) {
        return
      }
      this.isDraggingMap = true
      this.lastPointerX = getSceneX(event)
      this.dragStartX = this.lastPointerX
      this.dragMovedEnough = false
    }

    this.handleCanvasPointerMove = (event) => {
      if (!this.isDraggingMap || this.fixedUiPressed) {
        return
      }
      const sceneX = getSceneX(event)
      const deltaX = sceneX - this.lastPointerX
      this.lastPointerX = sceneX
      if (Math.abs(sceneX - this.dragStartX) > 8) {
        this.dragMovedEnough = true
      }
      cam.scrollX = Phaser.Math.Clamp(cam.scrollX - deltaX, minScrollX, maxScrollX)
    }

    this.handleCanvasPointerUp = () => {
      this.isDraggingMap = false
      this.fixedUiPressed = false
    }

    canvas.addEventListener('pointerdown', this.handleCanvasPointerDown)
    canvas.addEventListener('pointermove', this.handleCanvasPointerMove)
    window.addEventListener('pointerup', this.handleCanvasPointerUp)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.handleCanvasPointerDown) {
        canvas.removeEventListener('pointerdown', this.handleCanvasPointerDown)
        this.handleCanvasPointerDown = null
      }
      if (this.handleCanvasPointerMove) {
        canvas.removeEventListener('pointermove', this.handleCanvasPointerMove)
        this.handleCanvasPointerMove = null
      }
      if (this.handleCanvasPointerUp) {
        window.removeEventListener('pointerup', this.handleCanvasPointerUp)
        this.handleCanvasPointerUp = null
      }
    })
  }

  update (_time, delta) {
    controls.update(delta)
  }
}
