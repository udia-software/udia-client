import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Comment, Form, Header, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  createCommentRequest,
  editCommentContent,
  getCommentsRequest,
  clearCommentsState,
} from "../../actions";

class Comments extends Component {
  onSubmitComment = parent_id => {
    const { post_id } = this.props;
    const content = this.props.commentProgress[parent_id];

    this.props.dispatch(createCommentRequest({ parent_id, post_id, content }));
  };

  changeCommentProgress = (parent_id, content) => {
    this.props.dispatch(editCommentContent(parent_id, content));
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
    this.props.dispatch(clearCommentsState())
  }

  getNextPage = parent_id => {
    const { page_number, total_pages } = this.props.commentMeta[parent_id];
    const { post_id } = this.props;
    console.log(page_number, total_pages);
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
    return (
      <Comment.Group>
        <Header as="h3" dividing>Comments</Header>

        <Form
          reply
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
          <Button
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
            compact
          />
        </Form>

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
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Visibility>
      </Comment.Group>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.comments,
    post_id: (state.post || {}).id
  };
}

export default connect(mapStateToProps)(Comments);
