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

