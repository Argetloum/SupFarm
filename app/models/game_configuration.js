var GameConfiguration = function () {

  this.defineProperties({
    startMoney: {type: 'int', default: 10000},
    size: {type: 'int', default: 15},
    territorySize: {type: 'int', default: 5}
  });

};

// Seed the database
GameConfiguration.seedDatabase = function(){
  // Create the game configuration with default values
  // Only if doesn't exists
  geddy.model.GameConfiguration.all(function(err, gameConfigurations) {
    if(gameConfigurations.length == 0){
      var gameConfiguration  = geddy.model.GameConfiguration.create({size: 15, territorySize: 5, startMoney:2000});
      gameConfiguration.save(function(err, data){
        if(err){
          console.log("error when creating game : "+err);
        }
      }) 
    }
  });  
};

GameConfiguration = geddy.model.register('GameConfiguration', GameConfiguration);

