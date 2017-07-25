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
  clearCommentError
} from "../../modules/comments/reducer.actions";
import Comments from "./Comments";

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  post_id: PropTypes.number
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

  componentWillReceiveProps = nextProps => {
    if (this.props.post_id !== nextProps.post_id && nextProps.post_id) {
      this.props.dispatch(
        getCommentsRequest({
          page: 1,
          post_id: nextProps.post_id,
          parent_id: null
        })
      );
    }
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

  render = () => {
    const { commentError, commentIsSending } = this.props;
    return (
      <Comments
        commentError={commentError}
        commentIsSending={commentIsSending}
        onSubmitComment={this.onSubmitComment}
        changeCommentProgress={this.changeCommentProgress}
        commentProgress={this.props.commentProgress}
        onVisibilityUpdate={this.onVisibilityUpdate}
        comments={this.props.comments}
      />
    );
  };
}

CommentsContainer.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    post_id: ownProps.post_id
  };
}

export default connect(mapStateToProps)(CommentsContainer);
