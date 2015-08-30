'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');
const Article = require('./Article');

class Story extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    var article = this.props.article;

    return(
      <div>
        <Article id={article['_id']} date={article.createdAt} author="Testing Author" title={article.title} body={article.body} />

        {article.posts.map( (post, index) => {
          return <Article key={index} id={post['_id']} date={post.createdAt} author="Testing Author" title={post.title} body={post.body} />
        })}
      </div>
    );
  }
}

module.exports = Story;