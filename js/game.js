
function Game () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    const WIDTH = 1280;
    const HEIGHT = 720;
    const TILE_SIZE = 16;
    const PLAYER_SPEED = 300;
    const SQRT_2 = Math.sqrt(2);
    const SQRT_2_DIV_2 = SQRT_2 / 2;

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

    proto.setJoystickBinding = function (client) {
        this.client = client;
        client.setBinding({
            4: { keyCode: P1.UP },
            2: { keyCode: P1.DOWN },
            1: { keyCode: P1.LEFT },
            3: { keyCode: P1.RIGHT },
            5: { keyCode: P1.ACTION_1 },
            6: { keyCode: P1.ACTION_2 },

            13: { keyCode: P2.UP },
            15: { keyCode: P2.DOWN },
            14: { keyCode: P2.LEFT },
            12: { keyCode: P2.RIGHT },
            17: { keyCode: P2.ACTION_1 },
            16: { keyCode: P2.ACTION_2 }
       }, true);
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
        this.game.load.image('blue', 'assets/blue.png');
        this.game.load.image('black', 'assets/black.png');
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('room', 'assets/room.png', TILE_SIZE, TILE_SIZE, -1, 4, 2);
        this.game.load.tilemap('main', 'maps/main.json', null, Phaser.Tilemap.TILED_JSON);
    };

    proto.create = function () {
        this.game.stage.backgroundColor = '#2d2d2d';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.createInput();

        this.map = this.game.add.tilemap('main');
        this.map.addTilesetImage('tiles', 'tiles');
        this.map.setCollisionBetween(2, 5, true, 0);

        this.walls = this.map.createLayer(0);
        this.walls.enableBody = true;

        this.players = this.game.add.group();
        this.players.enableBody = true;
        this.createPlayers();
        this.players.z = 99;

        this.rooms = this.game.add.group();
        this.rooms.enableBody = true;
        this.buildRooms(this.map.objects.rooms);
        this.rooms.z = 100;
    };

    proto.buildRooms = function (roomObjects) {
        var index, roomObject, room;

        for (index = 0; index < roomObjects.length; index++) {
            roomObject = roomObjects[index];
            room = this.rooms.create(roomObject.x, roomObject.y, 'room', 2);
            room.scale.setTo(roomObject.width / TILE_SIZE, roomObject.height / TILE_SIZE);

            room.set = roomObject.properties.roomSet;
            room.isOff = roomObject.properties.isOff;

            this.updateRoomFrame(room);
        }
    };

    proto.createInput = function () {
        this.game.input.keyboard.addKeyCapture([
            P1.LEFT, P1.RIGHT, P1.UP, P1.DOWN,
            P1.ACTION_1, P1.ACTION_2,
            P2.LEFT, P2.RIGHT, P2.UP, P2.DOWN,
            P2.ACTION_1, P2.ACTION_2]
        );

        client.setEventListener(window);
        client.connect();
    };

    proto.createPlayers = function () {
        var player;

        this.player1 = this.players.create(WIDTH / 2, HEIGHT / 4, 'red');
        this.player2 = this.players.create(WIDTH / 2, HEIGHT * 3 / 4, 'blue');
    };

    proto.update = function () {
        this.updatePlayer(this.player1, P1);
        this.updatePlayer(this.player2, P2);

        this.game.physics.arcade.collide(this.players, this.walls);

        this.resolvePlayerRooms();
    };

    proto.resolvePlayerRooms = function () {
        this.player1.currentRooms = {};
        this.player2.currentRooms = {};

        this.game.physics.arcade.overlap(this.players, this.rooms, updatePlayerRooms, undefined, this);

        function updatePlayerRooms (player, room) {
            player.currentRooms[room.set] = true;
            player.currentRoom = room.set;
        }
    };

    proto.updatePlayer = function (player, keys) {
        var x, y;

        y = 0;
        if (this.game.input.keyboard.isDown(keys.UP)) {
            y = -PLAYER_SPEED;
        } else if (this.game.input.keyboard.isDown(keys.DOWN)) {
            y = PLAYER_SPEED;
        }
        x = 0;
        if (this.game.input.keyboard.isDown(keys.LEFT)) {
            x = -PLAYER_SPEED;
        } else if (this.game.input.keyboard.isDown(keys.RIGHT)) {
            x = PLAYER_SPEED;
        }

        if (!player.isAction1Down &&
            this.game.input.keyboard.isDown(keys.ACTION_1)) {
            player.isAction1Down = true;

            this.switchRoomColor(player.currentRoom);
        } else if (!this.game.input.keyboard.isDown(keys.ACTION_1)) {
            player.isAction1Down = false;
        };

        if (x && y) {
            x = x * SQRT_2_DIV_2;
            y = y * SQRT_2_DIV_2;
        }

        player.body.velocity.y = y;
        player.body.velocity.x = x;
    };

    proto.switchRoomColor = function (roomSet) {
        var rooms, index, room;

        rooms = this.getRoomsBySet(roomSet);
        for (index = 0; index < rooms.length; index++) {
            room = rooms[index];
            room.isOff = !room.isOff;

            this.updateRoomFrame(room);
        }
    };

    proto.updateRoomFrame = function (room) {
        room.frame = room.isOff ? 0 : 1;
    };

    proto.getRoomsBySet = function (roomSet) {
        var rooms;

        rooms = [];
        this.rooms.forEach(function (room) {
            if (room.set === roomSet) {
                rooms.push(room);
            }
        }, this);

        return rooms;
    };

}(Game.prototype));
