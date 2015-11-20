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
					res.send(500);

			});
		});

	app.route('/addArticle')
		.get(function(req, res){

			var Story = new Stories();

			Story.title = 'STORY TITLE';
			Story.body= 'Story body';

			Story.save();

			res.send(Story);

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

};