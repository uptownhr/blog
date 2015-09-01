var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var markdown = require('markdown').markdown;
var config = require('../config/config');

var postSchema = new mongoose.Schema({
  title: {type: String},
  body: {type: String},
  author: {type: String, default: config.author },
  updatedAt: {type: Date, default: Date.now() },
  createdAt: {type: Date, default: Date.now() }
});

var storySchema = new mongoose.Schema({
  title: {type: String},
  body: {type: String},
  posts: [postSchema],
  author: { type: String, default: config.author },
  updatedAt: {type: Date, default: Date.now() },
  createdAt: {type: Date, default: Date.now() }
});

storySchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

storySchema.methods.marked = function(next){
  this.body = markdown.toHTML(this.body);
  this.posts = this.posts.map( function(post){
    post.body = markdown.toHTML(post.body);

    return post;
  });

  return this;
};

module.exports = mongoose.model('Story', storySchema);