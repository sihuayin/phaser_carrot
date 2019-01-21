var controls

class levelSelect {
  preload () {
    // res/ChooseLevel/Map/stage_map_" + i + ".png
    for (var i = 0; i < 14; i++) {
      this.load.image(`stage_map_${i}`, "res/ChooseLevel/Map/stage_map_" + i + ".png");
    }
  }
  create () {
    // todo 判断 BGMusic 音乐是否播放，如果没有 那么开始播放
    let nextPosX = 0
    var cam = this.cameras.main;

    this.bgContainer = this.add.container(0, 0)
    for (var i = 0; i < 14; i++) {
      let imageView = this.add.sprite(0, 0, `stage_map_${i}`).setInteractive({ draggable: true })
      imageView.setOrigin(0, 0.5)
      imageView.setPosition(nextPosX, this.cameras.main.height / 2);
      this.bgContainer.add(imageView);
      
      
      nextPosX += imageView.width;
    }
    // this.bgContainer.setSize(nextPosX, this.cameras.main.height)
    this.cameras.main.setBounds(0, 0, nextPosX, this.cameras.main.height);
    var cursors = this.input.keyboard.createCursorKeys();


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
  }

  update (time, delta) {
    controls.update(delta);
  }
}