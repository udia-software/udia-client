import React, { Component } from "react";
import { Comment, Form, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import FromTime from "../Shared/FromTime";
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
      commentEditing,
      toggleEditComment,
      onEditComment,
      changeEditComment,
      currentUsername
    } = this.props;

    return (
      <Comment>
        <Comment.Content>
          <Comment.Author as={Link} to={`/users/${comment.author.username}`}>
            {comment.author.username}
          </Comment.Author>
          <Comment.Metadata>
            <span>
              {"commented "}
              <FromTime time={moment(comment.inserted_at)} />
              {"."}
            </span>
            {moment(comment.inserted_at).format("X") !==
              moment(comment.updated_at).format("X") &&
              <span>
                {" Last updated "}
                <FromTime time={moment(comment.updated_at)} />
                .
              </span>}
          </Comment.Metadata>
          {!!(commentEditing[comment.id] || {}).isEditing &&
            <Form
              reply
              error={!!commentError[comment.id]}
              loading={commentIsSending[comment.id]}
              onSubmit={event => {
                event.preventDefault();
                onEditComment(comment.id);
              }}
            >
              <Form.TextArea
                onChange={event => {
                  changeEditComment(comment.id, event.target.value);
                }}
                value={commentEditing[comment.id].content}
              />
              <Error
                header="Edit Comment Failed!"
                error={commentError[comment.id]}
              />
              <Form.Button
                content="Edit Comment"
                labelPosition="left"
                icon="edit"
                primary
                compact
              />
            </Form>}
          {!!!(commentEditing[comment.id] || {}).isEditing &&
            <Comment.Text>
              {comment.content.split("\n").map((item, key) => {
                return <span key={key}>{item}<br /></span>;
              })}
            </Comment.Text>}
          <Comment.Actions>
            <Comment.Action onClick={toggleShowReplyBox}>
              {showReplyBox ? "Hide Reply" : "Reply"}
            </Comment.Action>
            {currentUsername === comment.author.username &&
              <Comment.Action onClick={toggleEditComment}>
                {!!(commentEditing[comment.id] || {}).isEditing
                  ? "Cancel"
                  : "Edit"}
              </Comment.Action>}
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
        {(comments[comment.id] || []).length > 0 &&
          <Comment.Group>
            <Visibility onUpdate={onVisibilityUpdate}>
              {(comments[comment.id] || [])
                .map(subComment => (
                  <SubCommentContainer
                    key={subComment.id}
                    comment={subComment}
                  />
                ))}
            </Visibility>
          </Comment.Group>}
      </Comment>
    );
  };
}

export default SubComment;
