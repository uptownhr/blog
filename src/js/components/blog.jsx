'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');
const Story = require('./Story');

class Blog extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <div>
        <div className="container-fluid">
          <Row>
            <Col sm={2}>
              <ul>Articles
                <li>Article 1</li>
                <li>Article 2</li>
                <li>Article 3</li>
              </ul>
            </Col>
            <Col sm={10}>
              {/*
              when nothing is sent, this area will display the latest article->post
              */}
              <Story story={this.props.story} post={this.props.post} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

module.exports = Blog;