import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions';
import { Feed, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
}

class PostList extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getPosts());
  }
  render = () => {
    const { posts } = this.props;
    console.log(posts)
    return (
      <div style={{ padding: '40px' }}>
        <Feed>
          {posts.map((post, index) => (
            <Feed.Event key={index}>
              <Feed.Label>
                <Icon name='user' />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <strong>{post.author.username}</strong> wrote{' '}
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  <Feed.Date>{moment(post.inserted_at).fromNow()}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>
                  {post.content}
                </Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </div>
    );
  }
}

PostList.propTypes = propTypes;

function mapStateToProps(state) {
  return state.postList;
}

export default connect(mapStateToProps)(PostList);