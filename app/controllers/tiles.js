var Tiles = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.all(function (err, tiles) {
      self.respond({params: params, tiles: tiles});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , tile = geddy.model.Tile.create(params);

    tile.save(function (err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.first(params.id, function (err, tile) {
      self.respond({params: params, tile: tile.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.first(params.id, function (err, tile) {
      self.respond({params: params, tile: tile});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.first(params.id, function (err, tile) {
      tile.updateProperties(params);

      tile.save(function (err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.attack = function (req, resp, params) {
    var self = this;

    // Get the tile
    geddy.model.Tile.first({ positionX: parseInt(params.positionX), positionY: parseInt(params.positionY)}, function (err, tile) {

      // Re-assign the tile
      if (tile == undefined) {
        console.log('tile gratis');
        tile = geddy.model.Tile.create(params);
        tile.save(function (err, data) {
          tile.getUser(function (err, user) {
            user.level += 1;
            user.save(function (err, data) {
              self.respond({positionX: tile.positionX, positionY: tile.positionY, id: tile.id}, {format: 'json'});
            });
          });
        });
      } else {
        console.log('tile not gratis');
        // Check if the user can fight (depending on his level)

        // First get the opponent
        geddy.model.User.first(params.userId, function (err, currentUser) {
          if (currentUser.canFight() == true) {
            tile.getUser(function (err, opponent) {
              // Get the weapons
              opponent.getWeapons(function (err, opponentWeapons) {
                currentUser.getWeapons(function (err, weapons) {

                  // Get all weapons information to add them as weapons of the user
                  geddy.model.WeaponInformation.all(function (err, weaponInformations) {
                    var opponentWeaponInformations = new Array();
                    var userWeaponInformations = new Array();
                    for (var i in weaponInformations) {
                      var weaponInformation = weaponInformations[i];

                      // Add to user weapons if present
                      for (var j in weapons) {
                        var weapon = weapons[j];
                        if (weapon.weaponInformationId == weaponInformation.id) {
                          userWeaponInformations.push(weaponInformation);
                          break;
                        }
                      }

                      // Add to opponent weapons if present
                      for (var j in opponentWeapons) {
                        var weapon = opponentWeapons[j];
                        if (weapon.weaponInformationId == weaponInformation.id) {
                          opponentWeaponInformations.push(weaponInformation);
                          break;
                        }
                      }
                    }

                    // Create the fight entity
                    var newFight = geddy.model.Fight.create({ownerId: currentUser.id, opponentId: opponent.id, nextPlayerId: currentUser.id, tileId: tile.id});
                    newFight.save(function (err, data) {
                      console.log('error : ' + JSON.stringify(err) + ' - ' + data);
                      // Increase number of fights
                      currentUser.fights += 1;
                      currentUser.save();

                      opponent.fights += 1;
                      opponent.save();

                      currentUser.initialLife = currentUser.initialLife();
                      opponent.initialLife = opponent.initialLife();

                      // Send the notification for both user
                      geddy.io.sockets.emit('start-fight-' + opponent.id, { user: opponent, opponent: currentUser, weapons: opponentWeaponInformations, startingUser: currentUser.id, tile: tile.id });
                      geddy.io.sockets.emit('start-fight-' + currentUser.id, { user: currentUser, opponent: opponent, weapons: userWeaponInformations, startingUser: currentUser.id, tile: tile.id });
                    });
                  });
                });
              });
            });
          }

          /*
           // Update new user level
           geddy.model.User.first(params.userId, function (err, user) {
           user.level += 1;
           user.save(function (err, data) {
           // Update the tile
           tile.updateProperties(params);
           tile.save(function (err, data) {

           // Update previous user level
           if (previousUser != undefined) {
           previousUser.level -= 1;
           previousUser.save(function (err, data) {
           self.respond({positionX: tile.positionX, positionY: tile.positionY, id: tile.id}, {format: 'json'});
           });
           } else {
           self.respond({positionX: tile.positionX, positionY: tile.positionY, id: tile.id}, {format: 'json'});
           }
           });
           });
           });*/
        });


        // Ensure to send a response
        self.respond({}, {format: 'json'});
      }
    });
  };

  this.watering = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.first(params.id, function (err, tile) {

      if (tile.getCrop(function (err, crop) {
        if (crop != undefined) {

          if (crop.humidity < 100)
            crop.humidity += 10;

          if (crop.humidity > 100)
            crop.humidity = 100;
          crop.health = (crop.fertility + crop.humidity) / 2;

          crop.save(function (err, data) {
            // send a response
            self.respond({}, {format: 'json'});
          });
        } else {
          console.log('water sur pas crop');
          self.respond({}, {format: 'json'});
        }
      }));

    });


  }

  this.fertilizing = function (req, resp, params) {
    var self = this;

    geddy.model.Tile.first(params.id, function (err, tile) {

      if (tile.getCrop(function (err, crop) {
        if (crop != undefined) {
          if (crop.fertility < 100)
            crop.fertility += 10;

          if (crop.fertility > 100)
            crop.fertility = 100;
          crop.health = (crop.fertility + crop.humidity) / 2;

          crop.save(function (err, data) {
            // send a response
            self.respond({}, {format: 'json'});
          });
        } else {
          console.log('fertilize sur pas crop');
          self.respond({}, {format: 'json'});

        }
      }));

    });


  }
};

exports.Tiles = Tiles;
