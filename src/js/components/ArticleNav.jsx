'use strict';

const React = require('react');

class ArticleNav extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <ul style={{listStyleType: 'none'}}>
        {this.props.stories.map(function(article){
          var res = []

          res.push(<li><a href={"/" + article['slug'] + "#" + article['_id']}>{article.title}</a></li>)

          if(article.posts.length > 0){
            res.push( article.posts.map(function(post){
              return <li style={ {paddingLeft: '10px'} }><a href={ "/" + article['slug'] + "#" + post['_id'] }>{post.title}</a></li>
            }) )
          }

          return res
        })}

      </ul>
    )
  }
}

module.exports = ArticleNav