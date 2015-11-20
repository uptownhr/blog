
var express = require('express');
var http = require('http');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var config = require('./config/config');
var secret = require('./config/secret');


var mongoose = require('mongoose');
var configDb = require('./config/database')(mongoose);

var app = express();
var router = express.Router();
var port = process.env.PORT || 2000;


// Config express

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'src')));
app.set('view engine', 'jade');

app.use(session({secret: secret.sessionSecret}));

app.listen(port);
console.log('Express server listening on port '+ port);


//Development

//change for deploy
var env = process.env.NODE_ENV || 'development'; 
if(env == 'development'){
  app.use(morgan('dev'));
  app.locals.pretty = true;
}

//Routes

// route middleware that will happen on every request
app.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});

app.brand = config.brand;
app.title = config.title;
app.author = config.author;

require('./routes/routes.js')(app);