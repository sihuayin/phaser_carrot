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
  }
  create() {
    let bg = this.add.image(0, 0, 'bg')
  //  console.log(this)
    bg.setPosition(this.cameras.main.centerX, this.cameras.main.centerY)

    // 开始按钮
    this.startBtn = this.add.sprite(0, 0, 'start_normal').setInteractive();
    this.startBtn.on('pointerdown', (event) => { 
      this.startBtn.setTexture('start_press')
    });

    this.startBtn.setPosition(this.cameras.main.centerX - 8, this.cameras.main.centerY + 75)

    // sfloor
    this.floorBtn = this.add.sprite(0, 0, 'floor_normal').setInteractive();
    this.floorBtn.on('pointerdown', (event) => { 
      this.floorBtn.setTexture('floor_press')
    });

    this.floorBtn.setPosition(this.cameras.main.centerX - 8, this.cameras.main.centerY - 45)

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

    this.carrpt = this.add.sprite(this.cameras.main.centerX + 320, this.cameras.main.height - 120, 'front_carrot')
    // 放大效果
    this.carrpt.scaleX = 0.7;
    this.carrpt.scaleY = 0.7;

    this.tweens.add({
      targets: this.carrpt,
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
  }

  onStartClick() {

  }
  update() {

    var position = this.curve.getPoint(this.path.t, this.path.vec);
    this.carrpt.setPosition(position.x, position.y)
  }
}

new Phaser.Game({
  width: 1136, // Width of the game in pixels
  height: 640, // Height of the game in pixels
  backgroundColor: '#3498db', // The background color (blue)
  scene: mainScene, // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
});