import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  createCommentRequest,
  getCommentsRequest
} from "../../modules/comments/sagas.actions";
import {
  setCommentContent,
  clearCommentError,
  toggleCommentReplyBox
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
  }

  toggleShowReplyBox = () => {
    this.props.dispatch(toggleCommentReplyBox(this.props.comment.id));
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
      comments,
      comment
    } = this.props;
    const showReplyBox = !!(commentReplyBox[comment.id]);

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
      />
    );
  };
}

SubCommentContainer.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    comment: ownProps.comment
  };
}

export default connect(mapStateToProps)(SubCommentContainer);
