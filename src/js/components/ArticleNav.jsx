'use strict';

const React = require('react');
const {Col} = require('react-bootstrap');

class ArticleNav extends React.Component{
  constructor(props){
    console.log(props)
    super(props)
  }

  render(){
    return(
      <Col sm={2}>

        <ul style={{listStyleType: 'none'}}>
          {this.props.articles.map(function(article){
            var res = []

            res.push(<li>{article.title}</li>)

            if(article.posts.length > 0){
              res.push( article.posts.map(function(post){
                return <li style={{paddingLeft: '10px'}}>{post.title}</li>
              }) )
            }

            return res
          })}

        </ul>
      </Col>
    )
  }
}

module.exports = ArticleNav