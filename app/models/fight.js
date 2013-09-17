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

