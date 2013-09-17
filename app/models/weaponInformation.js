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

