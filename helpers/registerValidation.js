var createDOMPurify = require('dompurify');
var { JSDOM } = require('jsdom');
var validator = require('validator');

var window = (new JSDOM('')).window;
var DOMPurify = createDOMPurify(window);

var purify = function(name, password, email, city, country) {
    return {
        name: DOMPurify.sanitize(name.trim()),        
        email: DOMPurify.sanitize(email.trim()),
        password: DOMPurify.sanitize(password.trim()),
        city: DOMPurify.sanitize(city.trim()),
        country: DOMPurify.sanitize(country.trim())
    };
};

var validate = function(name, password, email, city, country) {
    var purified = purify(name, password, email, city, country);
    
    return {
        name: !validator.isEmpty(purified.name),
        email: validator.isEmail(purified.email),
        password: !validator.isEmpty(purified.password),
        city: !validator.isEmpty(purified.city),
        country: !validator.isEmpty(purified.country)    
    };
};

module.exports = {
    validate: validate,
    purify: purify
};