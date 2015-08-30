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
      <article id={this.props.id}>
        <div>
          <span>{this.props.date.toString()}</span> | <span>{this.props.author}</span>
        </div>
        <h2>{this.props.title}</h2>
        <div dangerouslySetInnerHTML={{__html: this.props.body}} />
      </article>
    );
  }
}

module.exports = Article;