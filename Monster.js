class Monster extends  Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y, texture, frame)
  {
      super(scene, x, y);
      this.scene = scene

      frame && this.setTexture(texture, frame) || this.setTexture(texture)
      this.setPosition(x, y);
      this.setOrigin(0, 0);
      this.roadIndex = 0
  }

  setData (data) {
    this.configData = data;
    this.speed = data.speed;
    this.road = data.road;
    this.index = data.index;
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
    }else{
      this.setFlipX(true);
    }
    var distance = Phaser.Math.Distance.Between(this.road[this.roadIndex].x, this.road[this.roadIndex].y, this.road[this.roadIndex + 1].x, this.road[this.roadIndex + 1].y);

    var time = distance / this.speed;
    if (!this.scene) {
      return ;
    }
    var tween = this.scene.tweens.add({
      targets: this,
      props: {
        x: {value: this.road[this.roadIndex + 1].x, ease: 'Power1', duration: time,},
        y: {value: this.road[this.roadIndex + 1].y, ease: 'Power1', duration: time,}
      },
      onComplete: () => {
        if (this.roadIndex < this.road.length - 1) {
          this.runNextRoad();
        } else {
          // 触发到达了终点
          this.destroy()
          if (this.eat) {
            this.eat(1)
          }
        }
      }
    });

    this.roadIndex++;
  }

  playRunAnimation () {
    const arr = []
    for(let i = 1; i < 4; i ++) {
      arr.push({
        key: `Monster_L${i}`
      })
    }
    // var configArr = this.scene.anims.generateFrameNames('theme', { prefix: 'Theme1/Monster/L', start: 11, end: 13, zeroPad: 0, suffix: '.png',frames: true})
    
    this.scene.anims.create({ key: 'move', frames: arr, repeat: -1, duration: 150 });
    this.play('move')
  }

  des () {
    this.distroy()
  }
}