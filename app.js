const koa = require('koa');
const logger = require('koa-logger');

const router = require('koa-router')();
const koaBody = require('koa-body')();


const jade = require('koa-jade');
const views = require('koa-views');
const serve = require('koa-static');

const mongoose = require('mongoose');
const Article = require('./models/Article');

require('node-jsx').install();
const react = require('react');
const ArticleNav = react.createFactory( require('./src/js/components/ArticleNav') );
const Story = react.createFactory( require('./src/js/components/Story') );

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
  var articles = yield Article.find().sort({updatedAt: -1});
  this.state.article_nav = react.renderToString( ArticleNav({articles: articles}) );
  yield next;
});

// response
router
  .get('/', function *(next) {
    this.render('home')
  })
  .get('/article/:id', function *(next){
    console.log('testing', this.params);
    var article = yield Article.findOne( {_id: this.params.id} );

    this.state.story = react.renderToString( Story({article: article.marked()}) );
    this.render( 'article' );
  })
  .get('/add-article', function *(next){
    var articles = yield Article.find();
    this.render('add-article', {articles: articles} );
  })
  .post('/add-article', koaBody, function *(next){
    var body = this.request.body;
    var id = this.request.body.parent_article_id;

    var article, res;
    if(id){
      article = yield Article.findOne({_id: id});
      article.posts.push(body);
      res = yield article.save();
    }else{
      var article = new Article(body);
      res  = yield article.save();
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