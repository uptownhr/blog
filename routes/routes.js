var Stories = require('../models/Story');

module.exports = function(app){

	app.route('/')

		.get(function(req, res){


			Stories.find(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories.length>0){
					//passing back the stories and the first story transformed into html from markdown
					res.render('home', {stories: stories, story: stories[0].marked(), brand: app.brand, title: app.title});
				}
				else if(stories.length<1){
					res.render('home', {stories: stories, story: null, brand: app.brand, title: app.title});
				}
				else
					res.sendStatus(404);


			});
		});

	app.route('/:slug')
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
						res.render('story', {stories: stories, story: story.marked(), brand: app.brand, title: app.title});
					});
				}
				else
					res.sendStatus(404);
			});
		});

	app.route('/admin/add-article')
		.get(function(req, res){


			Stories.find(function(err, stories){
				if(err)
					res.sendStatus(err);
				else if(stories){

					res.render('add-article', {stories: stories, brand: app.brand, title: app.title});
				}
				else
					res.sendStatus(500);

			});

		})

		.post(function(req, res){
			console.log(req.body);

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
				console.log('hey');
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

	app.route('/addpost')
		.get(function(req, res){
			var Post = new Stories();

			Post.title = 'Post title';
			Post.body = 'Post body';

			Stories.find(function(err, stories){
				stories[1].posts.push(Post);
				stories[1].save();
				res.sendStatus(stories);
			});
		});


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

};