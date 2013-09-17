var BuildingStorages = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingStorage.all(function (err, buildingStorages) {
      self.respond({params: params, buildingStorages: buildingStorages});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , buildingStorage = geddy.model.BuildingStorage.create(params);

    buildingStorage.save(function (err, data) {
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

    geddy.model.BuildingStorage.first(params.id, function (err, buildingStorage) {
      self.respond({params: params, buildingStorage: buildingStorage.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingStorage.first(params.id, function (err, buildingStorage) {
      self.respond({params: params, buildingStorage: buildingStorage});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingStorage.first(params.id, function (err, buildingStorage) {
      buildingStorage.updateProperties(params);

      buildingStorage.save(function (err, data) {
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

    geddy.model.BuildingStorage.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

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

  this.sellCrop = function (req, resp, params) {
    var self = this;
    geddy.model.BuildingStorage.all({buildingId: params.buildingId}, function (err, buildingStorages) {
      if (buildingStorages.length != 0) {
        geddy.model.CropInformation.all(function (err, cropInformations) {
          var crops = new Array();
          for (var i in cropInformations) {
            var crop = cropInformations[i];
            crops[crop.id] = crop;
          }

          for (var i in buildingStorages) {
            var building = buildingStorages[i];

            var crop = crops[building.cropInformationId];
            if(crop.name == params.cropName){
              self.sell(crop.name, params.userId);
              geddy.model.BuildingStorage.remove(building.id, function(err){
                // Todo
                self.respond({}, 'json');
              });
            }

          }

        });
      }
    });
  }

  this.cropsCount = function (req, resp, params) {
    var self = this;

    console.log("buildingID " + params.buildingId);
    geddy.model.BuildingStorage.all({buildingId: params.buildingId}, function (err, buildingStorages) {

      var aubergine = 0;
      var carrot = 0;
      var corn = 0;
      var pepper = 0;
      var tomato = 0;

      if (buildingStorages.length != 0) {
        geddy.model.CropInformation.all(function (err, cropInformations) {

          var crops = new Array();
          for (var i in cropInformations) {
            var crop = cropInformations[i];
            crops[crop.id] = crop;
          }

          for (var i in buildingStorages) {
            var building = buildingStorages[i];

            var crop = crops[building.cropInformationId];

            switch (crop.name) {
              case 'Aubergine':
                aubergine++;
                break;
              case 'Tomato':
                tomato++;
                break;
              case 'Carrot':
                carrot++;
                break;
              case 'Corn':
                corn++;
                break;
              case 'Pepper':
                pepper++;
                break;
            }

          }

          self.respond({buildingStorages: buildingStorages, aubergine: aubergine, tomato: tomato, carrot: carrot, corn: corn, pepper: pepper}, {format: "json"});
        });
      } else {
        self.respond({buildingStorages: buildingStorages, aubergine: aubergine, tomato: tomato, carrot: carrot, corn: corn, pepper: pepper}, {format: "json"});
      }

    });

  }

};

exports.BuildingStorages = BuildingStorages;
