var controls

class levelSelect {
  preload () {
    this.load.tilemapTiledJSON('map', 'res/ChooseLevel/Map/TiledMap.json');
    // res/ChooseLevel/Map/stage_map_" + i + ".png
    for (var i = 0; i < 14; i++) {
      this.load.image(`stage_map_${i}`, "res/ChooseLevel/Map/stage_map_" + i + ".png");
    }

    for (var i = 1; i < 135; i++) {
      this.load.image(`route_${i}`, "res/ChooseLevel/Route/route_" + i + ".png");
    }

    this.load.image('choose_level_adv','res/ChooseLevel/stagepoint_adv.png')
    this.load.image('choose_level_boss', 'res/ChooseLevel/stagepoint_gate.png')
    this.load.image('choose_level_time', 'res/ChooseLevel/stagepoint_time.png')
    this.load.image('choose_level_chance', 'res/ChooseLevel/stagepoint_chance.png')
  }
  create () {
    // todo 判断 BGMusic 音乐是否播放，如果没有 那么开始播放
    let nextPosX = 0
    var cam = this.cameras.main;
    var map = this.add.tilemap('map')
    var tiles = []

    this.bgContainer = this.add.container(0, 0)
    for (var i = 0; i < 14; i++) {
      var tile = map.addTilesetImage(`stage_map_${i}`);
      tiles.push(tile)
      let imageView = this.add.sprite(0, 0, `stage_map_${i}`).setInteractive({ draggable: true })
      imageView.setOrigin(0, 0.5)
      imageView.setPosition(nextPosX, this.cameras.main.height / 2);
      this.bgContainer.add(imageView);
      
      
      nextPosX += imageView.width;
    }
    // this.bgContainer.setSize(nextPosX, this.cameras.main.height)
    this.cameras.main.setBounds(0, 0, nextPosX, this.cameras.main.height);
    var cursors = this.input.keyboard.createCursorKeys();
    var layer = map.getObjectLayer('point');

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    this.loadLevel(2)
    // this.input.on('dragstart', function (arg) {
    //   console.log(arg)
    // })

    // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    //   console.log(cam, dragX, dragY)
      
    //   cam.setScroll(cam.scrollX - dragX);
    //   // cam.scrollX = -dragX
    //   console.log(cam.x, cam.y)
    // })


    // this.input.on('dragend', function (arg) {
    //   console.log(arg)
    // })

    let objs = layer.objects;
    for (var i = 0; i < objs.length; i++) {
        var button = this.add.sprite(0,0, 'choose_level_adv').setInteractive();
        // this.scorllView.addChild(button, this.zOrderMap.levelButton, i);
        // this.routeButtonArray.push(button);

        // 编辑器中配置的属性
        if (objs[i].isBoos == "YES") {
          button.setTexture('choose_level_boss')
        }else if (objs[i].isTime == "YES") {
          button.setTexture('choose_level_time')
        }else if (objs[i].isChange == "YES"){
          button.setTexture('choose_level_chance')
        }

        button.setPosition(objs[i].x, objs[i].y);
        ((i) => {
          button.on('pointerdown', (a, b ,c ,d) => { 
            console.log(i, a, b, c, d)
            // 停止音乐
            // 关卡设置
            // 进入不同等级的游戏
          }, this)
        })(i)

        // button.setTag(i);
        // button.addTouchEventListener(this.onLevelButtonEvent, this);
    }

   
  }

  loadLevel(level) {
    this.loadRoute(level)
    this.loadLevelEffects(level)
  }

  loadRoute (level) {
    for (let i = 0; i < level - 1; i ++) {
      var route = this.add.sprite(0, 0, 'route_' + (i + 1))
      if (i %10 == 9) {
        route.setOrigin(0, 0.5)
      }

      route.x = route.width / 2 + Math.floor(i / 10) * route.width;
      route.y = this.cameras.main.height / 2
    }
  }

  loadLevelEffects (level) {
    var button = this.bgContainer.getAt(level-1)
    console.log(button)
  }

  update (time, delta) {
    controls.update(delta);
  }
}