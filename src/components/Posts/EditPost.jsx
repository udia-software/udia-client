import React, { Component } from "react";
import { Container, Form, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Error from "../Shared/Error";
import {
  setPostTitle,
  setPostContent,
  clearPostError,
  setEditPostSuccess
} from "../../modules/post/reducer.actions";
import {
  getPostRequest,
  editPostRequest
} from "../../modules/post/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingPostRequest: PropTypes.bool.isRequired,
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  post: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string
  }),
  editSuccess: PropTypes.bool
};

const defaultProps = {
  post: { id: 0, title: "", content: "" },
  editSuccess: false
};

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(setEditPostSuccess(false));
  }

  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostRequest({ id: postId }));
  };

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
      editPostRequest({
        id: this.props.post.id,
        title: this.props.post.title,
        content: this.props.post.content
      })
    );
  };

  render = () => {
    const {
      post,
      sendingPostRequest,
      postRequestError,
      editSuccess
    } = this.props;

    if (!!editSuccess) {
      return <Redirect to={`/posts/${post.id}`} />;
    }

    return (
      <Container>
        <Header as="h3">Edit Post</Header>
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
            value={post.title || ""}
          />
          <Form.TextArea
            label="Content"
            type="text"
            placeholder="Write a post..."
            onChange={this.changeContent}
            value={post.content || ""}
          />
          <Error header="Edit Post Failed!" error={postRequestError} />
          <Form.Button>Submit</Form.Button>
        </Form>
      </Container>
    );
  };
}

EditPost.propTypes = propTypes;
EditPost.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    ...state.post
  };
}

export default connect(mapStateToProps)(EditPost);