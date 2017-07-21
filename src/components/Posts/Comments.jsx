import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Comment, Form, Header, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
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

const propTypes = {
  commentError: PropTypes.object.isRequired,
  commentIsSending: PropTypes.object.isRequired,
  commentProgress: PropTypes.object.isRequired,
  commentPagination: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired
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
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
            compact
          />
        </Form>
        <br />
        <Visibility onUpdate={this.onVisibilityUpdate}>
          {(this.props.comments[null] || []).map(comment => (
            <Comment key={comment.id}>
              <Comment.Content>
                <Comment.Author
                  as={Link}
                  to={`/users/${comment.author.username}`}
                >
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
              </Comment.Content>
            </Comment>
          ))}
        </Visibility>
      </Comment.Group>
    );
  };
}

Comments.propTypes = propTypes;

function mapStateToProps(state, props) {
  return {
    ...state.comments,
    post_id: props.post_id
  };
}

export default connect(mapStateToProps)(Comments);
