var Client = IgeClass.extend({
  classId: 'Client',

  init: function () {
    //ige.showStats(1);
    ige.globalSmoothing(true);

    // Load our textures
    var self = this;
    this.obj = [];
    this.gameTexture = {};

    this.implement(ClientObjects);

    ige.on('texturesLoaded', function () {
      // Create the HTML canvas
      ige.createFrontBuffer(true);

      // Start the engine
      ige.start(function (success) {
        // Check if the engine started successfully
        if (success) {
          self.setupScene();
          self.setupEntities();
        }
      });
    });

    this.loadTextures();
  },
  loadTextures: function () {
    this.gameTexture.harvest = new IgeTexture('img/textures/harvest.png');
    this.gameTexture.water = new IgeTexture('img/textures/water.png');
    this.gameTexture.fertilize = new IgeTexture('img/textures/fertilize.png');
    this.gameTexture.attack = new IgeTexture('img/textures/marteau.png');
    this.gameTexture.sell = new IgeTexture('img/textures/sell.png');
    this.gameTexture.silo = new IgeTexture('img/textures/silo.png');
    this.gameTexture.barn = new IgeTexture('img/textures/barn.png');
    this.gameTexture.coldStorage = new IgeTexture('img/textures/coldStorage.png');
    this.gameTexture.aubergine0 = new IgeTexture('img/textures/aubergine0.png');
    this.gameTexture.aubergine1 = new IgeTexture('img/textures/aubergine1.png');
    this.gameTexture.aubergine2 = new IgeTexture('img/textures/aubergine2.png');
    this.gameTexture.aubergine3 = new IgeTexture('img/textures/aubergine3.png');
    this.gameTexture.aubergine4 = new IgeTexture('img/textures/aubergine4.png');
    this.gameTexture.carrot0 = new IgeTexture('img/textures/carrot0.png');
    this.gameTexture.carrot1 = new IgeTexture('img/textures/carrot1.png');
    this.gameTexture.carrot2 = new IgeTexture('img/textures/carrot2.png');
    this.gameTexture.carrot3 = new IgeTexture('img/textures/carrot3.png');
    this.gameTexture.carrot4 = new IgeTexture('img/textures/carrot4.png');
    this.gameTexture.corn0 = new IgeTexture('img/textures/corn0.png');
    this.gameTexture.corn1 = new IgeTexture('img/textures/corn1.png');
    this.gameTexture.corn2 = new IgeTexture('img/textures/corn2.png');
    this.gameTexture.corn3 = new IgeTexture('img/textures/corn3.png');
    this.gameTexture.corn4 = new IgeTexture('img/textures/corn4.png');
    this.gameTexture.tomato0 = new IgeTexture('img/textures/tomato0.png');
    this.gameTexture.tomato1 = new IgeTexture('img/textures/tomato1.png');
    this.gameTexture.tomato2 = new IgeTexture('img/textures/tomato2.png');
    this.gameTexture.tomato3 = new IgeTexture('img/textures/tomato3.png');
    this.gameTexture.tomato4 = new IgeTexture('img/textures/tomato4.png');
    this.gameTexture.pepper0 = new IgeTexture('img/textures/pepper0.png');
    this.gameTexture.pepper1 = new IgeTexture('img/textures/pepper1.png');
    this.gameTexture.pepper2 = new IgeTexture('img/textures/pepper2.png');
    this.gameTexture.pepper3 = new IgeTexture('img/textures/pepper3.png');
    this.gameTexture.pepper4 = new IgeTexture('img/textures/pepper4.png');
    this.gameTexture.grassSheet = new IgeCellSheet('img/textures/grassSheet.png', 4, 1);
    this.gameTexture.dirtSheet = new IgeCellSheet('img/textures/dirtSheet.png', 4, 1);
  },
  setupScene: function () {
    // Create the scene
    this.mainScene = new IgeScene2d()
      .id('mainScene')
      .drawBounds(false)
      .drawBoundsData(false);

    this.objectScene = new IgeScene2d()
      .id('objectScene')
      .depth(0)
      .drawBounds(false)
      .drawBoundsData(false)
      .mount(this.mainScene);

    this.uiScene = new IgeScene2d()
      .id('uiScene')
      .depth(1)
      .drawBounds(false)
      .drawBoundsData(false)
      .ignoreCamera(true) // We don't want the UI scene to be affected by the viewport's camera
      .mount(this.mainScene);

    // Create the main viewport
    this.vp1 = new IgeViewport()
      .addComponent(IgeMousePanComponent)
      .mousePan.limit(new IgeRect(-300, -100, 600, 400))
      .mousePan.enabled(true)
      .id('vp1')
      .autoSize(true)
      .scene(this.mainScene)
      .drawMouse(false)
      .drawBounds(false)
      .drawBoundsData(false)
      .mount(ige);

    // Create some listeners for when the viewport is being panned
    // so that we don't create a new path accidentally after a mouseUp
    // occurs if we were panning
    this.vp1.mousePan.on('panStart', function () {
      // Store the current cursor mode
      ige.client.data('tempCursorMode', ige.client.data('cursorMode'));

      // Switch the cursor mode
      ige.client.data('cursorMode', 'panning');
      ige.input.stopPropagation();
    });

    this.vp1.mousePan.on('panEnd', function () {
      // Switch the cursor mode back
      ige.client.data('cursorMode', ige.client.data('tempCursorMode'));
      ige.input.stopPropagation();
    });

    // Create an isometric tile map
    this.tileMap = new IgeTileMap2d()
      .id('tileMap')
      .isometricMounts(true)
      .tileWidth(20)
      .tileHeight(20)
      .drawMouse(true)
      .drawBounds(false)
      .drawBoundsData(false)
      .highlightOccupied(false) // Draws a red tile wherever a tile is "occupied"
      .mount(this.objectScene);

    // Create the texture maps
    this.textureMap = new IgeTextureMap()
      .depth(0)
      .tileWidth(20)
      .tileHeight(20)
      .translateTo(0, 0, 0)
      .drawBounds(false)
      .drawSectionBounds(false)
      .isometricMounts(true)
      .mount(this.mainScene);

    // Define a function that will be called when the
    // mouse cursor moves over one of our entities
    overFunc = function () {
      this.highlight(true);
      this.drawBounds(true);
      this.drawBoundsData(true);
    };

    // Define a function that will be called when the
    // mouse cursor moves away from one of our entities
    outFunc = function () {
      this.highlight(false);
      this.drawBounds(false);
      this.drawBoundsData(false);
    };

    // Create the 3d container that the player
    // entity will be mounted to
    this.player = new CharacterContainer()
      .id('player')
      .addComponent(PlayerComponent)
      .addComponent(IgePathComponent)
      .mouseOver(overFunc)
      .mouseOut(outFunc)
      .drawBounds(false)
      .drawBoundsData(false)
      .mount(this.tileMap);

    // Check if the tileMap is is iso mode
    if (this.tileMap.isometricMounts()) {
      // Set the player to move isometrically
      this.player.isometric(true);
    }

    // Create a UI entity so we can test if clicking the entity will stop
    // event propagation down to moving the player. If it's working correctly
    // the player won't move when the entity is clicked.
    /*
     this.topBar1 = new IgeUiEntity()
     .id('topBar1')
     .depth(1)
     .backgroundColor('#369D0A')
     .top(0)
     .left(0)
     .width('100%')
     .height(30)
     .borderTopColor('#666666')
     .borderTopWidth(1)
     .backgroundPosition(0, 0)
     .mouseDown(function () {
     ige.input.stopPropagation();
     })
     .mouseOver(function () {
     this.backgroundColor('#49ceff');
     ige.input.stopPropagation();
     })
     .mouseOut(function () {
     this.backgroundColor('#474747');
     ige.input.stopPropagation();
     })
     .mouseMove(function () {
     ige.input.stopPropagation();
     })
     .mouseUp(function () {
     console.log('Clicked ' + this.id());
     ige.input.stopPropagation();
     })
     .mount(this.uiScene);
     */
    // Set the camera to track the character with some
    // tracking smoothing turned on (100)
    this.vp1.camera.trackTranslate(this.player, 100);

    // Create a path finder and generate a path using
    // the collision map data
    this.pathFinder = new IgePathFinder()
      .neighbourLimit(100);


    // Register some event listeners for the path
    this.player.path.on('started', function () {
      console.log('Pathing started...');
    });
    this.player.path.on('stopped', function () {
      console.log('Pathing stopped.');
    });
    this.player.path.on('cleared', function () {
      console.log('Path data cleared.');
    });
    this.player.path.on('pointComplete', function () {
      console.log('Path point reached...');
    });
    this.player.path.on('pathComplete', function () {
      console.log('Path completed...');
    });
    this.player.path.on('traversalComplete', function () {
      this._entity.character.animation.stop();
      console.log('Traversal of all paths completed.');
    });

    // Some error events from the path finder
    this.pathFinder.on('noPathFound', function () {
      console.log('Could not find a path to the destination!');
    });
    this.pathFinder.on('exceededLimit', function () {
      console.log('Path finder exceeded allowed limit of nodes!');
    });
    this.pathFinder.on('pathFound', function () {
      console.log('Path to destination calculated...');
    });

    // Start traversing the path!
    this.player.path.start();

    this.grass = this.textureMap.addTexture(this.gameTexture.grassSheet);
    this.dirt = this.textureMap.addTexture(this.gameTexture.dirtSheet);

    this.buildingInfosId = undefined;
    this.buildingInfosPoint = undefined;

    $("#cropInfo").hide();

    this.refreshUserInformations();
  },
  updateMap: function () {
    // Occupy all the map
    for (var x = 0; x < mapSize; x++) {
      for (var y = 0; y < mapSize; y++) {
        this.tileMap.occupyTile(x, y, 1, 1, 1);
        var rand = Math.ceil(Math.random() * 4);
        this.textureMap.paintTile(x, y, this.grass, rand);
      }
    }

    // Unoccupy all the user tiles
    for (var i in tiles) {
      this.tileMap.unOccupyTile(tiles[i]['positionX'], tiles[i]['positionY'], 1, 1, 1);
    }

    for (var i in tiles) {
      tiles[i] = this.updateTile(tiles[i]);
    }
  },
  updateTile: function (tile) {

    // Remove previous UI elements
    if (tile.building != undefined) {
      tile.building.removeFromMap(this.tileMap);
    }
    if (tile.crop != undefined) {
      tile.crop.removeFromMap(this.tileMap);
    }

    var rand = Math.ceil(Math.random() * 4);
    // Texture
    this.textureMap.paintTile(tile['positionX'], tile['positionY'], this.dirt, rand);

    // Draw element if necessary
    tile.building = this.drawBuilding(tile);
    tile.crop = this.drawCrop(tile);

    return tile;
  },
  setupEntities: function () {
    var self = this;

    // Add the notification to update the map
    var socket = io.connect('http://127.0.0.1:4000');
    socket.on('update-tile-' + userId, function (tile) {
      tile = JSON.parse(tile);

      // Assign the current building and crop displayed, so we can remove them
      tile.building = tiles[tile.positionX + '-' + tile.positionY].building;
      tile.crop = tiles[tile.positionX + '-' + tile.positionY].crop;

      // Update the tile
      tiles[tile.positionX + '-' + tile.positionY] = self.updateTile(tile);

      if (self.selectedPoint != undefined) {
        self.displayTilesInformation(self.selectedPoint);
      }
    });

    // Update the user money
    socket.on('update-money-' + userId, function (response) {
      $('#money').html(response.money);
      $('#life').html(response.life);
    });

    // Update when opponent change image
    socket.on('update-weapon-' + userId, function (weapon) {
      $('#fight-opponent-weapon').attr('src', weapon.image);
    });

    // Fight notification
    socket.on('start-fight-' + userId, function (response) {
      self.opponentPlayer = response['opponent'];
      self.player = response['user'];
      self.weapons = response['weapons'];
      self.tileInFightId = response['tile'];

      // Render the select of weapons
      var html = '';
      self.currentWeapon = undefined;
      for (var i in self.weapons) {
        var weapon = self.weapons[i];
        html += '<option value="' + i + '">' + weapon.name + '</option>';
        if (self.currentWeapon == undefined) {
          self.currentWeapon = weapon;
        }
      }

      // See if user starts the fight
      if (response['startingUser'] == self.player.id) {
        self.canFight = true;
        $('#fight-button').removeClass("disabled");
      } else {
        self.canFight = false;
        $('#fight-button').addClass("disabled");
      }

      $('#fight-weapon-selector').html(html);
      $('#fight-opponent').html(self.opponentPlayer.email);
      $('#fight-user-life').attr('width', '100%');
      $('#fight-opponent-weapon').attr('src', '/img/fork.png');
      $('#fight-user-weapon').attr('src', self.currentWeapon.image);
      $('#fight-modal').modal();
    });

    // Hit on fight
    socket.on('user-hit-' + userId, function (attackedPlayer) {
      if (self.player != undefined && self.opponentPlayer != undefined) {
        if (attackedPlayer.id == self.player.id) {
          self.player.life = attackedPlayer.life;
          var percentage = Math.round(((1 / self.player.initialLife) * self.player.life) * 100);
          $('#fight-user-life').css('width', percentage + '%');
        }

        if (attackedPlayer.id == self.opponentPlayer.id) {
          self.opponentPlayer.life = attackedPlayer.life;
          var percentage = Math.round(((1 / self.opponentPlayer.initialLife) * self.opponentPlayer.life) * 100);
          $('#fight-opponent-life').css('width', percentage + '%');
        }

        // See if user starts the fight
        if (self.canFight == false) {
          self.canFight = true;
          $('#fight-button').removeClass("disabled");
        } else {
          self.canFight = false;
          $('#fight-button').addClass("disabled");
        }
      }
    });

    // End of fight
    socket.on('fight-end-' + userId, function (tile) {
      var tmpTile = tiles[tile['positionX'] + "-" + tile['positionY']];
      // Get the attacked player
      if (tile.userId == self.player.id) {
        // Win the tile
        tiles[tile['positionX'] + "-" + tile['positionY']] = tile;
        var x = tile['positionX'];
        var y = tile['positionY'];
        self.tileMap.unOccupyTile(x, y, 1, 1, 1);

        var rand = Math.ceil(Math.random() * 4);
        self.textureMap.paintTile(x, y, self.dirt, rand);

        tile.crop = self.drawCrop(tile);

      } else {
        // Lose the tile
        tiles[tile['positionX'] + "-" + tile['positionY']] = tile;
        var x = tile['positionX'];
        var y = tile['positionY'];
        self.tileMap.occupyTile(x, y, 1, 1, 1);

        if (tile.removeBuilding != undefined) {
          tmpTile.building.removeFromMap(self.tileMap);
        }
        if (tile.cropName != undefined) {
          tmpTile.crop.removeFromMap(self.tileMap);
        }

        var rand = Math.ceil(Math.random() * 4);
        self.textureMap.paintTile(x, y, self.grass, rand);
      }

      $('#fight-modal').modal('hide');
    });

    for (var i in tiles) {
      var firstTile = tiles[i];
      this.player.translateToTile(firstTile['positionX'], firstTile['positionY']);
      break;
    }

    if (userInfos != undefined) {
      if (userInfos.isAdmin == true)
        $('#configLink').html('<a href="/game_configurations">Configuration</a>');
    }

    // Update the original map
    this.updateMap();

    $("#addSiloLink").click(function () {
      self.enableAddSilo();
    });
    $("#addBarnLink").click(function () {
      self.enableAddBarn();
    });
    $("#addColdStorageLink").click(function () {
      self.enableAddColdStorage();
    });

    $("#addAubergineLink").click(function () {
      self.enableAddAubergine();
    });
    $("#addCarrotLink").click(function () {
      self.enableAddCarrot();
    });
    $("#addCornLink").click(function () {
      self.enableAddCorn();
    });
    $("#addTomatoLink").click(function () {
      self.enableAddTomato();
    });
    $("#addPepperLink").click(function () {
      self.enableAddPepper();
    });
    $("#enableAttackLink").click(function () {
      self.enableAttack();
    });
    $("#enableWateringLink").click(function () {
      self.enableWatering();
    });
    $("#enableFertilisingLink").click(function () {
      self.enableFertilising();
    });
    $("#enableHarvestingLink").click(function () {
      self.enableHarvesting();
    });
    $("#enableSellLink").click(function () {
      self.enableSell();
    });
    $(".sellInBuilding").click(function () {
      self.sellCropInBuilding($(this).attr('data-class'));
    });

    $("#fight-button").click(function () {
      self.hitOpponent();
      return false;
    });

    $('#fight-weapon-selector').change(function () {
      self.currentWeapon = self.weapons[$(this).attr('value')];
      $('#fight-user-weapon').attr('src', self.currentWeapon.image);
      // Update when opponent change image
      socket.emit('update-weapon-' + self.opponentPlayer.id, self.currentWeapon);
    });

    $('#enable-store-link').click(function () {
      // Load the weapons
      $.ajax({
        url: "/weaponInformations/store",
        type: "GET",
        data: {
          userId: userId
        },
        success: function (weapons) {
          // Update the store
          $('#store-weapon-list').html('');

          for (var i in weapons) {
            var weapon = weapons[i];
            var html = '<li class="store-weapon-container"><h5>' + weapon.name + '</h5><img class="store-weapon-image" src="' + weapon.image + '" /><p>Price : ' + weapon.price + '$</p>';
            if (weapon.owned == true) {
              html += '<a class="btn btn-primary disabled">Owned</a></ul>';
              $('#store-weapon-list').append(html);
            } else {
              html += '<a class="btn btn-primary" id="store-weapon-btn-' + weapon.id + '">Buy</a></li>';
              $('#store-weapon-list').append(html);

              $('#store-weapon-btn-' + weapon.id).click(function () {
                var weaponId = $(this).attr('id').replace('store-weapon-btn-', '');
                self.buyWeapon(weaponId);
              });
            }
          }

        },
        error: function (xhr, ajaxOptions, thrownError) {
          // If error, remove this building from the map, it didn't work
          alert("Error with store " + thrownError);
        }
      });

      $('#store-weapon-modal').modal();
    });

    this.enableMovingElement();
    this.mode = 'none';
  },
  buyWeapon: function (weaponId) {
    $.ajax({
      url: "/weaponInformations/buy",
      type: "POST",
      data: {
        userId: userId,
        weaponId: weaponId
      },
      success: function (newWeapon) {
        if (newWeapon.weaponInformationId != undefined) {
          $('#store-weapon-btn-' + newWeapon.weaponInformationId).addClass('disabled').unbind('click').html('owned');
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        // If error, remove this building from the map, it didn't work
        alert("Error with buying " + thrownError);
      }
    });
  },
  drawBuilding: function (tile) {
    var buildingName = tile['buildingName'];
    if (buildingName != undefined) {
      if (buildingName == "Silo") {
        return new this.Silo(this.tileMap, tile['positionX'], tile['positionY']);
      } else if (buildingName == "Barn") {
        return new this.Barn(this.tileMap, tile['positionX'], tile['positionY']);
      } else if (buildingName == "Cold storage") {
        return new this.ColdStorage(this.tileMap, tile['positionX'], tile['positionY']);
      }
    }
  },
  drawCrop: function (tile) {
    var cropName = tile['cropName'];
    if (cropName != undefined) {
      var sprout = 0;
      if (tile.cropMaturity >= 100) {
        sprout = 4;
      } else if (tile.cropMaturity >= 75) {
        sprout = 3;
      } else if (tile.cropMaturity >= 50) {
        sprout = 2;
      } else if (tile.cropMaturity >= 25) {
        sprout = 1;
      }
      if (cropName == "Aubergine") {
        return new this.Aubergine(this.tileMap, tile['positionX'], tile['positionY'], sprout);
      } else if (cropName == "Carrot") {
        return new this.Carrot(this.tileMap, tile['positionX'], tile['positionY'], sprout);
      } else if (cropName == "Corn") {
        return new this.Corn(this.tileMap, tile['positionX'], tile['positionY'], sprout);
      } else if (cropName == "Tomato") {
        return new this.Tomato(this.tileMap, tile['positionX'], tile['positionY'], sprout);
      } else if (cropName == "Pepper") {
        return new this.Pepper(this.tileMap, tile['positionX'], tile['positionY'], sprout);
      }
    }
  },
  enableMovingElement: function () {
    var self = this;
    this.tileMap.mouseMove(function () {
      if (self.movingElement != undefined) {
        self.movingElement.removeFromMap(self.tileMap);

        var point = self.tileMap.mouseToTile();
        if (self.tileMap.isTileOccupied(point.x, point.y, self.movingElement.widthInTile, self.movingElement.heightInTile, 1) == false) {
          switch (self.movingElement.classId()) {
            case "Barn":
              self.movingElement = new self.Barn(self.tileMap, point.x, point.y);
              break;
            case "Silo":
              self.movingElement = new self.Silo(self.tileMap, point.x, point.y);
              break;
            case "Cold storage":
              self.movingElement = new self.ColdStorage(self.tileMap, point.x, point.y);
              break;
            case "Carrot":
              self.movingElement = new self.Carrot(self.tileMap, point.x, point.y);
              break;
            case "Aubergine":
              self.movingElement = new self.Aubergine(self.tileMap, point.x, point.y);
              break;
            case "Corn":
              self.movingElement = new self.Corn(self.tileMap, point.x, point.y);
              break;
            case "Tomato":
              self.movingElement = new self.Tomato(self.tileMap, point.x, point.y);
              break;
            case "Pepper":
              self.movingElement = new self.Pepper(self.tileMap, point.x, point.y);
              break;
            case "Water":
              self.movingElement = new self.Water(self.tileMap, point.x, point.y);
              break;
            case "Fertilize":
              self.movingElement = new self.Fertilize(self.tileMap, point.x, point.y);
              break;
            case "Harvest":
              self.movingElement = new self.Harvest(self.tileMap, point.x, point.y);
              break;
            case "Sell":
              self.movingElement = new self.Sell(self.tileMap, point.x, point.y);
              break;
            case "Attack":
              self.movingElement = new self.Attack(self.tileMap, point.x, point.y);
              break;
          }
        }
      }
    });
    this.tileMap.mouseDown(function () {

      if (self.mode == 'attack' || self.mode == 'watering' || self.mode == 'fertilising' || self.mode == 'harvesting' || self.mode == 'harvestAndSell') {
        // Remove useless moving element
        if (self.movingElement != undefined) {
          self.movingElement.removeFromMap(self.tileMap);
          self.movingElement = undefined;
        }

        if (self.mode == 'harvesting') {
          var point = self.tileMap.mouseToTile();
          var tile = tiles[point.x + "-" + point.y];

          if (tile['cropName'] != undefined) {
            self.tileToHarvest = tile;
          } else if (self.tileToHarvest != undefined) {
            if (tile['buildingId'] != undefined) {
              self.harvestCrop(self.tileToHarvest, tile.buildingId);
              self.tileToHarvest = undefined;
              self.mode = 'none';
            }
          }

          // If harvesting, avoid all the next actions
          return;
        }
      }

      if (self.movingElement != undefined) {
        self.movingElement.removeFromMap(self.tileMap);
        var point = self.tileMap.mouseToTile();

        // Check if the point is on the map
        if (point.x >= 0 && point.x < mapSize && point.y >= 0 && point.y < mapSize) {
          if (self.tileMap.isTileOccupied(point.x, point.y, self.movingElement.widthInTile, self.movingElement.heightInTile, 1) == false) {
            var newBuilding = undefined;
            var newCrop = undefined;
            switch (self.movingElement.classId()) {
              case "Barn":
                newBuilding = new self.Barn(self.tileMap, point.x, point.y);
                break;
              case "Silo":
                newBuilding = new self.Silo(self.tileMap, point.x, point.y);
                break;
              case "Cold storage":
                newBuilding = new self.ColdStorage(self.tileMap, point.x, point.y);
                break;
              case "Carrot":
                newCrop = new self.Carrot(self.tileMap, point.x, point.y);
                break;
              case "Aubergine":
                newCrop = new self.Aubergine(self.tileMap, point.x, point.y);
                break;
              case "Corn":
                newCrop = new self.Corn(self.tileMap, point.x, point.y);
                break;
              case "Tomato":
                newCrop = new self.Tomato(self.tileMap, point.x, point.y);
                break;
              case "Pepper":
                newCrop = new self.Pepper(self.tileMap, point.x, point.y);
                break;
            }

            if (newBuilding != undefined) {
              // Save it
              self.saveNewBuilding(newBuilding, point);
              newBuilding.removeFromMap(self.tileMap);
            } else if (newCrop != undefined) {
              // Save it
              self.saveNewCrop(newCrop, point);
              newCrop.removeFromMap(self.tileMap);
            }
          }

          self.mode = 'none';
          self.movingElement = undefined;
        }
      } else if (self.mode != "none") {
        var point = self.tileMap.mouseToTile();
        switch (self.mode) {
          case "attack":
            self.attackTile(point);
            break;
          case "watering":
            self.wateringTile(point);
            break;
          case "fertilising":
            self.fertilizeTile(point);
            break;
          case "harvestAndSell":
            var tile = tiles[point.x + "-" + point.y];
            self.harvestCrop(tile);
            break;
        }
        self.mode = 'none';
      } else {
        console.log("Plus d'infos stp");
        var point = self.tileMap.mouseToTile();
        self.displayTilesInformation(point);
        console.log(point);
      }
    });
  },
  saveNewBuilding: function (newBuilding, tilePoint) {
    var tileId = tiles[tilePoint.x + '-' + tilePoint.y]['id'];
    var buildingInformationId = newBuilding.buildingInformationId;
    var self = this;

    // Send the new building to the controller with AJAX
    $.ajax({
      url: "/buildings/",
      type: "POST",
      data: {
        buildingInformationId: buildingInformationId,
        tileId: tileId,
        ajax: 1
      },
      success: function (data) {
        // If success, it's ok \o/
      },
      error: function (xhr, ajaxOptions, thrownError) {
        // If error, remove this building from the map, it didn't work
        newBuilding.removeFromMap(self.tileMap);
        alert("Error when creating your building");
      }
    });
  },
  enableAddSilo: function () {
    this.mode = 'building';
    this.movingElement = new this.Silo(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableAddBarn: function () {
    this.mode = 'building';
    this.movingElement = new this.Barn(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableAddColdStorage: function () {
    this.mode = 'building';
    this.movingElement = new this.ColdStorage(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  saveNewCrop: function (newCrop, tilePoint) {
    var tileId = tiles[tilePoint.x + '-' + tilePoint.y]['id'];
    var cropInformationId = newCrop.cropInformationId;
    var self = this;

    // Send the new building to the controller with AJAX
    $.ajax({
      url: "/crops/",
      type: "POST",
      data: {
        cropInformationId: cropInformationId,
        tileId: tileId,
        humidity: 90,
        fertility: 90,
        health: 90,
        ajax: 1
      },
      success: function (data) {
        // If success, it's ok \o/
      },
      error: function (xhr, ajaxOptions, thrownError) {
        // If error, remove this building from the map, it didn't work
        newCrop.removeFromMap(self.tileMap);
        alert("Error when creating your building");
      }
    });
  },
  enableAddAubergine: function () {
    this.mode = 'crop';
    this.movingElement = new this.Aubergine(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y, 4);
  },
  enableAddCarrot: function () {
    this.mode = 'crop';
    this.movingElement = new this.Carrot(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y, 4);
  },
  enableAddCorn: function () {
    this.mode = 'crop';
    this.movingElement = new this.Corn(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y, 4);
  },
  enableAddTomato: function () {
    this.mode = 'crop';
    this.movingElement = new this.Tomato(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y, 4);
  },
  enableAddPepper: function () {
    this.mode = 'crop';
    this.movingElement = new this.Pepper(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y, 4);
  },
  changeModeAction: function (param) {
    this.mode = param;
    if (this.movingElement != undefined) {
      this.movingElement.removeFromMap(this.tileMap);
    }
    this.tileToHarvest = undefined;
    this.movingElement = undefined;
  },
  enableAttack: function () {
    this.changeModeAction('attack');
    this.movingElement = new this.Attack(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableWatering: function () {
    this.changeModeAction('watering');
    this.movingElement = new this.Water(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableFertilising: function () {
    this.changeModeAction('fertilising');
    this.movingElement = new this.Fertilize(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableHarvesting: function () {
    this.changeModeAction('harvesting');
    this.movingElement = new this.Harvest(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  enableSell: function () {
    this.changeModeAction('harvestAndSell');
    this.movingElement = new this.Sell(this.tileMap, this.tileMap.mouseToTile().x, this.tileMap.mouseToTile().y);
  },
  sellCropInBuilding: function (cropName) {
    var self = this;
    console.log('selling ... '+self.buildingInfosId);
    if(self.buildingInfosId != undefined){
      $.ajax({
        url: "/building_storages/sellCrop",
        type: "POST",
        data: {
          buildingId: self.buildingInfosId,
          cropName: cropName,
          userId: userId
        },
        success: function (response) {
          console.log(response);
          self.displayTilesInformation(self.selectedPoint);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          // If error, remove this building from the map, it didn't work
          alert("Error when sell crop");
        }
      });
    }
  },
  attackTile: function (point) {
    // Check if on the map
    if (point.x >= 0 && point.x < mapSize && point.y >= 0 && point.y < mapSize) {

      var canAttack = false;
      // Check if we can attack the tile
      for (var i in tiles) {
        // If on of user tile return
        if (point.x == tiles[i]['positionX'] && point.y == tiles[i]['positionY']) {
          return;
        }

        if (((point.x == tiles[i]['positionX']) && (point.y == tiles[i]['positionY'] - 1 || point.y == tiles[i]['positionY'] + 1)) ||
          ((point.y == tiles[i]['positionY']) && (point.x == tiles[i]['positionX'] - 1 || point.x == tiles[i]['positionX'] + 1))) {
          canAttack = true;
        }
      }

      if (canAttack) {
        var self = this;

        // Send the new building to the controller with AJAX
        $.ajax({
          url: "/tiles/attack",
          type: "POST",
          data: {
            userId: userId,
            positionX: point.x,
            positionY: point.y
          },
          success: function (response) {

            // If don't need to fight return the tile
            if (response['positionX'] != undefined && response['positionY'] != undefined) {
              tiles[response['positionX'] + "-" + response['positionY']] = response;
              self.tileMap.unOccupyTile(point.x, point.y, 1, 1, 1);

              var rand = Math.ceil(Math.random() * 4);
              self.textureMap.paintTile(point.x, point.y, self.dirt, rand);
            } else {
              // A fight notification will be sent
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            // If error, remove this building from the map, it didn't work
            alert("Error when creating your building");
          }
        });
      }
    }
  },
  hitOpponent: function () {
    var self = this;
    if (self.canFight == true) {
      // Send the new building to the controller with AJAX
      $.ajax({
        url: "/users/hit",
        type: "POST",
        data: {
          id: self.player.id,
          opponentId: self.opponentPlayer.id,
          damages: self.currentWeapon.power,
          tileId: self.tileInFightId
        },
        success: function (response) {
        },
        error: function (xhr, ajaxOptions, thrownError) {
          // If error, remove this building from the map, it didn't work
          alert("Error when hit");
        }
      });
    }

  },
  wateringTile: function (point) {
    var canDoAction = false;
    var idTile = "";
    for (var i in tiles) {
      // If on of user tile return
      if (point.x == tiles[i]['positionX'] && point.y == tiles[i]['positionY']) {
        canDoAction = true;
        idTile = tiles[i]['id'];
      }
    }

    if (canDoAction) {
      var self = this;

      // Send the new building to the controller with AJAX
      $.ajax({
        url: "/tiles/watering",
        type: "POST",
        data: {
          id: idTile
        },
        success: function (response) {
          console.log('SUCCESS');

          // If success, it's ok \o/

        },
        error: function (xhr, ajaxOptions, thrownError) {
          // If error, remove this building from the map, it didn't work
          alert("Error when watering tile");
        }
      });
    }

  },
  fertilizeTile: function (point) {
    var canDoAction = false;
    var idTile = "";
    for (var i in tiles) {
      // If on of user tile return
      if (point.x == tiles[i]['positionX'] && point.y == tiles[i]['positionY']) {
        canDoAction = true;
        idTile = tiles[i]['id'];
      }
    }

    if (canDoAction) {
      var self = this;

      // Send the new building to the controller with AJAX
      $.ajax({
        url: "/tiles/fertilizing",
        type: "POST",
        data: {
          id: idTile
        },
        success: function (response) {
          console.log('SUCCESS');

          // If success, it's ok \o/

        },
        error: function (xhr, ajaxOptions, thrownError) {
          // If error, remove this building from the map, it didn't work
          alert("Error when watering tile");
        }
      });
    }
  },
  harvestCrop: function (tile, buildingId) {
    var self = this;
    console.log('HARVEST CROP');
    if (tile != null) {
      console.log('MATURITY : ' + tile["cropMaturity"]);
      if (tile["cropMaturity"] >= 80) {
        $.ajax({
          url: "/crops/harvest",
          type: "POST",
          data: {
            id: tile["id"],
            userId: userId,
            buildingId: buildingId
          },
          success: function (response) {
          },
          error: function (xhr, ajaxOptions, thrownError) {
            // If error, remove this building from the map, it didn't work
            alert("Error when harvesting crop");
          }
        });
      }
    }
  },
  refreshUserInformations: function () {
    $.ajax({
      url: "/users/" + userId + ".json",
      type: "GET",
      success: function (response) {
        $("#money").html(response.user.money);
        $("#life").html(response.user.life);
        $("#level").html(response.user.level);
      }
    });
  },
  displayTilesInformation: function (point) {
    var self = this;

    if ($("#storage").css('display') != 'block')
      $("#storage").hide();
    if ($("#cropInfo").css('display') != 'block')
      $("#cropInfo").hide();

    this.selectedPoint = point;
    var tile = tiles[point.x + "-" + point.y];
    if (tile != undefined) {
      if (tile.cropName != undefined) {
        $("#storage").hide();
        $(".cropInfo").html(tile.cropName + " | Maturity: " + tile.cropMaturity + " | Health : " + tile.cropHealth);
        if ($("#cropInfo").css('display') != 'block')
          $("#cropInfo").fadeIn();
      } else if (tile.buildingId != undefined) {
        $("#cropInfo").hide();
        $("#storage-name").html(tile.buildingName);

        self.buildingInfosId = tile.buildingId;
        self.buildingInfosPoint = point;

        switch (tile.buildingName) {
          case "Silo":
            $("#storage-image").attr("src", "img/textures/silo.png");
            break;
          case "Barn":
            $("#storage-image").attr("src", "img/textures/barn.png");
            break;
          case "Cold storage":
            $("#storage-image").attr("src", "img/textures/coldStorage.png");
            break;
        }
        if ($("#storage").css('display') != 'block')
          $("#storage").fadeIn();

        $.ajax({
          url: "/building_storages/cropsCount",
          type: "POST",
          data: {
            buildingId: tile.buildingId
          },
          success: function (response) {
            $("#storage-aubergine").html(response.aubergine);
            $("#storage-corn").html(response.corn);
            $("#storage-carrot").html(response.carrot);
            $("#storage-pepper").html(response.pepper);
            $("#storage-tomato").html(response.tomato);
          }
        });

      } else {
        $("#cropInfo").hide();
        $("#storage").hide();
        $("#selectedObjectInformation").html("Dirt");
      }
    } else {
      $("#selectedObjectInformation").html("No data");
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
  module.exports = Client;
}