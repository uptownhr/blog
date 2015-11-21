var Stories = require('../models/Story');

module.exports = function(app){

	app.route('/')

		.get(function(req, res){


			Stories.find(function(err, stories){
				if(err)
					res.send(err);
				else if(stories){
					//passing back the stories and the first story transformed into html from markdown
					res.render('home', {stories: stories, story: stories[0].marked(), brand: app.brand, title: app.title});
				}
				else
					res.send(404);

			});
		});

	app.route('/:slug')
		.get(function(req, res){

			Stories.findOne({slug: req.params.slug}, function(err, story){
				if(err){
					console.log(err);
					res.send(500);
				}
				else if(story){
					getStories(function(stories){
						console.log(stories);	
						res.render('story', {stories: stories, story: story.marked(), brand: app.brand, title: app.title});
					});
				}
				else
					res.send(404);
			});
		});

	app.route('/admin/add-article')
		.get(function(req, res){


			Stories.find(function(err, stories){
				if(err)
					res.send(err);
				else if(stories){

					res.render('add-article', {stories: stories, brand: app.brand, title: app.title});
				}
				else
					res.send(500);

			});

		});

	app.route('/addpost')
		.get(function(req, res){
			var Post = new Stories();

			Post.title = 'Post title';
			Post.body = 'Post body';

			Stories.find(function(err, stories){
				stories[1].posts.push(Post);
				stories[1].save();
				res.send(stories);
			});
		});


	function getStories(callback){
		Stories.find(function(err, stories){
			if(err){
				callback(err);
			}

			else if(stories){
				//passing back the stories and the first story transformed into html from markdown
				callback(stories);
			}

		});
	}

};