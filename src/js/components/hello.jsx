'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');

class Hello extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <Navbar brand='React Base'>
        <Nav>
          <NavItem eventKey={1} href='#'>Link</NavItem>
          <NavItem eventKey={2} href='#'>Link</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

module.exports = Hello;