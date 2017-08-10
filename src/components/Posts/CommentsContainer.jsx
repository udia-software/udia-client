import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  createCommentRequest,
  getCommentsRequest
} from "../../modules/comments/sagas.actions";
import {
  setCommentContent,
  clearCommentsState,
  clearCommentError,
  toggleCommentReplyBox
} from "../../modules/comments/reducer.actions";
import Comments from "./Comments";

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  post_id: PropTypes.number
};

const defaultProps = {
  currentUser: {}
};

class CommentsContainer extends Component {
  onSubmitComment = parent_id => {
    const { post_id } = this.props;
    const content = this.props.commentProgress[parent_id];
    this.props.dispatch(createCommentRequest({ parent_id, post_id, content }));
  };

  changeCommentProgress = (parent_id, content) => {
    this.props.dispatch(setCommentContent(parent_id, content));
    this.props.dispatch(clearCommentError(parent_id));
  };

  componentWillMount = () => {
    this.props.dispatch(
      getCommentsRequest({
        page: 1,
        post_id: this.props.post_id,
        parent_id: null
      })
    );
  };

  componentWillUnmount = () => {
    this.props.dispatch(clearCommentsState());
  };

  getNextPage = parent_id => {
    const { page_number, total_pages } = this.props.commentPagination[
      parent_id
    ] || {};
    const { post_id } = this.props;
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(
        getCommentsRequest({
          page: page_number + 1,
          post_id,
          parent_id
        })
      );
    }
  };

  onVisibilityUpdate = (e, { calculations }) => {
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage(null);
    }
  };

  toggleShowReplyBox = () => {
    this.props.dispatch(toggleCommentReplyBox(null));
  };

  render = () => {
    const {
      commentError,
      commentIsSending,
      currentUser,
      commentReplyBox
    } = this.props;
    const showReplyBox = !!commentReplyBox[null];
    const loggedIn = !!Object.keys(currentUser || {}).length;

    return (
      <Comments
        commentError={commentError}
        commentIsSending={commentIsSending}
        onSubmitComment={this.onSubmitComment}
        changeCommentProgress={this.changeCommentProgress}
        commentProgress={this.props.commentProgress}
        onVisibilityUpdate={this.onVisibilityUpdate}
        comments={this.props.comments}
        loggedIn={loggedIn}
        showReplyBox={showReplyBox}
        toggleShowReplyBox={this.toggleShowReplyBox}
      />
    );
  };
}

CommentsContainer.propTypes = propTypes;
CommentsContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    currentUser: state.auth.currentUser,
    post_id: ownProps.post_id
  };
}

export default connect(mapStateToProps)(CommentsContainer);
