'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');
const Article = require('./Article');

class Story extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    var story = this.props.story;

    return(
      <div>
        <Article id={story['_id']} date={story.createdAt} author={story.author} title={story.title} body={story.body} />

        {story.posts.map( (post, index) => {
          return <Article key={index} id={post['_id']} date={post.createdAt} author={post.author} title={post.title} body={post.body} />
        })}
      </div>
    );
  }
}

module.exports = Story;