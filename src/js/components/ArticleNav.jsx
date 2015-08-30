'use strict';

const React = require('react');

class ArticleNav extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <ul style={{listStyleType: 'none'}}>
        {this.props.articles.map(function(article){
          var res = []

          res.push(<li><a href={"/article/" + article['_id'] + "#" + article['_id']}>{article.title}</a></li>)

          if(article.posts.length > 0){
            res.push( article.posts.map(function(post){
              return <li style={ {paddingLeft: '10px'} }><a href={ "/article/" + article['_id'] + "#" + post['_id'] }>{post.title}</a></li>
            }) )
          }

          return res
        })}

      </ul>
    )
  }
}

module.exports = ArticleNav