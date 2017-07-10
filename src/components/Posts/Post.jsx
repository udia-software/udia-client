import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPost, getPostById } from '../../actions';
import { Container, Dimmer, Loader, Segment, Item } from 'semantic-ui-react';
import moment from 'moment';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.object,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  currentlySending: PropTypes.bool
}

const defaultProps = {
  error: '',
  currentlySending: false
};

class Post extends Component {
  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostById(postId));
  }
  componentWillUnmount = () => {
    this.props.dispatch(setPost(null));
  }
  render = () => {
    const { post, error, currentlySending } = this.props;
    console.log(post);
    return (
      <Container>
        <Loader active={currentlySending} inline='centered' />
        {post ?
          <Item>
            <Item.Content>
              <Item.Header as='h3'>
                {post.title}
              </Item.Header>
              <Item.Meta>
                Written by {post.author.username} on {moment(post.inserted_at).format('MMMM D [at] h:mm a')}
              </Item.Meta>
              <Item.Description>
                <br/>
                {post.content}
              </Item.Description>
              <Item.Extra></Item.Extra>
            </Item.Content>
          </Item>
          : null}
      </Container>
    );
  }
}

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    ...state.post,
    error: state.api.error,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(Post);