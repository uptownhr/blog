const koa = require('koa');
const config = require('./config/config');
const logger = require('koa-logger');

const router = require('koa-router')();
const koaBody = require('koa-body')();


const jade = require('koa-jade');
const views = require('koa-views');
const serve = require('koa-static');

const mongoose = require('mongoose');
const Story = require('./models/Story');

require('node-jsx').install();
const react = require('react');
const ArticleNavComponent = react.createFactory( require('./src/js/components/ArticleNav') );
const StoryComponent = react.createFactory( require('./src/js/components/Story') );

mongoose.connect('mongodb://localhost/blog');


const app = koa();

app.use(logger());
app.use(jade.middleware({
  viewPath: 'views',
  debug: true,
  noCache: true,
  basedir: 'views'
}));

app.use(serve('public'));

app.use(function *(next){
  var story = yield Story.find().sort({updatedAt: -1});
  this.state.story = story || [];
  this.state.latest_story = story[0];
  this.state.article_nav = react.renderToString( ArticleNavComponent({story}) );
  this.state.brand = config.brand;
  this.state.title = config.title;
  this.state.author = config.author;
  yield next;
});

// response
router
  .get('/', function *(next) {
    if(this.state.story.length > 0 ){
      this.state.story = react.renderToString( StoryComponent({story: this.state.latest_story.marked() }) )
      this.render( 'article' )
    }else{
      this.render('add-article');
    }

  })
  .get('/article/:id', function *(next){
    var story = yield Story.findOne( {_id: this.params.id} );

    this.state.title = story.title;
    this.state.story = react.renderToString( StoryComponent({story: story.marked()}) );

    this.render( 'article' );
  })
  .get('/add-article', function *(next){
    var articles = yield Article.find();
    this.render('add-article', {articles: articles} );
  })
  .post('/add-article', koaBody, function *(next){
    var body = this.request.body;
    var id = this.request.body.parent_article_id;

    var post, res;
    if(id){
      story = yield Story.findOne({_id: id});
      story.posts.push(body);
      res = yield story.save();
    }else{
      var story = new Story(body);
      res  = yield story.save();
    }
    this.body = res;
  })
  .get('/hello', function *(next) {
    yield this.render('hello')
  })
  .get('/about', function *(next) {
    this.body = "<!DOCTYPE html><head><title>About</title></head><body>About Us</body></html>";
  })
  .get('/react', function *(next) {
    yield this.render('react')
  })
  .get('/json', function *(next) {
    this.body = {
      name: 'brett',
      number: 83,
      isProgrammer: true
    };
  });

app
  .use(router.routes())
  .use(router.allowedMethods());
module.exports = app;

// start app if it isn't being required into another module
if (!module.parent) {
  const port = process.env.PORT || 9999;
  app.listen(port);
  console.log('Listening on port ' + port);
}