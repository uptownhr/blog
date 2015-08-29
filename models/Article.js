var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
  title: {type: String},
  body: {type: String},

  createdAt: {type: Date, default: Date.now() }
});

var articleSchema = new mongoose.Schema({
  title: {type: String},
  body: {type: String},
  posts: [postSchema],

  updatedAt: {type: Date, default: Date.now() },
  createdAt: {type: Date, default: Date.now() }
});

articleSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Article', articleSchema);