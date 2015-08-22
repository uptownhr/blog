'use strict';

const React = require('react');
const {Row, Col, Nav, Navbar, NavItem} = require('react-bootstrap');
const Article = require('./Article');

const request = require('browser-request');

class Story extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      articles: []
    };
  }

  componentDidMount(){
    /*
    Use props.story to pull in articles for story
    Use post, to focus on specific article
     */
    var test = React.findDOMNode(this);

    //mock articles
    var articles = [
      {
        date: '12-25-2015',
        author: 'James',
        title: 'Blogging platform of my dream',
        body: 'Working on it.'
      },
      {
        date: '12-26-2015',
        author: 'James',
        title: 'This is a lot of work',
        body: 'I thought i would be done by now'
      },
      {
        date: '12-25-2015',
        author: 'James',
        title: 'Let me look up how I do ajax calls',
        body: 'Goign to use jQuery $ or request-browser'
      },
      {
        date: '12-25-2015',
        author: 'James',
        title: 'How do I focus, scrollto a component?',
        body: 'Lets see if jquery works. Attempting to select $(this) from componentDidMount did not work. Looks like there is a getdomenode method. lets try'
      },
      {
        date: '12-25-2015',
        author: 'James',
        title: 'how do i use, findDOMNode',
        body: 'looks like poor documentation to me. why no examples? But i figured it out. <br> `React.findDomNode(this)` from ::componentDidMount. Wish I had markdown.'
      },
      {
        date: '12-25-2015',
        author: 'James',
        title: 'Looks like jQuery works damn well in react',
        body: 'Given that you can access component DOM, you have almost all control and can do anything with jquery as you would normally do'
      },
      {
        date: '12-25-2015',
        author: 'James',
        title: 'Done for the night',
        body: 'I will think about how i should focus on the article i want'
      }
    ];

    this.setState( {articles} );
  }

  render(){
    return(
      <div>
        {this.state.articles.map( (article, index) => {
          return <Article key={index} date={article.date} author={article.author} title={article.title} body={article.body} />
        })}
      </div>
    );
  }
}

module.exports = Story;