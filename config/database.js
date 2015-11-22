module.exports = function(mongoose){
	
	var uristring = 
	  process.env.MONGOLAB_URI || 
	  process.env.MONGOHQ_URL || 
	  'mongodb://localhost/blog';

	mongoose.connect(uristring, function(err, res){
		if(err){
			console.log('ERROR: connecting to database. '+err);
		}
		else
			console.log('Connected to Database.');
	});

};