class gamePlayScene extends Phaser.Scene {
  constructor ()
  {
      super('game_play');
  }
  preload () {
    this.load.atlas('megaset', 'res/GamePlay/Carrot/Carrot1/hlb1.png', 'res/GamePlay/Carrot/Carrot1/hlb1.json');
  }

  create () {
    var atlasTexture = this.textures.get('megaset');
    var frames = atlasTexture.getFrameNames();
console.log(frames)
    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        this.add.image(x, y, 'megaset', frames[i]);
    }
  }

  update () {}
}