var CropInformations = function () {
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        var self = this;

        geddy.model.CropInformation.all(function (err, cropInformations) {
            self.respond({params: params, cropInformations: cropInformations});
        });
    };

    this.add = function (req, resp, params) {
        this.respond({params: params});
    };

    this.create = function (req, resp, params) {
        params.id = params.id || geddy.string.uuid(10);

        var self = this
            , cropInformation = geddy.model.CropInformation.create(params);

        cropInformation.save(function (err, data) {
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

        geddy.model.CropInformation.first(params.id, function (err, cropInformation) {
            self.respond({params: params, cropInformation: cropInformation.toObj()});
        });
    };

    this.edit = function (req, resp, params) {
        var self = this;

        geddy.model.CropInformation.first(params.id, function (err, cropInformation) {
            self.respond({params: params, cropInformation: cropInformation});
        });
    };

    this.update = function (req, resp, params) {
        var self = this;

        geddy.model.CropInformation.first(params.id, function (err, cropInformation) {
            cropInformation.updateProperties(params);

            cropInformation.save(function (err, data) {
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

        geddy.model.CropInformation.remove(params.id, function (err) {
            if (err) {
                params.errors = err;
                self.transfer('edit');
            } else {
                self.redirect({controller: self.name});
            }
        });
    };

};

exports.CropInformations = CropInformations;
