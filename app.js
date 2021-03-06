
var express = require('express');
var http = require('http');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var config = require('./config/config');
var secret = require('./config/secret');


var mongoose = require('mongoose');
var configDb = require('./config/database')(mongoose);

var app = express();
var port = process.env.PORT || 2000;

var moment = require('moment');

// Config express

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

app.use(session({secret: secret.sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



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

var Stories = require('./models/Story');

// route middleware to add config variables to our response locals
app.use(function(req, res, next) {
	res.locals.brand = config.brand;
	res.locals.title = config.title;
	res.locals.author = config.author;
	res.locals.user = req.user;
	res.locals.moment = moment;

	//Add the stories to our locals for the navigation   
	Stories.find().sort({updatedAt: -1}).exec(function(err, stories){
		if(err){
			console.log('Error adding stories to locals');
			next();
		}
		else if(stories.length>0){
			//passing back the stories and the first story transformed into html from markdown
			res.locals.stories = stories;
    		next(); 
		}
		else{
    		next(); 
		}
	});

    // continue doing what we were doing and go to the route
});




require('./routes/routes.js')(app, passport);