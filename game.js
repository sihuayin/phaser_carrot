class mainScene {
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
    this.load.image('front_left_Blue', 'res/MainMenu/front_monster_2.png')
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
    
    let bg = this.add.image(0, 0, 'bg')
  //  console.log(this)
    bg.setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
    let bgMusic = this.sound.add('front_bg_music', { loop: true })
    let selectMusic = this.sound.add('front_select_music')
    bgMusic.play()

    // 开始按钮
    this.startBtn = this.add.sprite(0, 0, 'start_normal').setInteractive();
    this.startBtn.on('pointerdown', (event) => {
      selectMusic.play()
      this.startBtn.setTexture('start_press')
      this.scene.stop();
      this.scene.run('level_select');
    });
    this.startBtn.on('pointerout', (event) => { 
      this.startBtn.setTexture('start_normal')
    });

    this.startBtn.setPosition(this.cameras.main.centerX - 8, this.cameras.main.centerY - 75)

    // sfloor
    this.floorBtn = this.add.sprite(0, 0, 'floor_normal').setInteractive();
    this.floorBtn.on('pointerdown', (event) => { 
      selectMusic.play()
      this.floorBtn.setTexture('floor_press')
      if (this.isUnlock === 'NO') {
        console.log('jiesuo') 
        this.pop.setVisible(true)
      }
    });
    this.floorBtn.on('pointerout', (event) => { 
      this.floorBtn.setTexture('floor_normal')
    });

    this.floorBtn.setPosition(this.cameras.main.centerX - 8, this.cameras.main.centerY + 45)

    // locked front_btn_lock
    this.isUnlock = window.localStorage.getItem('isUnLock') || 'NO';
    this.lockButton = this.add.sprite(this.floorBtn.x + 135, this.floorBtn.y / 2 + 160, 'front_btn_lock')
    if (this.isUnlock !== 'NO') {
      this.lockButton .destroy()
    }
    // 添加怪物
    let master = this.add.sprite(0, 0, 'front_master')
    // 添加设置
    let setting = this.add.sprite(32, 45, 'front_setting')
    var container = this.add.container(this.cameras.main.centerX - 350, this.cameras.main.height - 490, [ master, setting ])
    // 上下移动的动画
    var tween = this.tweens.add({
      targets: container,
      props: {
        y: { value: this.cameras.main.height - 480, duration: 1000, ease: 'Power0', yoyo: true,repeat: -1 }
      }
    });

    // 添加帮助图片
    let helpHandBt = this.add.sprite(0, 0, 'front_help_hand')
    let helpBt = this.add.sprite(5, -150, 'front_help')
    let helpContainer1 = this.add.container(0, 0, [helpHandBt, helpBt])
    // 手臂动画
    this.tweens.add({
      targets: helpContainer1,
      props: {
        angle: { value: 5, duration: 800, ease: 'Power0', yoyo: true,repeat: -1 }
      }
    });
    let helpMonster = this.add.sprite(125, 0, 'front_help_monster')
    this.add.container(this.cameras.main.centerX + 270, this.cameras.main.height - 270, [helpContainer1, helpMonster])
    
    // 背景的怪物 
    let leftYellow = this.add.sprite(this.cameras.main.centerX - 360, this.cameras.main.height - 220, 'front_left_yellow')
    this.tweens.add({
      targets: leftYellow,
      props: {
        y: { value: this.cameras.main.height - 225, duration: 800, ease: 'Power0', yoyo: true,repeat: -1 }
      }
    });

    let leftGreen = this.add.sprite(this.cameras.main.centerX - 300, this.cameras.main.height - 185, 'front_left_green')
    this.tweens.add({
      targets: leftGreen,
      props: {
        x: { value: this.cameras.main.centerX - 303, duration: 700, ease: 'Power0', yoyo: true,repeat: -1 }
      }
    });

    // 背景烟
    this.add.sprite(this.cameras.main.centerX - 410, this.cameras.main.height - 188, 'front_smoke')
    this.add.sprite(this.cameras.main.centerX + 450,  this.cameras.main.height - 190, 'front_smoke_1')

    // 
    let rightYellow = this.add.sprite(this.cameras.main.centerX + 290,  this.cameras.main.height - 185, 'front_right_yellow')
    this.tweens.add({
      targets: rightYellow,
      props: {
        x: { value: this.cameras.main.centerX + 295, duration: 850, ease: 'Power0', yoyo: true,repeat: -1 }
      }
    });

    //
    let leftBlue = this.add.sprite(this.cameras.main.centerX - 300,  this.cameras.main.height - 150, 'front_left_Blue')
    this.tweens.add({
      targets: leftBlue,
      x: this.cameras.main.centerX - 220,
      y: this.cameras.main.height - 170,
      ease: 'Power1',
      duration: 200,
      onComplete: () => {
        this.tweens.add({
          targets: leftBlue,
          props: {
            y: { value: this.cameras.main.height - 175, duration: 850, ease: 'Power0', yoyo: true,repeat: -1 }
          }
        })
      }
    });

    this.add.sprite(this.cameras.main.centerX + 320, this.cameras.main.height - 150, 'front_smoke_2')

    this.carrot = this.add.sprite(this.cameras.main.centerX + 320, this.cameras.main.height - 120, 'front_carrot')
    // 放大效果
    this.carrot.scaleX = 0.7;
    this.carrot.scaleY = 0.7;

    this.tweens.add({
      targets: this.carrot,
      props: {
        scaleX: { value: 1, duration: 800, ease: 'Power0'},
        scaleY: { value: 1, duration: 800, ease: 'Power0'}
      }
    });
    
    this.path = { t: 0, vec: new Phaser.Math.Vector2()};

    var startPoint = new Phaser.Math.Vector2(this.cameras.main.centerX + 320, this.cameras.main.height - 120);
    var controlPoint1 = new Phaser.Math.Vector2(this.cameras.main.centerX + 400, this.cameras.main.height - 100);
    var controlPoint2 = new Phaser.Math.Vector2(this.cameras.main.centerX + 120, this.cameras.main.height);
    var endPoint = new Phaser.Math.Vector2(this.cameras.main.centerX + 100, this.cameras.main.height - 20);

    this.curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

    this.tweens.add({
        targets: this.path,
        t: 1,
        ease: 'Power1',
        duration: 800
    });

    this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'front_bg')

    this.renderLayer()
  }

  /*
   * popup layer
   */
  renderLayer () {
    var bg1 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'front_pop_bg')
    var bg2 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'front_pop_info')

    var bg3 = this.add.container(420, 420)
    // 开始按钮
    var sureButton = this.add.sprite(0, 0, 'front_pop_sure').setInteractive()
    var sureText = this.add.sprite(0,0 ,'front_pop_sure_ok')
    bg3.add(sureButton)
    bg3.add(sureText)
 

    sureButton.on('pointerdown', (event) => {
      sureButton.setTexture('front_pop_sure_pressed')
      // 解锁
      // 发送请求处理
      // 本地保存
      window.localStorage.setItem('isUnLock', 'YES')
      // 清除锁
      this.lockButton && this.lockButton.destroy()
      this.isUnlock = 'YES'
      this.pop.setVisible(false)
    });

    var bg4 = this.add.container(720, 420)
    // 取消按钮
    var cancelButton = this.add.sprite(0, 0, 'front_pop_cancel').setInteractive()
    var cancelText = this.add.sprite(0,0 ,'front_pop_cancel_text')

    bg4.add(cancelButton)
    bg4.add(cancelText)

    cancelButton.on('pointerdown', (event) => {
      cancelButton.setTexture('front_pop_cancel_pressed')
      this.pop.setVisible(false)
    });

    this.pop = this.add.container(0,0, [bg1, bg2, bg3, bg4])
    this.pop.setVisible(false)
  }
  onStartClick() {

  }
  update() {

    var position = this.curve.getPoint(this.path.t, this.path.vec);
    this.carrot.setPosition(position.x, position.y)
  }
}