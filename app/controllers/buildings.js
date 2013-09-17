var Buildings = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Building.all(function (err, buildings) {
      self.respond({params: params, buildings: buildings});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {

    var self = this
      , building = geddy.model.Building.create(params);

    if (params.tileId != undefined) {
      building.save(function (err, data) {
        geddy.model.Tile.first({id: params.tileId}, function (err, tile) {
          tile.setBuilding(building);
          tile.save(function (err, data) {

            building.getBuildingInformation(function(err, buildingInformation){
              tile.buildingName = buildingInformation.name;
              tile.buildingId = building.id;

              if(buildingInformation.width > 1 || buildingInformation.height > 1){
                // Need to update the other tile buildingId
                geddy.model.Tile.all({and: [
                  {positionX: {'gte': tile.positionX }},
                  {positionX: {'lt': tile.positionX + buildingInformation.width}},
                  {positionY: {'gte': tile.positionY}},
                  {positionY: {'lt': tile.positionY + buildingInformation.height}}
                ]}, {}, function (err, queryTiles) {
                  for(var i in queryTiles){
                    var tmpTile = queryTiles[i];
                    tmpTile.buildingId = building.id;
                    if(tile.positionX == tmpTile.positionX && tile.positionY == tmpTile.positionY){
                      tmpTile.buildingName = buildingInformation.name;
                    }

                    geddy.io.sockets.emit('update-tile-' + tmpTile.userId, JSON.stringify(tmpTile));
                  }
                });
              }else{
                geddy.io.sockets.emit('update-tile-' + tile.userId, JSON.stringify(tile));
              }

              // And update the player money
              tile.getUser(function (err, user) {
                user.money -= buildingInformation.cost;
                user.save(function (err, data) {
                  if (!err) {
                    geddy.io.sockets.emit('update-money-' + user.id, { money: user.money, life: user.life });
                  }
                });
              });
            });
          });
        });
      });
    }

    self.redirect({controller: self.name});
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Building.first(params.id, function (err, building) {
      self.respond({params: params, building: building.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Building.first(params.id, function (err, building) {
      self.respond({params: params, building: building});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Building.first(params.id, function (err, building) {
      building.updateProperties(params);

      building.save(function (err, data) {
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

    geddy.model.Building.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Buildings = Buildings;
