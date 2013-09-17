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

