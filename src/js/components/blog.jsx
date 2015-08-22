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
        <Navbar brand='Freedom Blog'>
          <Nav>
            <NavItem eventKey={1} href='#'>Link</NavItem>
            <NavItem eventKey={2} href='#'>Link</NavItem>
          </Nav>
        </Navbar>
        <div className="container-fluid">
          <Row>
            <Col md={4}>
              <ul>Nav
                <li>Article 1</li>
                <li>Article 1</li>
                <li>Article 1</li>
              </ul>
            </Col>
            <Col md={8}>
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