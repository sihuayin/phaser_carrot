new Phaser.Game({
  width: 1136, // Width of the game in pixels
  height: 640, // Height of the game in pixels
  backgroundColor: '#3498db', // The background color (blue)
  scene: [unlockScene, mainScene], // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
});