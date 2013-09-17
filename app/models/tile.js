var Tile = function () {

  this.defineProperties({
    positionX: {type: 'int'},
    positionY: {type: 'int'},
  });

  this.belongsTo('User');
  this.hasOne('Building');
  this.hasOne('Crop');
};

// Seed the database
Tile.seedDatabase = function(){
  // Nothing to do
};

Tile = geddy.model.register('Tile', Tile);

