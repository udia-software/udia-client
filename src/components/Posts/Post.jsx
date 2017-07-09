import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPost, getPostById } from '../../actions';
import { Container } from 'semantic-ui-react';
import moment from 'moment';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.object
}

class Post extends Component {
  constructor(props) {
    super(props);
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostById(postId));
  }
  componentWillUnmount = () => {
    this.props.dispatch(setPost(null));
  }
  render = () => {
    const { post } = this.props;
    console.log(post);
    return (
      <Container>
        This is a post
      </Container>
    );
  }
}

Post.propTypes = propTypes;

function mapStateToProps(state) {
  return state.post;
}

export default connect(mapStateToProps)(Post);