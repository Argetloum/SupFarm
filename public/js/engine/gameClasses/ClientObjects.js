var ClientObjects = {
  Silo: IgeEntity.extend({
    classId: 'Silo',
    buildingInformationId: buildingInformations["Silo"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX), (tileY), 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.silo;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  /*
   * Buildings
   */
  Barn: IgeEntity.extend({
    classId: 'Barn',
    buildingInformationId: buildingInformations["Barn"],
    widthInTile: 2,
    heightInTile: 2,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.barn;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  ColdStorage: IgeEntity.extend({
    classId: 'Cold storage',
    buildingInformationId: buildingInformations["Cold storage"],
    widthInTile: 2,
    heightInTile: 3,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 0.8, (tileY) + 1.2, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.coldStorage;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(1.3, 1.3, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  /*
   * Crops
   */
  Aubergine: IgeEntity.extend({
    classId: 'Aubergine',
    cropInformationId: cropInformations["Aubergine"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY, sprout) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(1 * parent._tileWidth, 1 * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture;
      switch (sprout) {
        case 0:
          texture = ige.client.gameTexture.aubergine0;
          break;
        case 1:
          texture = ige.client.gameTexture.aubergine1;
          break;
        case 2:
          texture = ige.client.gameTexture.aubergine2;
          break;
        case 3:
          texture = ige.client.gameTexture.aubergine3;
          break;
        default :
          texture = ige.client.gameTexture.aubergine4;
          break;
      }

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Carrot: IgeEntity.extend({
    classId: 'Carrot',
    cropInformationId: cropInformations["Carrot"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY, sprout) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(1 * parent._tileWidth, 1 * parent._tileHeight, 40)
        .translateToTile((tileX) + 0.8, (tileY) + 0.8, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture;
      switch (sprout) {
        case 0:
          texture = ige.client.gameTexture.carrot0;
          break;
        case 1:
          texture = ige.client.gameTexture.carrot1;
          break;
        case 2:
          texture = ige.client.gameTexture.carrot2;
          break;
        case 3:
          texture = ige.client.gameTexture.carrot3;
          break;
        default :
          texture = ige.client.gameTexture.carrot4;
          break;
      }

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Corn: IgeEntity.extend({
    classId: 'Corn',
    cropInformationId: cropInformations["Corn"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY, sprout) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(1 * parent._tileWidth, 1 * parent._tileHeight, 40)
        .translateToTile((tileX) - 0.6, (tileY) - 0.4, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture;
      switch (sprout) {
        case 0:
          texture = ige.client.gameTexture.corn0;
          break;
        case 1:
          texture = ige.client.gameTexture.corn1;
          break;
        case 2:
          texture = ige.client.gameTexture.corn2;
          break;
        case 3:
          texture = ige.client.gameTexture.corn3;
          break;
        default :
          texture = ige.client.gameTexture.corn4;
          break;
      }

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Tomato: IgeEntity.extend({
    classId: 'Tomato',
    cropInformationId: cropInformations["Tomato"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY, sprout) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(1 * parent._tileWidth, 1 * parent._tileHeight, 40)
        .translateToTile((tileX) + 0.6, (tileY) + 0.6, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture;
      switch (sprout) {
        case 0:
          texture = ige.client.gameTexture.tomato0;
          break;
        case 1:
          texture = ige.client.gameTexture.tomato1;
          break;
        case 2:
          texture = ige.client.gameTexture.tomato2;
          break;
        case 3:
          texture = ige.client.gameTexture.tomato3;
          break;
        default :
          texture = ige.client.gameTexture.tomato4;
          break;
      }

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Pepper: IgeEntity.extend({
    classId: 'Pepper',
    cropInformationId: cropInformations["Pepper"],
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY, sprout) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(1 * parent._tileWidth, 1 * parent._tileHeight, 40)
        .translateToTile((tileX) + 0.5, (tileY) + 0.5, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture;
      switch (sprout) {
        case 0:
          texture = ige.client.gameTexture.pepper0;
          break;
        case 1:
          texture = ige.client.gameTexture.pepper1;
          break;
        case 2:
          texture = ige.client.gameTexture.pepper2;
          break;
        case 3:
          texture = ige.client.gameTexture.pepper3;
          break;
        default :
          texture = ige.client.gameTexture.pepper4;
          break;
      }

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.7, 0.7, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  /*
  Tools
   */
  Water: IgeEntity.extend({
    classId: 'Water',
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.water;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Fertilize: IgeEntity.extend({
    classId: 'Fertilize',
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.fertilize;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Sell: IgeEntity.extend({
    classId: 'Sell',
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.sell;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Harvest: IgeEntity.extend({
    classId: 'Harvest',
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.harvest;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  }),
  Attack: IgeEntity.extend({
    classId: 'Attack',
    widthInTile: 1,
    heightInTile: 1,

    init: function (parent, tileX, tileY) {
      this._super();
      var self = this;

      // Setup the 3d bounds container (this)
      this.isometric(true)
        .mount(parent)
        .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
        .translateToTile((tileX) + 1, (tileY) + 1, 0)
        .mouseOver(function () {
          this.drawBounds(true);
          this.drawBoundsData(true);
        })
        .mouseOut(function () {
          this.drawBounds(false);
          this.drawBoundsData(false);
        })
        .drawBounds(false)
        .drawBoundsData(false);

      this.tileX = tileX;
      this.tileY = tileY;
      parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);

      // Create the "image" entity
      var texture = ige.client.gameTexture.attack;

      this.imageEntity = new IgeEntity()
        .texture(texture)
        .dimensionsFromCell()
        .scaleTo(0.8, 0.8, 1)
        .drawBounds(false)
        .drawBoundsData(false)
        .mount(this);
    },
    removeFromMap: function (parent) {
      this.unMount();
      parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
    }
  })
};
