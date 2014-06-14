
function Game () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    const WIDTH = 1280;
    const HEIGHT = 720;
    const TILE_SIZE = 16;

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
    };

    proto.create = function () {
        this.game.stage.backgroundColor = '#2d2d2d';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.walls = this.game.add.group();

        this.createWalls();
    };

    proto.createWalls = function () {
        var wall;

        wall = this.walls.create(0, 0, 'gray');
        wall.scale.setTo(1, HEIGHT / TILE_SIZE);

        wall = this.walls.create(WIDTH - TILE_SIZE, 0, 'gray');
        wall.scale.setTo(1, HEIGHT / TILE_SIZE);

        wall = this.walls.create(TILE_SIZE, 0, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE - 2, 1);

        wall = this.walls.create(TILE_SIZE, HEIGHT - TILE_SIZE, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE - 2, 1);

        wall = this.walls.create(WIDTH / 4, HEIGHT / 2 - TILE_SIZE / 2, 'gray');
        wall.scale.setTo(WIDTH / TILE_SIZE / 2 - 2, 1);
    };

    proto.update = function () {

    };
}(Game.prototype));
