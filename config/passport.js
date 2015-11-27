var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var secrets = require('./secret');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true

	},
	function(req, email, password, done){

		//Doing things sync
		process.nextTick(function(){
			User.findOne({'email': email}, function(err, user){
				if(err)
					return done(err);

				if(user){
					return done(null, false);
				}
				else {
					var newUser = new User();
					newUser.email = email;
					newUser.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});

	}));


	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done){
		
		/* Using secret credentials by the moment, delete for deploy */

		if(email === secrets.login.user){
			User.findOne({'email' : email}, function(err, user){
				if(err)
					return done(err);
				if(!user){
					var newUser = new User();
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
				else if(!user.validPassword(password))
					return done(null, false);
				else
					return done(null, user);

			});

		}

		// Uncomment for deploy
		// User.findOne({'email' : email}, function(err, user){
		// 	if(err)
		// 		return done(err);
		// 	if(!user)
		// 		return done(null, false);

		// 	if(!user.validPassword(password))
		// 		return done(null, false);

		// 	return done(null, user);
		// });
	}));


};