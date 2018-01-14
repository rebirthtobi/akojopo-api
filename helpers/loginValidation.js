var createDOMPurify = require('dompurify');
var { JSDOM } = require('jsdom');
var validator = require('validator');

var window = (new JSDOM('')).window;
var DOMPurify = createDOMPurify(window);

var purify = function(email, password) {
    return {
        email: DOMPurify.sanitize(email.trim()),
        password: DOMPurify.sanitize(password.trim())
    };
};

var validate = function(email, password) {
    var purified = purify(email, password);
    
    return {
        email: validator.isEmail(purified.email),
        password: !validator.isEmpty(purified.password)
    };
};

module.exports = {
    validate: validate,
    purify: purify
};