var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var markdown = require('markdown').markdown;
var marked = require('marked');
var config = require('../config/config');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: false,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

var postSchema = new mongoose.Schema({
  title: {type: String},
  slug: {type: String, index: true},
  body: {type: String},
  author: {type: String, default: config.author },
  updatedAt: {type: Date, default: Date.now() },
  createdAt: {type: Date, default: Date.now() }
});

postSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  this.slug = slugify(this.title);
  next();
});

var storySchema = new mongoose.Schema({
  title: {type: String},
  slug: {type: String},
  body: {type: String},
  posts: [postSchema],
  author: { type: String, default: config.author },
  updatedAt: {type: Date, default: Date.now() },
  createdAt: {type: Date, default: Date.now() }
});

storySchema.pre('save', function(next){
  this.updatedAt = Date.now();
  this.slug = slugify(this.title);
  next();
});

storySchema.methods.marked = function(next){
  this.body = marked(this.body);
  this.posts = this.posts.map( function(post){
    post.body = marked(post.body);

    return post;
  });

  return this;
};

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = mongoose.model('Story', storySchema);