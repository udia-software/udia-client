import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Comment, Form, Header, Visibility } from "semantic-ui-react";
import Error from "../Shared/Error";
import {
  createCommentRequest,
  getCommentsRequest
} from "../../modules/comments/sagas.actions";
import {
  setCommentContent,
  clearCommentsState,
  clearCommentError
} from "../../modules/comments/reducer.actions";
import SubComment from "./SubComment";

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  post_id: PropTypes.number
};

class Comments extends Component {
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
      <Comment.Group>
        <Header as="h3" dividing>Comments</Header>

        <Form
          reply
          error={!!commentError[null]}
          loading={commentIsSending[null]}
          onSubmit={event => {
            event.preventDefault();
            this.onSubmitComment(null);
          }}
        >
          <Form.TextArea
            onChange={event => {
              this.changeCommentProgress(null, event.target.value);
            }}
            value={this.props.commentProgress[null]}
          />
          <Error header="Create Comment Failed!" error={commentError[null]} />

          <Form.Button
            content="Comment"
            labelPosition="left"
            icon="edit"
            primary
            compact
          />
        </Form>
        <br />
        <Visibility onUpdate={this.onVisibilityUpdate}>
          {(this.props.comments[null] || [])
            .map(comment => (
              <SubComment
                key={comment.id}
                comment={comment}
              />
            ))}
        </Visibility>
      </Comment.Group>
    );
  };
}

Comments.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    post_id: ownProps.post_id
  };
}

export default connect(mapStateToProps)(Comments);
