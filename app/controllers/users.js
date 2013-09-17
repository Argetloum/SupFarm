var Users = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function (err, users) {
      self.respond({params: params, users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this;

    params.id = params.id || geddy.string.uuid(10);

    geddy.model.User.addUserToCreate({ email: params.email, password: params.password, difficulty: params.difficulty}, function (user) {
      self.session.set('authenticated', true);
      self.session.set('user', user);
      self.redirect('/');
    });

  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function (err, user) {
      self.respond({params: params, user: user.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function (err, user) {
      self.respond({params: params, user: user});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function (err, user) {
      user.updateProperties(params);

      user.save(function (err, data) {
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

    geddy.model.User.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.hit = function (req, resp, params) {
    var self = this;
    geddy.model.User.first(params.id, function (err, user) {
      user.hitUser(params.opponentId, params.damages, params.tileId, function () {
        self.respond({}, {format: 'json'});
      });
    });
  }
};

exports.Users = Users;
