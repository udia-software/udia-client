import React, { Component } from "react";
import { Comment, Form, Header, Visibility } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import SubCommentContainer from "./SubCommentContainer";

class Comments extends Component {
  render = () => {
    const {
      commentError,
      commentIsSending,
      onSubmitComment,
      changeCommentProgress,
      commentProgress,
      onVisibilityUpdate,
      comments,
      loggedIn,
      showReplyBox,
      toggleShowReplyBox
    } = this.props;
    return (
      <Comment.Group>
        <Header as="h3" dividing>Comments</Header>
        {loggedIn &&
          <div>
            {showReplyBox &&
              <Form
                reply
                error={!!commentError[null]}
                loading={commentIsSending[null]}
                onSubmit={event => {
                  event.preventDefault();
                  onSubmitComment(null);
                }}
              >
                <Form.TextArea
                  onChange={event => {
                    changeCommentProgress(null, event.target.value);
                  }}
                  value={commentProgress[null]}
                />
                <Error
                  header="Create Comment Failed!"
                  error={commentError[null]}
                />

                <Form.Button
                  content="Comment"
                  labelPosition="left"
                  icon="edit"
                  primary
                  compact
                />
              </Form>}
            <a onClick={toggleShowReplyBox} style={{ cursor: "pointer" }}>
              {showReplyBox ? "Cancel" : "Write Comment"}
            </a>
          </div>}
        {!loggedIn &&
          <div>
            <span>
              You must
              {" "}
              <Link to="/signin">log in</Link>
              {" "}
              or
              {" "}
              <Link to="/signup">sign up</Link>
              {" "}
              to reply to a post.
            </span>
          </div>}
        <br />
        <Visibility onUpdate={onVisibilityUpdate}>
          {(comments[null] || [])
            .map(comment => (
              <SubCommentContainer key={comment.id} comment={comment} />
            ))}
        </Visibility>
      </Comment.Group>
    );
  };
}

export default Comments;
