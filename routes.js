var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var user = require('./controllers/userController');
var auth = require('./controllers/authController');
var config = require('./config');

var urlencodedParser = bodyParser.json();

module.exports = function(app, apiRoutes, authRoutes) {
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
    });
    
    apiRoutes.post('/login', urlencodedParser, auth.login);
    apiRoutes.post('/renew', urlencodedParser, auth.renew);
    apiRoutes.put('/register', urlencodedParser, auth.registration);

    authRoutes.use(function(req, res, next){
        var token = req.headers['x-access-token'] ? req.headers['x-access-token'] : null;
        if (token) {
            jwt.verify(token, config.AUTH_SECRET_KEY, function(err, decoded) {      
                if (err) {
                    return res.status(403).send({
                        'error': 'Authentication Failed or Token Expired'
                    });   
                } else {
                    req.decoded = decoded;    
                    next();
                }
            });
        
        } else {
            return res.status(403).send({ 
                'error': 'Authentication Failed' 
            });
        }
    });

    authRoutes.get('/user', user.index);
    authRoutes.get('/user/find', user.find);
    authRoutes.patch('/user/update', urlencodedParser, user.update);
    authRoutes.patch('/user/password/change', urlencodedParser, user.changePassword);
    authRoutes.post('/user/remove', urlencodedParser, user.remove);
    authRoutes.get('/user/view/:id', user.view);  

    app.use('/api/v1/auth', authRoutes);

    apiRoutes.get('/', function(req, res) {
        res.status(404).send({ 'error': 'You took the wrong step' });
    });
    apiRoutes.post('/', function(req, res) {
        res.status(404).send({ 'error': 'You took the wrong step' });
    });

    app.use('/api/v1', apiRoutes);
};