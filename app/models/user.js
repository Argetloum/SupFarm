var User = function () {

  this.defineProperties({
    email: {type: 'string'},
    password: {type: 'string'},
    life: {type: 'number', default: 100},
    money: {type: 'number', default: 10000},
    level: {type: 'int', default: 0},
    isAdmin: {type: 'boolean', default: false},
    fights: {type: 'int', default: 0}
  });

  this.hasMany('Tile');
  this.hasMany('Weapons');

  this.initialLife = function () {
    return (this.level * 2) + 10;
  }

  this.regenerate = function () {
    // If not in fight, regenerate the life
    if (this.fights == 0) {
      if (this.life < this.initialLife()) {
        this.life += 2;
        this.save();
        geddy.io.sockets.emit('update-money-' + this.id, { money: this.money, life: this.life  });
      }
    }
  }

  this.canFight = function () {
    var maxFights = Math.round(this.level / 2);
    if (maxFights < 1) {
      maxFights = 1;
    }

    if (this.fights < maxFights) {
      return true;
    } else {
      return false;
    }
  }

  this.hitUser = function (opponentId, damages, tileId, callback) {

    var self = this;

    // Get the opponent
    geddy.model.User.first(opponentId, function (err, attackedUser) {
      // Update life
      attackedUser.life -= damages;
      if (attackedUser.life <= 0) {
        attackedUser.life = 0;
      }

      // Save it
      attackedUser.save(function (err, data) {
        // If somebody win
        if (attackedUser.life == 0) {

          // First remove the fight entity
          geddy.model.Fight.first({tileId: tileId}, function (err, fight) {
            geddy.model.Fight.remove(fight.id, function (err, data) {
            });
          });

          // Update user level
          self.level += 1;
          self.fights -= 1;
          if(self.fights < 0){
            self.fights = 0;
          }
          self.save(function (err, data) {
            // Update the tile
            geddy.model.Tile.first(tileId, function (err, tile) {
              tile.userId = self.id;
              tile.save(function (err, data) {
                attackedUser.level -= 1;
                attackedUser.fights -= 1;
                if(attackedUser.fights < 0){
                  attackedUser.fights = 0;
                }
                attackedUser.save(function (err, data) {

                  // Check if tile has a crop
                  if (tile.getCrop(function (err, crop) {
                    // We have a crop
                    if (crop != undefined) {
                      crop.getCropInformation(function (err, cropInformation) {
                        // Send notification
                        tile.cropName = cropInformation.name;
                        tile.cropMaturity = crop.maturity;
                        tile.cropHealth = crop.health;
                        tile.cropFertility = crop.fertility;
                        tile.cropHumidity = crop.humidity;
                        geddy.io.sockets.emit('fight-end-' + self.id, tile);
                        geddy.io.sockets.emit('fight-end-' + attackedUser.id, tile);
                      });
                      // We check if a building exist
                    } else {
                      if (tile.getBuilding(function (err, building) {
                        // We have a building
                        if (building != undefined) {
                          geddy.model.Building.remove(building.id, function (err) {

                          });
                          tile.removeBuilding = 1;
                          geddy.io.sockets.emit('fight-end-' + self.id, tile);
                          geddy.io.sockets.emit('fight-end-' + attackedUser.id, tile);
                        } else {
                          // Add tile normaly
                          geddy.io.sockets.emit('fight-end-' + self.id, tile);
                          geddy.io.sockets.emit('fight-end-' + attackedUser.id, tile);
                        }
                      }));
                    }
                  }));

                  if (callback != undefined) {
                    callback();
                  }
                });
              });
            });
          });
        } else {
          // Update remove the fight entity
          geddy.model.Fight.first({tileId: tileId}, function (err, fight) {
            fight.nextPlayerId = attackedUser.id;
            fight.save(function (err, data) {
            });
          });

          // Just send update
          geddy.io.sockets.emit('user-hit-' + attackedUser.id, attackedUser);
          geddy.io.sockets.emit('user-hit-' + self.id, attackedUser);

          if (callback != undefined) {
            callback();
          }
        }
      });
    });
  }
};

User.usersToCreate = [];

// Seed the database
User.seedDatabase = function () {
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.User.all(function (err, users) {
    if (users.length == 0) {
      // Create the administrators
      geddy.model.User.addUserToCreate({ email: "echiaro@me.com", password: "admin", isAdmin: true, level: 0, money: 2000});
      geddy.model.User.addUserToCreate({ email: "florian.mithieux@gmail.com", password: "admin", isAdmin: true, level: 0, money: 2000 });
      geddy.model.User.addUserToCreate({ email: "agamond@me.com", password: "admin", isAdmin: true, level: 0, money: 2000 });
    }
  });
};

User.startWorld = function () {
  setInterval(function () {
    // Make crop grow
    geddy.model.Crop.all(function (err, crops) {
      for (var i = 0; i < crops.length; i++) {
        crops[i].grow();
      }
    });

    // Regenerate players life
    geddy.model.User.all(function (err, users) {
      for (var i = 0; i < users.length; i++) {
        users[i].regenerate();
      }
    });

    // Ensure the fights keep moving
    geddy.model.Fight.all(function (err, fights) {
      for (var i = 0; i < fights.length; i++) {
        fights[i].autoPlayIfNeeded();
      }
    });
  }, 5000);
}

// Add a user to create
// Public function to use
User.addUserToCreate = function (userToCreate, callback) {
  if (callback == undefined) {
    console.log("NO CALLBACK IN ADD USER");
  }
  console.log("Add user to create");
  User.usersToCreate.push({userToCreate: userToCreate, callback: callback});
  console.log("Length of userstocreate : " + User.usersToCreate.length);
  // If it's the only user to create
  if (User.usersToCreate.length == 1) {
    // Create it
    User.createUser(userToCreate, callback);
  }
};

// Creation method to assign automatically tiles after creation
// Only on private purpose
User.createUser = function (json, callback) {
  console.log('CREATE USER');
  console.log(json);
  var nbOfOccurrence = 0;

  var user = geddy.model.User.create(json);

  geddy.model.GameConfiguration.first(function (err, gameConfiguration) {
    var startMoney = gameConfiguration.startMoney;
    switch (parseInt(json.difficulty)) {
      case 0:
        user.money = startMoney;
        break;
      case 1:
        user.money = startMoney * 0.5;
        break;
      case 2:
        user.money = startMoney * 0.1;
        break;
    }
    user.level = 0;
    user.life = 10;
    user.fights = 0;
    // Add the two bases weapon
    user.save(function (err, user) {
      geddy.model.WeaponInformation.first({ name: "Fork" }, function (err, fork) {
        var newWeapon = geddy.model.Weapon.create({weaponInformationId: fork.id, userId: user.id});
        newWeapon.save(function (err, weapon) {
          user.save(function (err, user) {
            if (err) {
              console.log('error creating user');
            } else {
              findTilesForNewUser(err, gameConfiguration, nbOfOccurrence, user, callback);
            }
          });
        });
      });
    });
  });
}

// Found the place to give a new users's tiles
function findTilesForNewUser(err, gameConfiguration, nbOfOccurrence, user, callback) {

  // If we don't find a place to add the tiles, extend the map size
  if (nbOfOccurrence == 20) {
    console.log('Can not find free tiles, need to extand the game !!!!');
    gameConfiguration.size += gameConfiguration.territorySize + 2;
    gameConfiguration.save(function (err, gameConfiguration) {
      var maxSize = gameConfiguration.size;
      var initialSize = gameConfiguration.territorySize;

      // Now create the new territory
      // First choose between right and bottom zone
      var random = Math.random();
      var randomX;
      var randomY;

      // Choose Bottom
      if (random > 0.5) {
        randomX = randomForTiles(1, maxSize - initialSize);
        // We have a minimum y
        randomY = randomForTiles(maxSize - (initialSize), maxSize - initialSize);
      }
      // Choose Right
      else {
        // We have a minimum x
        randomX = randomForTiles(maxSize - (initialSize), maxSize - initialSize);
        randomY = randomForTiles(1, maxSize - initialSize);
      }

      generateTiles(randomX, randomY, initialSize, user, callback);
    });

    return;
  }

  console.log('find tiles');
  var maxSize = gameConfiguration.size;
  var initialSize = gameConfiguration.territorySize;

  // Do the random
  var randomX = randomForTiles(1, maxSize - initialSize);
  var randomY = randomForTiles(1, maxSize - initialSize);
  console.log('random x : ' + randomX + ' random y : ' + randomY);
  // And test the tiles
  geddy.model.Tile.all({and: [
    {positionX: {'gte': randomX - 1}},
    {positionX: {'lte': randomX + initialSize}}
  ], and: [
    {positionY: {'gte': randomY - 1}},
    {positionY: {'lte': randomY + initialSize}}
  ]}, {}, function (err, tiles) {
    // If we have tiles, it means the zone isn't empty
    if (tiles.length) {
      console.log('tiles already exists');
      // So re-call the function
      nbOfOccurrence++;
      findTilesForNewUser(err, gameConfiguration, nbOfOccurrence, user, callback);
    } else {
      console.log('no tiles, create form x ' + randomX + ' y ' + randomY);
      // We can create the tiles for the user, they are free
      generateTiles(randomX, randomY, initialSize, user, callback);
    }
  });
}

// Tool
function randomForTiles(min, max) {
  return parseInt((Math.random() * (max - min)) + min);
}

// Tiles generation for a user
function generateTiles(originX, originY, territorySize, user, callback) {
  // We can create the tiles for the user, they are free
  for (var x = originX; x < originX + territorySize; x++) {
    for (var y = originY; y < originY + territorySize; y++) {
      var newTile = geddy.model.Tile.create({ positionX: x, positionY: y});
      newTile.save(function (err, tile) {
        user.addTile(newTile);
        user.level += 1;
        user.save();
      });
    }
  }

  // After that remove the last item of usersToCreate
  User.usersToCreate.shift();

  if (User.usersToCreate.length) {
    // Launch the next item if necessary
    User.createUser(User.usersToCreate[0].userToCreate, User.usersToCreate[0].callback);
  }

  if (callback != undefined) {
    callback(user);
  }
}

User = geddy.model.register('User', User);

