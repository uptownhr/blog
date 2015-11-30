var Stories = require('../models/Story');

module.exports = function(app, passport){

	app.route('/')

		.get(function(req, res){

			Stories.find(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories.length>0){
					//passing back the stories and the first story transformed into html from markdown
					res.render('home', {stories: stories, story: stories[0].marked()});
				}
				else if(stories.length<1){
					res.render('home', {stories: stories, story: null});
				}
				else
					res.sendStatus(404);


			});
		});

	app.route('/article/:slug')
		.get(function(req, res){
			Stories.findOne({slug: req.params.slug}, function(err, story){
				if(err){
					console.log('Getting article error: '+err);
					res.sendStatus(500);
				}
				else if(story){
					getStories(function(err, stories){
						if(err){
							console.log('Getting article error: '+err);
							res.sendStatus(500);
						}
						console.log(stories[0].slug);
						res.render('story', {stories: stories, story: story.marked()});
					});
				}
				else
					res.sendStatus(404);
			});
		});

	app.route('/admin/add-article')
		.get(isLoggedIn, function(req, res){


			Stories.find(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories){

					res.render('add-article', {stories: stories});
				}
				else
					res.sendStatus(500);

			});

		})

		.post(isLoggedIn, function(req, res){

			var Article = new Stories();

			if(req.body.parent_article_id !== ''){
				Article.title = req.body.title;
				Article.body  = req.body.body;

				Stories.findById(req.body.parent_article_id, function(err, story){
					if(story){
						story.posts.push(Article);
						story.save();
						res.sendStatus(200);
					}
					else{
						console.log('Error posting new article');
						res.sendStatus(500);
					}

				});
			}
			else{
				Article.title = req.body.title;
				Article.body  = req.body.body;
				Article.save(function(err, article){
					if(article){
						res.sendStatus(200);
					}
					else{
						console.log('Error saving the article');
						res.sendStatus(500);
					}
				});
			}
		});

	app.route('/admin/edit-article')
		.get(isLoggedIn, function(req, res){

			Stories.find(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories){

					res.render('edit-article', {stories: stories});
				}
				else
					res.sendStatus(500);

			});
		})

		.post(isLoggedIn, function(req, res){

		});

	app.route('/login')
		.get(function(req, res){
			res.render('login');
		})

		.post(passport.authenticate('local-login', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));



	app.route('/signup')
		.get(function(req, res){
			res.render('signup');
		})

		.post(passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/signup'
		}));

	//Getting all the stories.
	function getStories(callback){
		Stories.find(function(err, stories){
			if(err){
				callback(err);
			}

			else if(stories){
				callback(err, stories);
			}

		});
	}

	function isLoggedIn(req, res, next){
		if(req.isAuthenticated())
			return next();

		res.redirect('/');
	}

};