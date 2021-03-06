new Phaser.Game({
  width: 1136, // Width of the game in pixels
  height: 640, // Height of the game in pixels
  backgroundColor: '#3498db', // The background color (blue)
  // scene: [unlockScene,levelSelect, mainScene, gamePlayScene], // The name of the scene we created
  scene: [gamePlayScene],
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
});