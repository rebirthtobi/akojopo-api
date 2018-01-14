var user = require('./../models/user');
var config = require('./../config');
var bcrypt = require('bcrypt');
var CryptoJs = require('crypto-js');

var index = function(req, res) {
    user.find({}).exec(function(err, data) {
        if (err) {
            res.status(500).send({ 'error': err.message });
        } else {
            res.status(200).send({
                'success': 'successfull',
                'users': data
            });
        }
    });
};

var update = function(req, res) {
	var userData = {
        "name": req.body.name,
        "email": req.body.email,
        "location" : {
            "country": req.body.country,
            "city": req.body.city
        }
    };
    user.findByIdAndUpdate(req.body.identifier, userData).exec(function(err, data) {
        if (err) {
            res.status(500).send({ 'error': err.message });
        } else {
            res.status(200).send({ 'success': 'User updated successfully' });
        }
    });
};

var remove = function(req, res) {
    user.findByIdAndRemove(req.body.id).exec(function(err, data) {
        if (err) {
            res.status(500).send({ 'error': err.message });
        } else {
            res.status(200).send({
                'success': 'user record deleted successfully'
            });
        }
    });
};

var view = function(req, res) {
    if (req.params.id) {
        user.findById(req.params.id).exec(function(err, data) {
            if (err) {
                res.status(500).send({ 'error': err.message });
            } else {
                if (data) {
                    res.status(200).send({
                        'success': 'user found',
                        'user': data
                    });
                } else {
                    res.status(404).send({ 'error': 'no user with found' });
                }
            }
        });
    } else {
        res.status(500).send({ 'error': 'Identification required as parameter' });
    }
};

var find = function(req, res) {
    var tofind = {};
    if (req.query.id) {
        tofind.id = req.query.id;
    }
    if (req.query.name) {
        tofind.name = new RegExp(["^", req.query.name, "$"].join(""), "i");
    }
    if (req.query.email) {
        tofind.email = new RegExp(["^", req.query.email, "$"].join(""), "i");
    }
    if (req.query.country) {
        tofind.location.country = new RegExp(["^", req.query.country, "$"].join(""), "i");
    }
    if (req.query.city) {
        tofind.location.city = new Date(req.query.city);
    }
    user.find(tofind).exec(function(err, data) {
        if (err) {
            res.status(500).send({ 'error': err.message });
        } else {
            if (data) {
                res.status(200).send({
                    'success': 'user found',
                    'users': data
                });
            } else {
                res.status(404).send({ 'error': 'no user data with found' });
            }
        }
    });
};

var changePassword = function(req, res) {
    user.findById(req.body.identifier).exec(function(err, data) {
        if (err) {
            res.status(500).send({ 'error': err.message });
        } else {
            if(data){
                if(bcrypt.compareSync(req.body.oldPassword, data.password)){                    
                    var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), config.ENCRYPTION_KEY);
                    var password = bytes.toString(CryptoJS.enc.Utf8);
                    var salt = bcrypt.genSaltSync(12);
                    data.update({
                        password: bcrypt.hashSync(password, salt)
                    }).then(function(err, data){
                        if (err) {
                            res.status(500).send({ 'error': 'Password Change Failed'});
                        } else {
                            res.status(200).send({ 'success': 'Password Changes successfully'});
                        }
                    });
                }
            } else {
                res.status(500).send({ 'error': 'Incorrect Operation'});
            }
        }
    });
};

module.exports = {
    index: index,
    update: update,
    remove: remove,
    view: view,
    find: find,
    changePassword: changePassword
};