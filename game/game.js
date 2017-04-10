var score = 0;
var scoreText;
var map_x = 14;
var map_y = 10;

var game = new Phaser.Game(map_x * 16, map_y * 16, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    // game.scale.maxWidth = 600;
    // game.scale.maxHeight = 600;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();
    game.load.image('cat', 'assets/cat.png', 16, 16);
    game.load.image('ground', 'assets/darkfloor.png', 16, 16);
    game.load.image('l_wall', 'assets/l_wall.png', 16, 16);
    game.load.image('r_wall', 'assets/r_wall.png', 16, 16);
    game.load.image('t_wall', 'assets/t_wall.png', 16, 16);
    game.load.image('tr_wall', 'assets/tr_wall_iso.png', 16, 16);
    game.load.image('tl_wall', 'assets/tl_wall_iso.png', 16, 16);
    game.load.image('bl_wall', 'assets/bl_wall.png', 16, 16);
    game.load.image('br_wall', 'assets/br_wall.png', 16, 16);
    game.load.image('stone_door', 'assets/door_stone.png', 16, 16);
    game.load.image('star', 'assets/star.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // the game world

    gmap = game.add.tilemap();
    gmap.addTilesetImage('ground', 'ground', 16, 16, null, null, 0);
    gmap.addTilesetImage('l_wall', 'l_wall', 16, 16, null, null, 1);
    gmap.addTilesetImage('r_wall', 'r_wall', 16, 16, null, null, 2);
    gmap.addTilesetImage('tr_wall', 'tr_wall', 16, 16, null, null, 3);
    gmap.addTilesetImage('tl_wall', 'tl_wall', 16, 16, null, null, 4);
    gmap.addTilesetImage('br_wall', 'br_wall', 16, 16, null, null, 5);
    gmap.addTilesetImage('bl_wall', 'bl_wall', 16, 16, null, null, 6);
    gmap.addTilesetImage('t_wall', 't_wall', 16, 16, null, null, 7);
    gmap.addTilesetImage('stone_door', 'stone_door', 16, 16, null, null, 8);
    ground_layer = gmap.create('ground_layer', map_x, map_y, 16, 16);
    wall_layer = gmap.create('wall_layer', map_x, map_y, 16, 16);

    for (var i=0; i<map_x; i++) {
        for(var j=0; j<map_y; j++) {
            if (i==0 && j==0) {
                gmap.putTile(4, i, j, wall_layer);
            } else if (i==map_x/2 && j==0) {
                gmap.putTile(8, i, j, wall_layer);
            } else if (i==map_x-1 && j == map_y-1) {
                gmap.putTile(5, i, j, wall_layer);
            } else if (i==0 && j == map_y-1) {
                gmap.putTile(6, i, j, wall_layer);
            } else if (i==map_x-1 && j == 0) {
                gmap.putTile(3, i, j, wall_layer);
            } else if (i==map_x-1 && j == map_y-1) {
                gmap.putTile(6, i, j, wall_layer);
            } else if (i==0) {
                gmap.putTile(1, i, j, wall_layer);
            } else if(i==map_x-1) {
                gmap.putTile(2, i, j, wall_layer);
            } else if(j==map_y-1) {
                gmap.putTile(7, i, j, wall_layer);
            } else if(j==0) {
                gmap.putTile(7, i, j, wall_layer);
            } else {
                gmap.putTile(0, i, j, ground_layer);
            }
        }
    }

    wall_layer.resizeWorld();
    game.physics.arcade.enable(wall_layer);
    gmap.setCollision(wall_layer);


    // the player
    player = game.add.sprite(32, 32, 'cat');
    game.physics.arcade.enable(player);

     player.body.collideWorldBounds = true;
    // gmap.setCollisionBetween(0, 100, true, wall_layer);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {
    
    game.physics.arcade.collide(player, wall_layer);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 150;
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -150;
    } else {
    }

}

