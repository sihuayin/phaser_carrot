import Phaser from 'phaser'

export class mainScene extends Phaser.Scene {
  constructor() {
    super('main_menu')
    this.actionDuration = 1000
    this.isUnlock = 'NO'
    this.bgMusic = null
    this.selectMusic = null
    this.lockButton = null
    this.pop = null
    this.path = null
    this.curve = null
    this.carrot = null
  }

  preload() {
    this.load.image('bg', 'res/MainMenu/zh/front_bg.png')
    this.load.image('start_normal', 'res/MainMenu/zh/front_btn_start_normal.png')
    this.load.image('start_press', 'res/MainMenu/zh/front_btn_start_pressed.png')
    this.load.image('floor_normal', 'res/MainMenu/zh/front_btn_floor_normal.png')
    this.load.image('floor_press', 'res/MainMenu/zh/front_btn_floor_pressed.png')
    this.load.image('front_master', 'res/MainMenu/front_monster_4.png')
    this.load.image('front_setting', 'res/MainMenu/front_btn_setting_normal.png')
    this.load.image('front_help_hand', 'res/MainMenu/front_monster_6_hand.png')
    this.load.image('front_help', 'res/MainMenu/front_btn_help_normal.png')
    this.load.image('front_help_monster', 'res/MainMenu/front_monster_6.png')
    this.load.image('front_left_yellow', 'res/MainMenu/front_monster_3.png')
    this.load.image('front_left_green', 'res/MainMenu/front_monster_1.png')
    this.load.image('front_smoke', 'res/MainMenu/front_smoke_1.png')
    this.load.image('front_smoke_1', 'res/MainMenu/front_smoke_3.png')
    this.load.image('front_smoke_2', 'res/MainMenu/front_smoke_2.png')
    this.load.image('front_right_yellow', 'res/MainMenu/front_monster_5.png')
    this.load.image('front_left_blue', 'res/MainMenu/front_monster_2.png')
    this.load.image('front_carrot', 'res/MainMenu/front_carrot.png')
    this.load.image('front_bg', 'res/MainMenu/front_front.png')
    this.load.image('front_btn_lock', 'res/MainMenu/front_btn_floor_locked.png')
    this.load.image('front_pop_sure', 'res/UI/btn_blue_m.png')
    this.load.image('front_pop_sure_pressed', 'res/UI/btn_blue_m_pressed.png')
    this.load.image('front_pop_bg', 'res/Common/bg/woodbg_notice.png')
    this.load.image('front_pop_info', 'res/MainMenu/unlock_floor.png')
    this.load.image('front_pop_sure_ok', 'res/UI/zh/btn_blue_m_ok.png')
    this.load.image('front_pop_cancel', 'res/UI/btn_green_m.png')
    this.load.image('front_pop_cancel_pressed', 'res/UI/btn_green_m_pressed.png')
    this.load.image('front_pop_cancel_text', 'res/UI/zh/btn_green_m_cancel.png')

    this.load.audio('front_bg_music', 'res/Sound/MainMenu/BGMusic.mp3')
    this.load.audio('front_select_music', 'res/Sound/MainMenu/Select.mp3')
  }

  create() {
    this.loadConfig()
    this.loadBackgroundLayer()
    this.loadAudio()
    this.loadMenu()
    this.loadSet()
    this.loadHelp()
    this.loadBackMonster()
    this.loadBackSmoke()
    this.loadForeMonster()
    this.loadForeSmoke()
    this.loadCarrot()
    this.loadForeground()
    this.loadUnlockLayer()
  }

  loadConfig() {
    this.isUnlock = window.localStorage.getItem('isUnLock') || 'NO'
  }

  loadAudio() {
    this.bgMusic = this.sound.add('front_bg_music', { loop: true })
    this.selectMusic = this.sound.add('front_select_music')
    if (!this.bgMusic.isPlaying) {
      this.bgMusic.play()
    }
  }

  loadBackgroundLayer() {
    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg')
    bg.setDepth(0)
  }

  loadMenu() {
    this.startBtn = this.add.sprite(this.cameras.main.centerX - 8, this.cameras.main.centerY - 75, 'start_normal').setInteractive()
    this.startBtn.on('pointerdown', () => {
      this.selectMusic.play()
      this.startBtn.setTexture('start_press')
      this.scene.start('level_select')
    })
    this.startBtn.on('pointerout', () => {
      this.startBtn.setTexture('start_normal')
    })
    this.startBtn.on('pointerup', () => {
      this.startBtn.setTexture('start_normal')
    })

    this.floorBtn = this.add.sprite(this.cameras.main.centerX - 8, this.cameras.main.centerY + 45, 'floor_normal').setInteractive()
    this.floorBtn.on('pointerdown', () => {
      this.selectMusic.play()
      this.floorBtn.setTexture('floor_press')
      if (this.isUnlock === 'NO') {
        this.pop.setVisible(true)
      } else {
        this.showTodoTip()
      }
    })
    this.floorBtn.on('pointerout', () => {
      this.floorBtn.setTexture('floor_normal')
    })
    this.floorBtn.on('pointerup', () => {
      this.floorBtn.setTexture('floor_normal')
    })

    if (this.isUnlock === 'NO') {
      this.lockButton = this.add.sprite(this.floorBtn.x + 135, this.floorBtn.y / 2 + 160, 'front_btn_lock')
    }
  }

  loadSet() {
    const master = this.add.sprite(0, 0, 'front_master')
    const setting = this.add.sprite(157, 80, 'front_setting')
    const container = this.add.container(this.cameras.main.centerX - 350, 490, [master, setting])

    this.tweens.add({
      targets: container,
      y: { value: 480, duration: this.actionDuration, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })
  }

  loadHelp() {
    const helpHand = this.add.sprite(0, 0, 'front_help_hand')
    const help = this.add.sprite(155, 365, 'front_help')
    const helpContainer = this.add.container(this.cameras.main.centerX + 270, 270, [helpHand, help])

    this.tweens.add({
      targets: helpContainer,
      angle: { value: 5, duration: this.actionDuration * 0.8, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })

    const helpBody = this.add.sprite(this.cameras.main.centerX + 400, 280, 'front_help_monster')
    this.tweens.add({
      targets: helpBody,
      y: { value: 285, duration: this.actionDuration * 2, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })
  }

  loadBackMonster() {
    const leftYellow = this.add.sprite(this.cameras.main.centerX - 360, 220, 'front_left_yellow')
    this.tweens.add({
      targets: leftYellow,
      y: { value: 225, duration: this.actionDuration * 0.8, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })

    const leftGreen = this.add.sprite(this.cameras.main.centerX - 300, 185, 'front_left_green')
    this.tweens.add({
      targets: leftGreen,
      x: { value: this.cameras.main.centerX - 303, duration: this.actionDuration * 0.7, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })
  }

  loadBackSmoke() {
    this.add.sprite(this.cameras.main.centerX - 410, 188, 'front_smoke')
    this.add.sprite(this.cameras.main.centerX + 405, 190, 'front_smoke_1')
  }

  loadForeMonster() {
    const rightYellow = this.add.sprite(this.cameras.main.centerX + 290, 185, 'front_right_yellow')
    this.tweens.add({
      targets: rightYellow,
      x: { value: this.cameras.main.centerX + 295, duration: this.actionDuration * 0.85, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })

    const leftBlue = this.add.sprite(this.cameras.main.centerX - 300, 150, 'front_left_blue')
    this.tweens.add({
      targets: leftBlue,
      x: this.cameras.main.centerX - 220,
      y: 170,
      duration: this.actionDuration * 0.2,
      ease: 'Power1',
      onComplete: () => {
        this.tweens.add({
          targets: leftBlue,
          y: { value: 165, duration: this.actionDuration * 0.55, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
        })
      }
    })
  }

  loadForeSmoke() {
    this.add.sprite(this.cameras.main.centerX + 320, 150, 'front_smoke_2')
  }

  loadCarrot() {
    this.carrot = this.add.sprite(this.cameras.main.centerX + 320, 120, 'front_carrot')
    this.carrot.setScale(0.7)

    this.path = { t: 0, vec: new Phaser.Math.Vector2() }
    const startPoint = new Phaser.Math.Vector2(this.cameras.main.centerX + 320, 120)
    const controlPoint1 = new Phaser.Math.Vector2(this.cameras.main.centerX + 400, 100)
    const controlPoint2 = new Phaser.Math.Vector2(this.cameras.main.centerX + 120, 0)
    const endPoint = new Phaser.Math.Vector2(this.cameras.main.centerX + 100, 20)
    this.curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint)

    this.tweens.add({
      targets: this.path,
      t: 1,
      ease: 'Power1',
      duration: this.actionDuration * 0.8
    })
    this.tweens.add({
      targets: this.carrot,
      scaleX: 1,
      scaleY: 1,
      duration: this.actionDuration * 0.8,
      ease: 'Power1'
    })
  }

  loadForeground() {
    this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'front_bg')
  }

  loadUnlockLayer() {
    const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.86)
    overlay.setOrigin(0, 0)

    const bg = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'front_pop_bg')
    const info = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'front_pop_info')

    const confirmButton = this.add.sprite(420, 420, 'front_pop_sure').setInteractive()
    const confirmText = this.add.sprite(420, 420, 'front_pop_sure_ok')
    confirmButton.on('pointerdown', () => {
      confirmButton.setTexture('front_pop_sure_pressed')
      window.localStorage.setItem('isUnLock', 'YES')
      this.isUnlock = 'YES'
      this.lockButton && this.lockButton.destroy()
      this.pop.setVisible(false)
      confirmButton.setTexture('front_pop_sure')
    })

    const cancelButton = this.add.sprite(720, 420, 'front_pop_cancel').setInteractive()
    const cancelText = this.add.sprite(720, 420, 'front_pop_cancel_text')
    cancelButton.on('pointerdown', () => {
      cancelButton.setTexture('front_pop_cancel_pressed')
      this.pop.setVisible(false)
      cancelButton.setTexture('front_pop_cancel')
    })

    this.pop = this.add.container(0, 0, [overlay, bg, info, confirmButton, confirmText, cancelButton, cancelText])
    this.pop.setDepth(100)
    this.pop.setVisible(false)
  }

  showTodoTip() {
    const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, '天天向上模式暂未接入', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#fff4b1',
      stroke: '#4a341d',
      strokeThickness: 4
    })
    text.setOrigin(0.5, 0.5)
    text.setDepth(120)
    this.tweens.add({
      targets: text,
      alpha: { value: 0, duration: 1400, ease: 'Quad.easeOut' },
      y: this.cameras.main.centerY + 90,
      duration: 1400,
      onComplete: () => {
        text.destroy()
      }
    })
  }

  update() {
    if (!this.curve || !this.path || !this.carrot) {
      return
    }
    const position = this.curve.getPoint(this.path.t, this.path.vec)
    this.carrot.setPosition(position.x, position.y)
  }
}
