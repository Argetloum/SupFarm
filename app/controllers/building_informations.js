var BuildingInformations = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingInformation.all(function(err, buildingInformations) {
      self.respond({params: params, buildingInformations: buildingInformations});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , buildingInformation = geddy.model.BuildingInformation.create(params);

    buildingInformation.save(function(err, data) {
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

    geddy.model.BuildingInformation.first(params.id, function(err, buildingInformation) {
      self.respond({params: params, buildingInformation: buildingInformation.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingInformation.first(params.id, function(err, buildingInformation) {
      self.respond({params: params, buildingInformation: buildingInformation});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.BuildingInformation.first(params.id, function(err, buildingInformation) {
      buildingInformation.updateProperties(params);

      buildingInformation.save(function(err, data) {
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

    geddy.model.BuildingInformation.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.BuildingInformations = BuildingInformations;
