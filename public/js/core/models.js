(function () {
var Alliance = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    users: {type: 'array'},
  });

  this.hasMany('User');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Alliance.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Alliance.someStaticMethod = function () {
  // Do some other stuff
};
Alliance.someStaticProperty = 'YYZ';
*/

Alliance = geddy.model.register('Alliance', Alliance);

}());

(function () {
var Building = function () {

  this.defineProperties({
  });
  
  this.hasOne('Tile');
  this.belongsTo('BuildingInformation');
  this.hasMany('BuildingStorage');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Building.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Building.someStaticMethod = function () {
  // Do some other stuff
};
Building.someStaticProperty = 'YYZ';
*/

Building = geddy.model.register('Building', Building);

}());

(function () {
var BuildingInformation = function () {

  this.defineProperties({
    name: {type: 'string'},
    image: {type: 'string'},
    width: {type: 'int'},
    height: {type: 'int'},
    power: {type: 'int'},
    cost: {type: 'number'},
    storageQuantity: {type: 'int'},
    storageTime: {type: 'int'},
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
BuildingInformation.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
BuildingInformation.someStaticMethod = function () {
  // Do some other stuff
};
BuildingInformation.someStaticProperty = 'YYZ';
*/

// Seed the database
BuildingInformation.seedDatabase = function(){
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.BuildingInformation.all(function(err, buildingInformations) {
    if(buildingInformations.length == 0){
      // Create the default crops informationss
      var silo        = geddy.model.BuildingInformation.create({ name: "Silo", image: "/img/building/silo.png", width: 1, height: 1, power: 60, cost: 80, storageQuantity: 1, storageTime: 20});
      var barn        = geddy.model.BuildingInformation.create({ name: "Barn", image: "/img/building/barn.png", width: 2, height: 2, power: 180, cost: 240, storageQuantity: 2, storageTime: 60});
      var coldStorage = geddy.model.BuildingInformation.create({ name: "Cold storage", image: "/img/building/coldStorage.png", width: 3, height: 2, power: 600, cost: 1000, storageQuantity: 6, storageTime: 0});
      
      // And save all
      silo.save();
      barn.save();
      coldStorage.save();
    }
  });  
};

BuildingInformation = geddy.model.register('BuildingInformation', BuildingInformation);

}());

(function () {
var BuildingStorage = function () {

  this.defineProperties({
    health: {type: 'int'}
  });

  this.hasOne('Building');
  this.belongsTo('CropInformation');
  /*
   this.property('login', 'string', {required: true});
   this.property('password', 'string', {required: true});
   this.property('lastName', 'string');
   this.property('firstName', 'string');

   this.validatesPresent('login');
   this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
   this.validatesLength('login', {min: 3});
   // Use with the name of the other parameter to compare with
   this.validatesConfirmed('password', 'confirmPassword');
   // Use with any function that returns a Boolean
   this.validatesWithFunction('password', function (s) {
   return s.length > 0;
   });

   // Can define methods for instances like this
   this.someMethod = function () {
   // Do some stuff
   };
   */

};

/*
 // Can also define them on the prototype
 BuildingStorage.prototype.someOtherMethod = function () {
 // Do some other stuff
 };
 // Can also define static methods and properties
 BuildingStorage.someStaticMethod = function () {
 // Do some other stuff
 };
 BuildingStorage.someStaticProperty = 'YYZ';
 */

BuildingStorage = geddy.model.register('BuildingStorage', BuildingStorage);

}());

(function () {
var Crop = function () {

  this.defineProperties({
    humidity: {type: 'int'},
    fertility: {type: 'int'},
    health: {type: 'int'},
    maturity: {type: 'int'}
  });

  this.hasOne('Tile');
  this.belongsTo('CropInformation');

  /*
   this.property('login', 'string', {required: true});
   this.property('password', 'string', {required: true});
   this.property('lastName', 'string');
   this.property('firstName', 'string');

   this.validatesPresent('login');
   this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
   this.validatesLength('login', {min: 3});
   // Use with the name of the other parameter to compare with
   this.validatesConfirmed('password', 'confirmPassword');
   // Use with any function that returns a Boolean
   this.validatesWithFunction('password', function (s) {
   return s.length > 0;
   });

   // Can define methods for instances like this
   this.someMethod = function () {
   // Do some stuff
   };
   */

  this.grow = function () {
    var self = this;
    var cropDie = false;
    this.getCropInformation(function (err, cropInformation) {

      // Reduce fertility and humidity
      if (self.maturity > 50) {
        self.fertility -= 1;
        self.humidity -= 1;
      }

      // HEALTH
      self.health = parseInt((self.fertility + self.humidity) / 2);

      var now = new Date();

      // MATURITY
      if (self.maturity < 100) {
        // Get the time since the crop is created
        var time = now.getTime() - self.createdAt.getTime();
        // Get the percentage of evolution
        self.maturity = Math.round(((1 / cropInformation.maturationTime) * time) * 100);
        if (self.maturity > 100) {
          self.maturity = 100;
        }

      } else {
        // If maturity is at 100, need to test if it's dead due to decay time
        var timePassed = now.getTime() - self.createdAt.getTime();
        // Get the percentage of evolution
        var timeToDie = cropInformation.decayTime + cropInformation.maturationTime;
        if (timePassed >= timeToDie) {
          // Crop die !
          cropDie = true;
        }
      }

      // If health == 0 we remove the crop
      if ((self.health == 0)) {
        cropDie = true;
      }

      // Before applying changes, get the tile to send the notification
      geddy.model.Tile.first(self.tileId, function (err, tile) {
        if (cropDie == false) {
          tile.cropName = cropInformation.name;
          tile.cropMaturity = self.maturity;
          tile.cropHealth = self.health;
          tile.cropFertility = self.fertility;
          tile.cropHumidity = self.humidity;
        }

        if (cropDie == true) {
          geddy.model.Crop.remove(self.id, function (err, data) {
            if (!err) {
              geddy.io.sockets.emit('update-tile-' + tile.userId, JSON.stringify(tile));
            }
          });
        } else {
          self.save(function (err, data) {
            if (!err) {
              geddy.io.sockets.emit('update-tile-' + tile.userId, JSON.stringify(tile));
            } else {
              console.log('ERREUR DE SAUVEGARDE : ' + JSON.stringify(err));
            }
          });
        }
      });
    });
  };
};

/*
 // Can also define them on the prototype
 Crop.prototype.someOtherMethod = function () {
 // Do some other stuff
 };
 // Can also define static methods and properties
 Crop.someStaticMethod = function () {
 // Do some other stuff
 };
 Crop.someStaticProperty = 'YYZ';
 */


Crop = geddy.model.register('Crop', Crop);

}());

(function () {
var CropInformation = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    image: {type: 'string'},
    maturationTime: {type: 'int'},
    decayTime: {type: 'int'},
    productivity: {type: 'int'},
    storability: {type: 'int'},
    cost: {type: 'number'},
    marketPrice: {type: 'number'},
  });

  /*
   this.property('login', 'string', {required: true});
   this.property('password', 'string', {required: true});
   this.property('lastName', 'string');
   this.property('firstName', 'string');

   this.validatesPresent('login');
   this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
   this.validatesLength('login', {min: 3});
   // Use with the name of the other parameter to compare with
   this.validatesConfirmed('password', 'confirmPassword');
   // Use with any function that returns a Boolean
   this.validatesWithFunction('password', function (s) {
   return s.length > 0;
   });

   // Can define methods for instances like this
   this.someMethod = function () {
   // Do some stuff
   };
   */

};

/*
 // Can also define them on the prototype
 CropInformation.prototype.someOtherMethod = function () {
 // Do some other stuff
 };
 // Can also define static methods and properties
 CropInformation.someStaticMethod = function () {
 // Do some other stuff
 };
 CropInformation.someStaticProperty = 'YYZ';
 */

// Seed the database
CropInformation.seedDatabase = function () {
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.CropInformation.all(function (err, cropInformations) {
    if (cropInformations.length == 0) {
      // Create the default crops informationss
      var tomato = geddy.model.CropInformation.create({ name: "Tomato", image: "/img/texture/tomato.png", maturationTime: 10000, decayTime: 10000000, productivity: 60, storability: 80, cost: 1, marketPrice: 2});
      var aubergine = geddy.model.CropInformation.create({ name: "Aubergine", image: "/img/texture/aubergine.png", maturationTime: 5000, decayTime: 1000000, productivity: 60, storability: 80, cost: 1, marketPrice: 2});
      var carrot = geddy.model.CropInformation.create({ name: "Carrot", image: "/img/texture/carrot.png", maturationTime: 200000, decayTime: 100000, productivity: 60, storability: 80, cost: 1, marketPrice: 2});
      var corn = geddy.model.CropInformation.create({ name: "Corn", image: "/img/texture/corn.png", maturationTime: 4000000, decayTime: 150000, productivity: 60, storability: 80, cost: 1, marketPrice: 2});
      var pepper = geddy.model.CropInformation.create({ name: "Pepper", image: "/img/texture/pepper.png", maturationTime: 100000, decayTime: 150000, productivity: 60, storability: 80, cost: 1, marketPrice: 2});

      // And save all
      tomato.save();
      aubergine.save();
      carrot.save();
      corn.save();
      pepper.save();
    }
  });
};

CropInformation = geddy.model.register('CropInformation', CropInformation);

}());

(function () {
var Fight = function () {

  this.defineProperties({
    ownerId: {type: 'string'},
    opponentId: {type: 'string'},
    nextPlayerId: {type: 'string'},
    tileId: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

  this.autoPlayIfNeeded = function(){
    // Test when it has been updated for the last time
    var now = new Date();
    var time = now.getTime() - this.createdAt.getTime();
    var self = this;

    // If it's time to play
    if(time > 10000){
      // => need to autoplay
      // Get the best weapon of the user who has to play
      geddy.model.User.first(this.nextPlayerId, function(err, user){
        geddy.model.Weapon.all({userId: user.id}, function(err, weapons){
          // Get his information
          geddy.model.WeaponInformation.all(function(err, weaponInformations){
            var bestWeapon;

            // Get the best the user have
            for(var i in weaponInformations){
              for(var j in weapons){
                if(weapons[j].weaponInformationId == weaponInformations[i].id){
                  if(bestWeapon == undefined || bestWeapon.power < weaponInformations[i].power){
                    bestWeapon = weaponInformations[i];
                  }
                }
              }
            }

            // And make the attack
            var opponentId = self.ownerId;
            if(opponentId == self.nextPlayerId){
              opponentId = self.opponentId;
            }

            geddy.io.sockets.emit('update-weapon-' + opponentId, bestWeapon);
            user.hitUser(opponentId, bestWeapon.power, self.tileId, function(){});
          });
        });
      });
    }
  }
};

/*
// Can also define them on the prototype
Fight.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Fight.someStaticMethod = function () {
  // Do some other stuff
};
Fight.someStaticProperty = 'YYZ';
*/

Fight = geddy.model.register('Fight', Fight);

}());

(function () {
var GameConfiguration = function () {

  this.defineProperties({
    startMoney: {type: 'int', default: 10000},
    size: {type: 'int', default: 15},
    territorySize: {type: 'int', default: 5}
  });

};

// Seed the database
GameConfiguration.seedDatabase = function(){
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.GameConfiguration.all(function(err, gameConfigurations) {
    if(gameConfigurations.length == 0){
      var gameConfiguration  = geddy.model.GameConfiguration.create({size: 15, territorySize: 5, startMoney:2000});
      gameConfiguration.save(function(err, data){
        if(err){
          console.log("error when creating game : "+err);
        }
      }) 
    }
  });  
};

GameConfiguration = geddy.model.register('GameConfiguration', GameConfiguration);

}());

(function () {
var Map = function () {

  this.defineProperties({
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Map.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Map.someStaticMethod = function () {
  // Do some other stuff
};
Map.someStaticProperty = 'YYZ';
*/

Map = geddy.model.register('Map', Map);

}());

(function () {
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

}());

(function () {
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

}());

(function () {
var Weapon = function () {

  this.defineProperties({
  });

  this.belongsTo('WeaponInformation');
  this.belongsTo('User');

  /*
   this.property('login', 'string', {required: true});
   this.property('password', 'string', {required: true});
   this.property('lastName', 'string');
   this.property('firstName', 'string');

   this.validatesPresent('login');
   this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
   this.validatesLength('login', {min: 3});
   // Use with the name of the other parameter to compare with
   this.validatesConfirmed('password', 'confirmPassword');
   // Use with any function that returns a Boolean
   this.validatesWithFunction('password', function (s) {
   return s.length > 0;
   });

   // Can define methods for instances like this
   this.someMethod = function () {
   // Do some stuff
   };
   */

};

/*
 // Can also define them on the prototype
 Weapon.prototype.someOtherMethod = function () {
 // Do some other stuff
 };
 // Can also define static methods and properties
 Weapon.someStaticMethod = function () {
 // Do some other stuff
 };
 Weapon.someStaticProperty = 'YYZ';
 */

Weapon = geddy.model.register('Weapon', Weapon);

}());

(function () {
var WeaponInformation = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    image: {type: 'string'},
    power: {type: 'number'},
    hitRatio: {type: 'int'},
    hitsPerSecond: {type: 'int'},
    price: {type: 'number'}
  });

  /*
   this.property('login', 'string', {required: true});
   this.property('password', 'string', {required: true});
   this.property('lastName', 'string');
   this.property('firstName', 'string');

   this.validatesPresent('login');
   this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
   this.validatesLength('login', {min: 3});
   // Use with the name of the other parameter to compare with
   this.validatesConfirmed('password', 'confirmPassword');
   // Use with any function that returns a Boolean
   this.validatesWithFunction('password', function (s) {
   return s.length > 0;
   });

   // Can define methods for instances like this
   this.someMethod = function () {
   // Do some stuff
   };
   */

};

/*
 // Can also define them on the prototype
 Weapon.prototype.someOtherMethod = function () {
 // Do some other stuff
 };
 // Can also define static methods and properties
 Weapon.someStaticMethod = function () {
 // Do some other stuff
 };
 Weapon.someStaticProperty = 'YYZ';
 */
// Seed the database
WeaponInformation.seedDatabase = function () {
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.WeaponInformation.all(function (err, weapons) {
    if (weapons.length == 0) {
      // Create the default weapons
      var fork = geddy.model.WeaponInformation.create({ name: "Fork", image: "/img/fork.png", power: 2, hitRatio: 30, hitsPerSeconds: 1, price: 10});
      var baseballBat = geddy.model.WeaponInformation.create({ name: "Baseball bat", image: "/img/baseballBat.png", power: 3, hitRatio: 40, hitsPerSeconds: 2, price: 20});
      var chainsaw = geddy.model.WeaponInformation.create({ name: "Chainsaw", image: "/img/chainsaw.png", power: 10, hitRatio: 60, hitsPerSeconds: 5, price: 100});
      var ak47 = geddy.model.WeaponInformation.create({ name: "Ak47", image: "/img/ak47.png", power: 20, hitRatio: 80, hitsPerSeconds: 10, price: 200});

      // And save all
      fork.save();
      baseballBat.save();
      chainsaw.save();
      ak47.save();
    }
  });
};


WeaponInformation = geddy.model.register('WeaponInformation', WeaponInformation);

}());