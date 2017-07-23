import React, { Component } from "react";
import { Comment, Form, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import SubCommentContainer from "./SubCommentContainer";

class SubComment extends Component {
  render = () => {
    const {
      comment,
      toggleShowReplyBox,
      showReplyBox,
      commentError,
      commentIsSending,
      onSubmitComment,
      changeCommentProgress,
      commentProgress,
      onVisibilityUpdate,
      comments,
    } = this.props;

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
            <Comment.Action onClick={toggleShowReplyBox}>
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
                onSubmitComment(comment.id);
              }}
            >
              <Form.TextArea
                onChange={event => {
                  changeCommentProgress(comment.id, event.target.value);
                }}
                value={commentProgress[comment.id]}
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
          <Visibility onUpdate={onVisibilityUpdate}>
            {(comments[comment.id] || [])
              .map(subComment => (
                <SubCommentContainer key={subComment.id} comment={subComment} />
              ))}
          </Visibility>
        </Comment.Group>
      </Comment>
    );
  };
}

export default SubComment;
