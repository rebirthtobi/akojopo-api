var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');
var user = require('./../models/user');
var loginValidation = require('./../helpers/loginValidation');
var registerValidation = require('./../helpers/registerValidation');
var config = require('./../config');


var login = function(req, res) {
    var validated = loginValidation.validate(req.body.email, req.body.password);

    if (validation.email && validation.password) { 
        var purified = loginValidation.purify(req.body.email, req.body.password);

        user.findOne({
            "email": purified.email
        }).exec(function(err, data) {
            if (err) {
                res.status(500).send({ 'error': err.message });
            } else {
                if (data) {                
                    var bytes = cryptojs.AES.decrypt(purified.password.toString(), config.ENCRYPTION_KEY);
                    var password = bytes.toString(cryptojs.enc.Utf8);
                    var salt = bcrypt.genSaltSync(12);
                    if (bcrypt.compareSync(password, data.password)) {
                        var payload = {
                            loggedIn: true,
                            user: data.email,
                            role: 'user'
                        };                                        
                        var token = jwt.sign(payload, config.AUTH_SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.status(200).send({
                            'success': 'Login successful',
                            'name': data.name,
                            'token': token
                        });
                    } else {
                        res.status(401).send({
                            'error': 'Username or Password Failed'
                        });
                    }
                } else {
                    res.status(401).send({
                        'error': 'Username or Password Failed'
                    });
                }
            }
        });
    } else {
        var emailMsg = validate.email ? '' : 'Username is required and must be a valid email address, ';
        var passwordMsg = validate.password ? '' : 'Password is required';

        res.status(202).send({
            'error': [
                emailMsg,
                passwordMsg
            ]
        });
    }
};

var renew = function(req, res) {
    let payload = req.body.payload;

    if (payload) {

        if (payload.role !== 'user') {
            res.status(500).send({ 'error': 'Hacker' });
        }
        
        user.findOne({
            "email": payload.user
        }).exec(function(err, data) {
            if (err) {
                res.status(500).send({ 'error': 'Hacker' });
            } else {
                var payload = {
                    loggedIn: true,
                    user: data.email,
                    role: 'user'
                };
                var token = jwt.sign(payload, config.AUTH_SECRET_KEY, {
                    expiresIn: 1440
                });
                res.status(201).send({
                        'success': 'Login successful',
                        'name': data.name,
                        'token': token
                    });
            }
        });
    } else {
        res.status(500).send({ 'error': 'Hacker' });
    }
};

var registration = function(req, res) { 
    var validated = registerValidation.validate(req.body.name, req.body.password, req.body.email, req.body.city, req.body.country);

    if (validation.name && validation.email && validation.password && validation.confirmpassword && validation.city && validation.country) {
        var purified = registerValidation.purify(req.body.name, req.body.password, req.body.email, req.body.city, req.body.country);

        user.findOne({
            "email": purified.email
        }).exec(function(err, data) {
            if (err) {
                res.status(500).send({ 'error': err.message });
            } else {
                if (data) {
                    res.status(202).send({ 'error': 'Email already in use' });
                } else {
                    var bytes = cryptojs.AES.decrypt(purified.password.toString(), config.ENCRYPTION_KEY);
                    var password = bytes.toString(cryptojs.enc.Utf8);
                    var salt = bcrypt.genSaltSync(12);
                    var userData = {
                        "name": purified.name,
                        "email": purified.email,
                        "password": bcrypt.hashSync(password, salt),
                        "location" : {
                            "country": purified.country,
                            "city": purified.city
                        }
                    };

                    user(userData).save(function(err, data) {
                        if (err) {
                            res.status(500).send({ 'error': err.message });
                        } else {
                            var payload = {
                                loggedIn: true,
                                user: data.email,
                                role: 'user'
                            };
                            var token = jwt.sign(payload, config.AUTH_SECRET_KEY, {
                                expiresIn: 1440
                            });
                            res.status(201).send({
                                    'success': 'User registration successful',
                                    'name': data.name,
                                    'token': token,
                                });
                        }
                    });
                }
            }
        });
    } else {
        var nameMsg = validate.name ? '' : 'Name is required, ';
        var emailMsg = validate.email ? '' : 'Email is required and must be a valid email address, ';
        var passwordMsg = validate.password ? '' : 'Password is required, ';
        var cityMsg = validate.city ? '' : 'City is required, ';
        var countryMsg = validate.country ? '' : 'Country is required';

        res.status(202).send({
            'error': [
                nameMsg,
                emailMsg,
                passwordMsg,
                cityMsg,
                countryMsg
            ]
        });
    }
};


module.exports = {
    login: login,
    registration: registration,
    renew: renew
};