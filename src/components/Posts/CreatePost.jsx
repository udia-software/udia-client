import React, { Component } from "react";
import { Container, Form, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Error from "../Shared/Error";
import {
  setPostTitle,
  setPostContent,
  clearPostError
} from "../../modules/post/reducer.actions";
import { createPostRequest } from "../../modules/post/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingPostRequest: PropTypes.bool.isRequired,
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  post: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

class CreatePost extends Component {
  changeTitle = event => {
    this.props.dispatch(setPostTitle(event.target.value));
    this.props.dispatch(clearPostError());
  };

  changeContent = event => {
    this.props.dispatch(setPostContent(event.target.value));
    this.props.dispatch(clearPostError());
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      createPostRequest({
        title: this.props.title,
        content: this.props.content
      })
    );
  };

  render = () => {
    const {
      post,
      title,
      content,
      sendingPostRequest,
      postRequestError
    } = this.props;
    return (
      <Container>
        {/* When creating a post, if the ID is set, post is created. */
        !!post.id && <Redirect to={`/posts/${post.id}`} />}
        <Header as="h3">Create a Post</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={sendingPostRequest}
          error={!!postRequestError}
        >
          <Form.Input
            label="Title"
            type="text"
            placeholder="Enter a title..."
            onChange={this.changeTitle}
            value={title}
          />
          <Form.TextArea
            label="Content"
            type="text"
            placeholder="Write a post..."
            onChange={this.changeContent}
            value={content}
          />
          <Error header="Create Post Failed!" error={postRequestError} />
          <Form.Button>Submit</Form.Button>
        </Form>
      </Container>
    );
  };
}

CreatePost.propTypes = propTypes;

function mapStateToProps(state) {
  return state.post;
}

export default connect(mapStateToProps)(CreatePost);
