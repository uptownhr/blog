module.exports = function(app){

	app.route('/')

		.get(function(req, res){
			res.render('home', {brand: 'the brand', title: 'the title'});
		});

};