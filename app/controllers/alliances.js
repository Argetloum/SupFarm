var Alliances = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];


  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Alliance.all(function(err, alliances) {
      self.respond({params: params, alliances: alliances});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , alliance = geddy.model.Alliance.create(params);

    alliance.save(function(err, data) {
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

    geddy.model.Alliance.first(params.id, function(err, alliance) {
      self.respond({params: params, alliance: alliance.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Alliance.first(params.id, function(err, alliance) {
      self.respond({params: params, alliance: alliance});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Alliance.first(params.id, function(err, alliance) {
      alliance.updateProperties(params);

      alliance.save(function(err, data) {
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

    geddy.model.Alliance.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Alliances = Alliances;
