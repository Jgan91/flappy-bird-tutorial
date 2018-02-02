const mainState = {
  blockSize: 50,

  create: function () {
    game.stage.backgroundColor = '#71c5cf';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // const birdGraphic = game.add.graphics();
    // birdGraphic.lineStyle( 2, 0x000000, 1 );
    // birdGraphic.beginFill( 0xD2BE28, 1 );
    // birdGraphic.drawRect( 0, 0, this.blockSize, this.blockSize );
    // birdGraphic.x = 100;
    // birdGraphic.y = 245;
    //
    // this.bird = game.add.sprite( 100, 245, birdGraphic.generateTexture() );
    // this.bird.anchor.setTo( -0.2 , 0.5 );
    // game.physics.arcade.enable( this.bird );
    // this.bird.body.gravity.y = 1000;
    //
    // birdGraphic.destroy();
    //
    // this.bird = game.add.sprite( 100, 145, this.addBird().generateTexture() );

    this.bird = this.addBird();

    this.pipes = game.add.group();
    this.timer = game.time.events.loop( 1500, this.addPipe, this );

    this.score = 0;
    this.labelscore = game.add.text( 20, 20, "0", { font: '30px Arial', fill: '#ffffff' } );

    const spaceKey = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
    spaceKey.onDown.add( this.jump, this );
  },

  update: function () {
    if ( this.bird.y < 0 || this.bird.y > 490 ) {
      this.restartGame();
    };

    game.physics.arcade.overlap( this.bird, this.pipes, this.hitPipe, null, this );

    if ( this.bird.angle < 20 ) {
      this.bird.angle++;
    }
  },

  // render: function () {
  //   game.debug.spriteInfo( this.bird, 32, 32 );
  //   game.debug.body( this.bird );
  // },

  addBird: function () {
    const birdGraphic = game.add.graphics();
    birdGraphic.lineStyle( 2, 0x000000, 1 );
    birdGraphic.beginFill( 0xD2BE28, 1 );
    birdGraphic.drawRect( 0, 0, this.blockSize, this.blockSize );
    birdGraphic.x = 100;
    birdGraphic.y = 145;

    this.bird = game.add.sprite( 100, 245, birdGraphic.generateTexture() );
    this.bird.anchor.setTo( -0.2 , 0.5 );
    game.physics.arcade.enable( this.bird );
    this.bird.body.gravity.y = 1000;

    birdGraphic.destroy();

    return this.bird;
  },

  jump: function () {
    if ( ! this.bird.alive ) return;

    this.bird.body.velocity.y = -350;

    const animation = game.add.tween( this.bird );
    animation.to( { angle: -20 }, 100 );
    animation.start();
  },

  restartGame: function () {
    game.state.start( 'main' );
  },

  addPipeSegment: function ( x, y ) {
    const pipeSegment = game.add.graphics();
    pipeSegment.lineStyle( 2, 0x000000, 1 );
    pipeSegment.beginFill( 0x00D726, 1 );
    pipeSegment.drawRect( 0, 0, this.blockSize, this.blockSize);
    pipeSegment.x = x;
    pipeSegment.y = y;

    this.pipes.add( pipeSegment );

    game.physics.arcade.enable( pipeSegment );

    pipeSegment.body.velocity.x = -200;

    pipeSegment.checkWorldBounds = true;
    pipeSegment.outOfBoundsKill = true;
  },

  addPipe: function () {
    const pipeLength = 8;
    const gapPosition = game.rnd.between( 1, 5 );
    const gapSize = 10;

    for ( let i = 0; i < pipeLength; i++ ) {
      if ( i !== gapPosition && i !== gapPosition + 1 ) {
        this.addPipeSegment( 400, i * ( this.blockSize + gapSize ) + gapSize );
      };
    };

    this.labelscore.text = ++this.score;
  },

  hitPipe: function () {
    if ( this.bird.alive ) {
      this.bird.alive = false;
    }
    else {
      return;
    }

    game.time.events.remove( this.timer );

    this.pipes.forEach( function ( pipe ) {
      pipe.body.velocity.x = 0;
    }, this );

  }
};

const game = new Phaser.Game( 400, 490 );

game.state.add( 'main', mainState );

game.state.start( 'main' );
