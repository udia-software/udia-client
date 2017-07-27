import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostRequest } from "../../modules/post/sagas.actions";
import { setPost, clearPostError } from "../../modules/post/reducer.actions";
import Post from "./Post";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingPostRequest: PropTypes.bool.isRequired,
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  post: PropTypes.object.isRequired
};

class PostContainer extends Component {
  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostRequest({ id: postId }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setPost({}));
    this.props.dispatch(clearPostError());
  };

  render = () => {
    const { sendingPostRequest, postRequestError, post } = this.props;
    return (
      <Post
        postRequestError={postRequestError}
        sendingPostRequest={sendingPostRequest}
        post={post}
      />
    );
  };
}

PostContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return state.post;
}

export default connect(mapStateToProps)(PostContainer);
