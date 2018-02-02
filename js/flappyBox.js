const mainState = {
  // 4.3 Pull blockSize into its own variable
  blockSize: 50,
  // 8.1 Add preload
  preload: function () {
    this.load.spritesheet( 'bird', 'assets/bird.png', 34, 24 );
  },
  // 1.2 Define create function with background color
  create: function () {
    game.stage.backgroundColor = '#71c5cf';
    // 2.3 Start physics system
    game.physics.startSystem( Phaser.Physics.ARCADE );
    // 2.1 Create box graphic
    const boxGraphic = game.add.graphics();
    boxGraphic.lineStyle( 2, 0x000000, 1 );
    boxGraphic.beginFill( 0xD2Be28, 1 );
    boxGraphic.drawRect( 0, 0, this.blockSize, this.blockSize );
    boxGraphic.position.setTo( 100, 245 );
    // 2.2 Attach box graphic to sprite - sprites can have physics enabled
    // this.box = game.add.sprite( 100, 245, boxGraphic.generateTexture() );
    this.box = game.add.sprite( 100, 245, 'bird' );
    this.box.scale.setTo( 1.5 );
    // 8.2 add sprite animations
    this.box.animations.add( 'flap', [0, 1, 2], 10, true );
    // 6.3 Update anchor
    this.box.anchor.setTo( -0.2, 0.5 );
    // 2.6 Destroy box graphic
    boxGraphic.destroy();
    // 2.4 Enable physics for box
    game.physics.arcade.enable( this.box );
    // 2.5 Enable gravity for box - demo gravity
    this.box.body.gravity.y = 1000;
    // 3.1 Create spaceKey variable and event listener
    const spaceKey = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
    spaceKey.onDown.add( this.jump, this );
    // 4.1 Create Pipe Segment
    // addPipeSegment( 300, 10 );
    // 4.3 Create Pipe
    // addPipe();
    // 4.6 add pipes group
    this.pipes = game.add.group();
    // 4.5 Add timer
    this.timer = game.time.events.loop( 1500, this.addPipe, this );
    // 7.1 Add score and label
    this.score = 0;
    this.scoreLabel = game.add.text( 20, 20, "0", { font: '30px Arial', fill: '#ffffff' } );

  },

  update: function () {
    // 5.2 Add overlap check
    // 6.4 Change
    game.physics.arcade.overlap( this.box, this.pipes, this.checkPipeCollision, null, this );
    // 5.7 Add bound collision restart
    if ( this.box.y < 0 || this.box.y > 490 ) {
      this.restartGame();
    }
    // 6.1 Add downward angle
    if ( this.box.angle < 20 ) {
      this.box.angle++;
    }
    // 8.3 Play animation
    this.box.animations.play( 'flap' );
  },

  // 3.2 Create jump function - demo jump
  jump: function () {
    // 6.5 Disallow jump if dead
    if ( !this.box.alive ) { return; }

    this.box.body.velocity.y = -350;
    // 6.2 add tween
    const animation = game.add.tween( this.box );
    animation.to( { angle: -20 }, 100 );
    animation.start();
  },

  addPipeSegment: function ( x, y ) {
    const pipeSegment = game.add.graphics();
    pipeSegment.lineStyle( 2, 0x000000, 1 );
    pipeSegment.beginFill( 0x00D726, 1 );
    pipeSegment.drawRect( 0, 0, this.blockSize, this.blockSize );
    pipeSegment.position.setTo( x, y );
    // 4.2 Add pipe physics
    game.physics.arcade.enable( pipeSegment );
    pipeSegment.body.velocity.x = -200;

    // 5.5 Add pipeSegment to group
    this.pipes.add( pipeSegment );
  },

  addPipe: function () {
    const pipeLength = 8;
    const gapSize = 10;
    const gapPosition = game.rnd.between( 1, 5 );

    for ( let i = 0; i < pipeLength; i++ ) {
      if ( i !== gapPosition && i !== gapPosition + 1 ) {
        this.addPipeSegment( 400, gapSize + ( i * ( this.blockSize + gapSize ) ) );
      };
    };
    // 7.2 Update score
    this.scoreLabel.text = ++this.score;
  },
  // 6.5 Add checkPipeCollision
  checkPipeCollision: function () {
    if ( this.box.alive ) {
      this.box.alive = false;
    }
    else {
      return;
    }

    game.time.events.remove( this.timer );

    this.pipes.forEach( function ( pipe ) {
      pipe.body.velocity.x = 0;
    } );
  },

  restartGame: function () {
    game.state.start( 'main' );
  }
}
// 1.1 Store new Phaser.Game object in variable
const game = new Phaser.Game( 400, 490 );

game.state.add( 'main', mainState );
game.state.start( 'main' );

//
// const gameOverState = {;
//   create: function () {;
//     const label = game.add.text( 20, 245, "Game Over" );
//     const spaceKey = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
//     spaceKey.onDown.add( this.restartGame, this );
//   },
//
//   restartGame: function () {;
//     game.state.start( 'main' );
//   }
// }
//
// game.state.add( 'gameOver', gameOverState );
