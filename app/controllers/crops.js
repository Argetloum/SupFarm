var Crops = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Crop.all(function (err, crops) {
      self.respond({params: params, crops: crops});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);
    params.maturity = 0;

    var self = this
      , crop = geddy.model.Crop.create(params);

    crop.save(function (err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        if (params.tileId != undefined) {
          geddy.model.Tile.first({id: params.tileId}, function (err, tile) {
            tile.cropId = crop.id;
            tile.save(function (err, data) {
              if (data) {

                // Send the notification to update the map
                crop.getCropInformation(function (err, cropInformation) {
                  // Send notification
                  tile.cropName = cropInformation.name;
                  tile.cropMaturity = crop.maturity;
                  tile.cropHealth = crop.health;
                  tile.cropFertility = crop.fertility;
                  tile.cropHumidity = crop.humidity;
                  geddy.io.sockets.emit('update-tile-' + tile.userId, JSON.stringify(tile));

                  // And update the player money
                  tile.getUser(function (err, user) {
                    user.money -= cropInformation.cost;
                    user.save(function (err, data) {
                      if (!err) {
                        geddy.io.sockets.emit('update-money-' + user.id, { money: user.money, life: user.life  });
                      }
                    });
                  });
                });

                self.redirect({controller: self.name});
              }
            });
          });
        } else {
          self.redirect({controller: self.name});
        }
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Crop.first(params.id, function (err, crop) {
      self.respond({params: params, crop: crop.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Crop.first(params.id, function (err, crop) {
      self.respond({params: params, crop: crop});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Crop.first(params.id, function (err, crop) {
      crop.updateProperties(params);

      crop.save(function (err, data) {
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

    geddy.model.Crop.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.harvest = function (req, resp, params) {
    var self = this;
    geddy.model.Tile.first(params.id, function (err, tile) {

      if (tile.getCrop(function (err, crop) {
        if (crop != undefined) {

          // Sell it if asked
          if (params.buildingId == undefined) {
            crop.getCropInformation(function (err, cropInformation) {
              self.sell(cropInformation.name, params.userId);
            });
          } else {
            // Or store it in building
            self.store(crop, params.buildingId);
          }

          // Then delete it from the tile
          geddy.model.Crop.remove(crop.id, function (err, data) {
          });

          // Send update for the tile (to remove the crop)
          geddy.io.sockets.emit('update-tile-' + tile.userId, JSON.stringify(tile));
        } else {
          console.log('CROP UNDEFINED');
        }

        // End the ajax call
        self.respond({}, {format: 'json'});
      }));
    });
  }

  this.store = function (crop, buildingId) {
    var self = this;

    geddy.model.Building.first(buildingId, function (err, building) {
      if (building != undefined) {
        // Create the new building storage
        var buildingStorage = geddy.model.BuildingStorage.create({ cropInformationId: crop.cropInformationId, buildingId: buildingId, health: crop.health });
        buildingStorage.save(function (err, date) {
          // Send the notification to update the UI
        });
      }
    });
  }

  this.sell = function (cropName, userId) {
    var self = this;

    geddy.model.User.first(userId, function (err, user) {
      if (user != undefined) {
        var moneyToAdd = 0;
        switch (cropName) {
          case "Carrot":
            moneyToAdd = 50;
            break;
          case "Aubergine":
            moneyToAdd = 70;
            break;
          case "Corn":
            moneyToAdd = 250;
            break;
          case "Tomato":
            moneyToAdd = 80;
            break;
          case "Pepper":
            moneyToAdd = 100;
            break;
        }

        user.money += moneyToAdd;
        user.save(function (err, data) {
          // Send notification to update the user status
          if (!err) {
            geddy.io.sockets.emit('update-money-' + userId, { money: user.money, life: user.life  });
          }
        });
      }
    });


  }
};

exports.Crops = Crops;
