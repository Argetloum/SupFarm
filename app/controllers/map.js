var usersToCreate = 0;
var myparams;

var Map = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.creationCallback = function () {
    usersToCreate--;
    this.createUsers();
  }

  this.createUsers = function () {
    if (usersToCreate == 0) {
      this.redirectToMap();
    } else {
      var self = this;
      geddy.model.User.addUserToCreate({ email: "salut", password: "salut", isAdmin: false }, function (user) {
        self.creationCallback();
      });
    }
  };

  this.respondToMap = function (gameConfiguration, tiles) {
    var self = this;
    var userInfos = undefined;
    if (self.session.get('authenticated'))
      userInfos = self.session.get('user');

    geddy.model.BuildingInformation.all(function (err, buildingInformations) {
      geddy.model.CropInformation.all(function (err, cropInformations) {
        self.respond({
          params: myparams,
          mapSize: gameConfiguration.size,
          buildingInformations: buildingInformations,
          cropInformations: cropInformations,
          tiles: tiles,
          userInfos: userInfos
        });
      });
    });
  }

  this.computeTilesBuildings = function (tiles, currentIndex, gameConfiguration) {
    var tile = tiles[currentIndex];
    var self = this;

    tile.getBuilding(function (err, building) {
      if (building != undefined) {
        building.getBuildingInformation(function (err, buildingInformation) {
          tile.buildingName = buildingInformation.name;
          tile.buildingId = building.id;

          // Update the other tiles that have the building
          // Loop to assign the building id
          for (var i in tiles) {
            var tmpTile = tiles[i];
            if (tmpTile.positionX >= tile.positionX && tmpTile.positionX <= tile.positionX + buildingInformation.width
              && tmpTile.positionY >= tile.positionY && tmpTile.positionY <= tile.positionY + buildingInformation.height) {
              tmpTile.buildingId = building.id;
            }
          }

          currentIndex--;
          if (currentIndex == 0) {
            self.computeTilesCrops(gameConfiguration, tiles.length - 1, tiles);
          } else {
            self.computeTilesBuildings(tiles, currentIndex, gameConfiguration);
          }
        });
      } else {
        currentIndex--;
        if (currentIndex == 0) {
          self.computeTilesCrops(tiles, tiles.length - 1, gameConfiguration);
        } else {
          self.computeTilesBuildings(tiles, currentIndex, gameConfiguration);
        }
      }
    });
  }

  this.computeTilesCrops = function (tiles, currentIndex, gameConfiguration) {
    var tile = tiles[currentIndex];
    var self = this;

    tile.getCrop(function (err, crop) {
      if (crop != undefined) {
        crop.getCropInformation(function (err, cropInformation) {
          tile.cropName = cropInformation.name;
          tile.cropMaturity = crop.maturity;
          tile.cropHealth = crop.health;
          tile.cropFertility = crop.fertility;
          tile.cropHumidity = crop.humidity;
          currentIndex--;
          if (currentIndex == 0) {
            self.respondToMap(gameConfiguration, tiles);
          } else {
            self.computeTilesCrops(tiles, currentIndex, gameConfiguration);
          }
        });
      } else {
        currentIndex--;
        if (currentIndex == 0) {
          self.respondToMap(gameConfiguration, tiles);
        } else {
          self.computeTilesCrops(tiles, currentIndex, gameConfiguration);
        }
      }
    });
  }

  this.redirectToMap = function () {
    var self = this;
    geddy.model.GameConfiguration.first(function (err, gameConfiguration) {
      geddy.model.Tile.all({ userId: self.session.get('user').id }, function (err, tiles) {
        var tilesToTreat = tiles.length;
        self.computeTilesBuildings(tiles, tilesToTreat - 1, gameConfiguration);
      });
    });
  }

  this.index = function (req, resp, params) {
    myparams = params;
    if (this.session.get('user') == undefined) {
      this.redirect('/');
    } else {
      if (usersToCreate > 0) {
        this.createUsers();
      } else {
        this.redirectToMap();
      }
    }
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    this.respond({params: params});
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.destroy = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Map = Map;

