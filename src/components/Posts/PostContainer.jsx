import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostRequest } from "../../modules/post/sagas.actions";
import {
  setPost,
  clearPostError,
  setEditPostSuccess
} from "../../modules/post/reducer.actions";
import {
  setPresenceState,
  handlePresenceDiff,
  clearPresenceState
} from "../../modules/presence/reducer.actions";
import { getSocket } from "../../modules/socket";
import Post from "./Post";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  presence: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

class PostContainer extends Component {
  constructor(props) {
    super(props);
    this.socket = getSocket();
  }

  componentWillMount = () => {
    this.props.dispatch(setEditPostSuccess(false));
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostRequest({ id: postId }));
    this.socket.connect();
    this.initializePostSocket(postId);
  };

  componentWillUnmount = () => {
    this.socket.disconnect();
    this.props.dispatch(setPost({}));
    this.props.dispatch(clearPostError());
    this.props.dispatch(clearPresenceState());
  };

  initializePostSocket = postId => {
    const postChannel = this.socket.channel(`post:${postId}`);

    postChannel.on("presence_state", resp => {
      this.props.dispatch(setPresenceState(resp));
    });

    postChannel.on("presence_diff", resp => {
      this.props.dispatch(handlePresenceDiff(resp));
    });

    postChannel.join().receive("ok", () => {}).receive("error", error => {
      console.log("error", error);
    });
  };

  render = () => {
    const { sendingPostRequest, postRequestError, post } = this.props.post;
    const { presence } = this.props.presence;
    const currentUsername = (this.props.auth.currentUser || {}).username || "";
    return (
      <Post
        postRequestError={postRequestError}
        sendingPostRequest={sendingPostRequest}
        post={post}
        presence={presence}
        currentUsername={currentUsername}
      />
    );
  };
}

PostContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    post: state.post,
    presence: state.presence,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(PostContainer);
