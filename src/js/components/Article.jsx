'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');

class Article extends React.Component{
  constructor(){
    super();
  }

  componentDidMount(){
    console.log(this);
    $(this).hide();
  }

  render(){
    return(
      <article>
        <div>
          <span>{this.props.date}</span> | <span>{this.props.author}</span>
        </div>
        <h2>{this.props.title}</h2>
        <p>{this.props.body}</p>
      </article>
    );
  }
}

module.exports = Article;