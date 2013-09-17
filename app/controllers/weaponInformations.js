var WeaponInformations = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.WeaponInformation.all(function (err, weapons) {
      self.respond({params: params, weaponInformations: weapons});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , weapon = geddy.model.WeaponInformation.create(params);

    weapon.save(function (err, data) {
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

    geddy.model.WeaponInformation.first(params.id, function (err, weapon) {
      self.respond({params: params, weaponInformation: weapon.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.WeaponInformation.first(params.id, function (err, weapon) {
      self.respond({params: params, weaponInformation: weapon});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.WeaponInformation.first(params.id, function (err, weapon) {
      weapon.updateProperties(params);

      weapon.save(function (err, data) {
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

    geddy.model.WeaponInformation.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.store = function (req, resp, params) {
    var self = this;
    // First get all the weapons informations available
    geddy.model.WeaponInformation.all(function (err, weaponInformations) {
      // Then get all the user weapons
      geddy.model.Weapon.all({ userId: params.userId }, function (err, weapons) {
        // Generate the list
        for (var i in weaponInformations) {
          var owned = false;
          for (var j in weapons) {
            if (weapons[j].weaponInformationId == weaponInformations[i].id) {
              owned = true;
              break;
            }
          }

          weaponInformations[i].owned = owned;
        }

        self.respond(weaponInformations, {format: 'json'});
      });
    });
  }

  this.buy = function (req, resp, params) {
    var self = this;

    // Get the user
    geddy.model.User.first(params.userId, function (err, user) {
      // Check if user has enough money
      geddy.model.WeaponInformation.first(params.weaponId, function (err, weaponInformation) {
        if (user.money >= weaponInformation.price) {
          // Create the new weapon
          console.log('new weapon inf id : ' + params.weaponId);
          var newWeapon = geddy.model.Weapon.create({weaponInformationId: params.weaponId, userId: user.id});
          newWeapon.save(function (err, weapon) {
            // Set it to the user
            user.addWeapon(newWeapon);
            user.money -= weaponInformation.price;
            user.save(function (err, user) {
              self.respond(newWeapon, {format: 'json'});
              geddy.io.sockets.emit('update-money-' + user.id, { money: user.money });
            });
          });
        } else {
          self.respond({ error: 'not enough money'}, {format: 'json'});
        }
      });
    });
  }
};

exports.WeaponInformations = WeaponInformations;
