var BuildingInformation = function () {

  this.defineProperties({
    name: {type: 'string'},
    image: {type: 'string'},
    width: {type: 'int'},
    height: {type: 'int'},
    power: {type: 'int'},
    cost: {type: 'number'},
    storageQuantity: {type: 'int'},
    storageTime: {type: 'int'},
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
BuildingInformation.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
BuildingInformation.someStaticMethod = function () {
  // Do some other stuff
};
BuildingInformation.someStaticProperty = 'YYZ';
*/

// Seed the database
BuildingInformation.seedDatabase = function(){
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.BuildingInformation.all(function(err, buildingInformations) {
    if(buildingInformations.length == 0){
      // Create the default crops informationss
      var silo        = geddy.model.BuildingInformation.create({ name: "Silo", image: "/img/building/silo.png", width: 1, height: 1, power: 60, cost: 80, storageQuantity: 1, storageTime: 20});
      var barn        = geddy.model.BuildingInformation.create({ name: "Barn", image: "/img/building/barn.png", width: 2, height: 2, power: 180, cost: 240, storageQuantity: 2, storageTime: 60});
      var coldStorage = geddy.model.BuildingInformation.create({ name: "Cold storage", image: "/img/building/coldStorage.png", width: 3, height: 2, power: 600, cost: 1000, storageQuantity: 6, storageTime: 0});
      
      // And save all
      silo.save();
      barn.save();
      coldStorage.save();
    }
  });  
};

BuildingInformation = geddy.model.register('BuildingInformation', BuildingInformation);

