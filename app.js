var express = require('express');
var jwt = require('jsonwebtoken');
var route = require('./routes');


var app = express();
var port = process.env.PORT || 8500;
var authRoutes = express.Router();
var apiRoutes = express.Router();

app.listen(port);

route(app, authRoutes, apiRoutes);

//TODO: how to make a request for token after expiration
//TODO: check how to make only a particular domain to access the api url
//TODO: finish remember login