import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  createCommentRequest,
  getCommentsRequest,
  editCommentRequest
} from "../../modules/comments/sagas.actions";
import {
  setCommentContent,
  clearCommentError,
  toggleCommentReplyBox,
  toggleEditComment,
  setEditCommentContent
} from "../../modules/comments/reducer.actions";
import SubComment from "./SubComment";

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired
};

class SubCommentContainer extends Component {
  componentWillMount = () => {
    this.props.dispatch(
      getCommentsRequest({
        page: 1,
        post_id: this.props.comment.post_id,
        parent_id: this.props.comment.id
      })
    );
  };

  toggleShowReplyBox = () => {
    this.props.dispatch(toggleCommentReplyBox(this.props.comment.id));
  };

  toggleEditComment = () => {
    this.props.dispatch(
      toggleEditComment(this.props.comment.id, this.props.comment.content)
    );
  };

  onSubmitComment = parent_id => {
    const post_id = this.props.comment.post_id;
    const content = this.props.commentProgress[parent_id];
    this.props.dispatch(createCommentRequest({ parent_id, post_id, content }));
  };

  changeCommentProgress = (parent_id, content) => {
    this.props.dispatch(setCommentContent(parent_id, content));
    this.props.dispatch(clearCommentError(parent_id));
  };

  onEditComment = comment_id => {
    const content = this.props.commentEditing[comment_id].content;
    this.props.dispatch(editCommentRequest({ comment_id, content }));
  };

  changeEditComment = (comment_id, content) => {
    this.props.dispatch(setEditCommentContent(comment_id, content));
    this.props.dispatch(clearCommentError(comment_id));
  };

  getNextPage = parent_id => {
    const { page_number, total_pages } = this.props.commentPagination[
      parent_id
    ] || {};
    const post_id = this.props.comment.post_id;
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
    const parent_id = this.props.comment.id;
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage(parent_id);
    }
  };

  render = () => {
    const {
      commentError,
      commentIsSending,
      commentProgress,
      commentReplyBox,
      commentEditing,
      comments,
      comment
    } = this.props;
    const showReplyBox = !!commentReplyBox[comment.id];
    const currentUsername = (this.props.auth.currentUser || {}).username || "";

    return (
      <SubComment
        comment={comment}
        toggleShowReplyBox={this.toggleShowReplyBox}
        showReplyBox={showReplyBox}
        commentError={commentError}
        commentIsSending={commentIsSending}
        onSubmitComment={this.onSubmitComment}
        changeCommentProgress={this.changeCommentProgress}
        commentProgress={commentProgress}
        onVisibilityUpdate={this.onVisibilityUpdate}
        comments={comments}
        commentEditing={commentEditing}
        toggleEditComment={this.toggleEditComment}
        onEditComment={this.onEditComment}
        changeEditComment={this.changeEditComment}
        currentUsername={currentUsername}
      />
    );
  };
}

SubCommentContainer.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    comment: ownProps.comment,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(SubCommentContainer);
