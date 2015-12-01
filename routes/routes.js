var Stories = require('../models/Story');

module.exports = function(app, passport){

	app.route('/')

		.get(function(req, res){

			Stories.find().sort({updatedAt: -1}).exec(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories.length>0){
					//passing back the stories and the first story transformed into html from markdown
					res.render('home', {story: stories[0].marked()});
				}
				else if(stories.length<1){
					res.render('home', {story: null});
				}
				else
					res.sendStatus(404);


			});
		});

	

	app.route('/admin/add-article')
		.get(isLoggedIn, function(req, res){

			res.render('add-article');

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
						console.log(Article);
						res.redirect('/'+story.slug+'#'+Article._id);
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
						res.redirect('/'+article.slug);
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

			res.render('edit-article');	
		})

		.post(isLoggedIn, function(req, res){

			/* We send from the Edit article the id as: story or story_{postIndex} for identifying if we are editing
			a post or a story. This is because the edit form is the same for the both (edit and post) and we can't difference in 
			other way if we are editing a post or a story. */
			var splitId = req.body.article_id.split("_");

			//Is a post
			if(splitId.length>1){
				var StoryId = splitId[0];
				var postIndex = splitId[1];

				Stories.findById(StoryId, function(err, story){
					if(err){
						console.log('Error finding a story in editing route: '+err);
						res.sendStatus(500);
					}
					else if(story){
						story.posts[postIndex].title = req.body.title;
						story.posts[postIndex].body = req.body.body;
						story.save(function(err, story){
							if(err){
								console.log('Error finding a story in editing route: '+err);
								res.sendStatus(500);
							}
							else if(story){
								res.redirect('/'+story.slug+'#'+story.posts[postIndex]._id);
							}
						});
					}
				});
			}
			//is a story
			else{
				Stories.findById(req.body.article_id, function(err, story){
					if(err){
						console.log('Error finding a story in editing route: '+err);
						res.sendStatus(500);
					}
					else if(story){
						story.title = req.body.title;
						story.body = req.body.body;
						story.save(function(err, story){
							if(err){
								console.log('Error finding a story in editing route: '+err);
								res.sendStatus(500);
							}
							else if(story){
								res.redirect('/'+story.slug);
							}
						});
					}
				});
			}
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


	app.route('/:slug')
		.get(function(req, res){
			console.log(req.params.slug);
			Stories.findOne({slug: req.params.slug}, function(err, story){
				if(err){
					console.log('Getting article error: '+err);
					res.sendStatus(500);
				}
				else if(story){
					res.render('story', {story: story.marked()});
				}
				else
					res.sendStatus(404);
			});
		});


	function isLoggedIn(req, res, next){
		if(req.isAuthenticated())
			return next();

		res.redirect('/');
	}

};