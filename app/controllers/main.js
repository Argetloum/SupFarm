/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


var Main = function () {

  // Before seed the database if needed
  geddy.model.GameConfiguration.seedDatabase();

  setTimeout(function () {
    geddy.model.WeaponInformation.seedDatabase();
    geddy.model.Tile.seedDatabase();
    geddy.model.User.seedDatabase();
    geddy.model.CropInformation.seedDatabase();
    geddy.model.BuildingInformation.seedDatabase();
  }, 1000);

  // Then redirect
  this.index = function (req, resp, params) {
    var self = this;

    var user = undefined;

    console.log("-------  Valeur de la session : " + self.session.get('authenticated'));
    if (self.session.get('authenticated')) {
      self.redirect('/maps');
      user = self.session.get('user');
    }
    this.respond(params, {
      format: 'html', template: 'app/views/main/index', userInfos: user
    });
  };

  this.login = function (req, resp, params) {
    var self = this;

    geddy.model.User.first({ "email": params.login }, function (err, user) {
      console.log(user);
      if (err || user == undefined || user.password !== params.password) {
        self.redirect('/');
      } else {
        self.session.set('authenticated', true);
        self.session.set('user', user);
        self.redirect('/maps');
      }
    });

  }

  this.logout = function (req, resp, params) {
    var self = this;
    self.session.set('authenticated', false);
    self.session.unset('user');
    self.redirect('/');
  }

};

exports.Main = Main;


