
function Game () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    const WIDTH = 1280;
    const HEIGHT = 720;
    const TILE_SIZE = 16;
    const PLAYER_SPEED = 300;

    const P1 = {
        LEFT: 65,
        RIGHT: 68,
        UP: 87,
        DOWN: 83,
        ACTION_1: 32,
        ACTION_2: 16
    };
    const P2 = {
        LEFT: 74,
        RIGHT: 76,
        UP: 73,
        DOWN: 75,
        ACTION_1: 191,
        ACTION_2: 186
    };

    proto.initialize = function () {
        this.preload = this.preload.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    };

    proto.start = function () {
        this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'phaser-example', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    };

    proto.preload = function () {
        this.game.load.image('gray', 'assets/gray.png');
        this.game.load.image('red', 'assets/red.png');
    };

    proto.create = function () {
        this.game.stage.backgroundColor = '#2d2d2d';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.createInput();

        this.walls = this.game.add.group();
        this.walls.enableBody = true;
        this.createWalls();

        this.players = this.game.add.group();
        this.players.enableBody = true;
        this.createPlayers();
        console.log(this.game.input.keyboard);

    };

    proto.createInput = function () {
        //65: 'p1-left',
        //68: 'p1-right',
        //87: 'p1-up',
        //83: 'p1-down',
        //32: 'p1-action-1',
        //16: 'p1-action-2',

        //74: 'p2-left',
        //76: 'p2-right',
        //73: 'p2-up',
        //75: 'p2-down',
        //191: 'p2-action-1',
        //186: 'p2-action-2'
        this.game.input.keyboard.addKeyCapture([
            P1.LEFT, P1.RIGHT, P1.UP, P1.DOWN,
            P1.ACTION_1, P1.ACTION_2,
            P2.LEFT, P2.RIGHT, P2.UP, P2.DOWN,
            P2.ACTION_1, P2.ACTION_2]
        );
    };

    proto.createWalls = function () {
        var wall;

        wall = this.walls.create(0, 0, 'gray');
        wall.scale.setTo(1, HEIGHT / TILE_SIZE);
        wall.body.immovable = true;

        wall = this.walls.create(WIDTH - TILE_SIZE, 0, 'gray');
        wall.scale.setTo(1, HEIGHT / TILE_SIZE);
        wall.body.immovable = true;

        wall = this.walls.create(TILE_SIZE, 0, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE - 2, 1);
        wall.body.immovable = true;

        wall = this.walls.create(TILE_SIZE, HEIGHT - TILE_SIZE, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE - 2, 1);
        wall.body.immovable = true;

        wall = this.walls.create(WIDTH / 4, HEIGHT / 2 - TILE_SIZE / 2, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE / 2 - 2, 1);
        wall.body.immovable = true;
    };

    proto.createPlayers = function () {
        var player;

        this.player = this.players.create(WIDTH / 2, HEIGHT / 4, 'red');
    };

    proto.update = function () {
        this.updatePlayer(this.player, P1);

        this.game.physics.arcade.collide(this.players, this.walls);
    };

    proto.collisionHandler = function (player, wall) {
        console.log('here');
    };

    proto.updatePlayer = function (player, keys) {
        player.body.velocity.y = 0;
        if (this.game.input.keyboard.isDown(keys.UP)) {
            player.body.velocity.y = -PLAYER_SPEED;
        } else if (this.game.input.keyboard.isDown(keys.DOWN)) {
            player.body.velocity.y = PLAYER_SPEED;
        }
        player.body.velocity.x = 0;
        if (this.game.input.keyboard.isDown(keys.LEFT)) {
            player.body.velocity.x = -PLAYER_SPEED;
        } else if (this.game.input.keyboard.isDown(keys.RIGHT)) {
            player.body.velocity.x = PLAYER_SPEED;
        }
    };
}(Game.prototype));
