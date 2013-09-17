var GameConfigurations = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    if (this.session.get('user') == undefined) {
      this.redirect('/');
    }
    geddy.model.GameConfiguration.first(function (err, gameConfiguration) {
      self.respond({params: params, gameConfiguration: gameConfiguration});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , gameConfiguration = geddy.model.GameConfiguration.create(params);

    gameConfiguration.save(function (err, data) {
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

    geddy.model.GameConfiguration.first(params.id, function (err, gameConfiguration) {
      self.respond({params: params, gameConfiguration: gameConfiguration.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.GameConfiguration.first(params.id, function (err, gameConfiguration) {
      self.respond({params: params, gameConfiguration: gameConfiguration});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.GameConfiguration.first(params.id, function (err, gameConfiguration) {
      gameConfiguration.updateProperties(params);

      gameConfiguration.save(function (err, data) {
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

    geddy.model.GameConfiguration.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.GameConfigurations = GameConfigurations;
