import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Comment, Form, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import {
  createCommentRequest,
  getCommentsRequest
} from "../../modules/comments/sagas.actions";
import {
  setCommentContent,
  clearCommentError
} from "../../modules/comments/reducer.actions";

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired
};

class SubComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyBox: false
    };
    this.props.dispatch(
      getCommentsRequest({
        page: 1,
        post_id: props.comment.post_id,
        parent_id: props.comment.id
      })
    );
  }

  toggleShowReplyBox = () => {
    this.setState(prevState => {
      return { showReplyBox: !prevState.showReplyBox };
    });
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
    const { parent_id } = this.props;
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage(parent_id);
    }
  };

  render = () => {
    const { commentError, commentIsSending, comments, comment } = this.props;
    const { showReplyBox } = this.state;
    return (
      <Comment>
        <Comment.Content>
          <Comment.Author as={Link} to={`/users/${comment.author.username}`}>
            {comment.author.username}
          </Comment.Author>
          <Comment.Metadata>
            <div>{moment(comment.inserted_at).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text>
            {comment.content.split("\n").map((item, key) => {
              return <span key={key}>{item}<br /></span>;
            })}
          </Comment.Text>
          <Comment.Actions>
            <Comment.Action onClick={this.toggleShowReplyBox}>
              {showReplyBox ? "Hide Reply" : "Reply"}
            </Comment.Action>
          </Comment.Actions>
          {showReplyBox &&
            <Form
              reply
              error={!!commentError[comment.id]}
              loading={commentIsSending[comment.id]}
              onSubmit={event => {
                event.preventDefault();
                this.onSubmitComment(comment.id);
              }}
            >
              <Form.TextArea
                onChange={event => {
                  this.changeCommentProgress(comment.id, event.target.value);
                }}
                value={this.props.commentProgress[comment.id]}
              />
              <Error
                header="Create Comment Failed!"
                error={commentError[comment.id]}
              />
              <Form.Button
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                primary
                compact
              />
            </Form>}
        </Comment.Content>
        <Comment.Group>
          <Visibility onUpdate={this.onVisibilityUpdate}>
            {(comments[comment.id] || [])
              .map(subComment => (
                <SubComment key={subComment.id} comment={subComment} />
              ))}
          </Visibility>
        </Comment.Group>
      </Comment>
    );
  };
}

SubComment.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
  return {
    ...state.comments,
    comment: ownProps.comment
  };
}

export default connect(mapStateToProps)(SubComment);
