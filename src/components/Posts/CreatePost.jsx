import React, { Component } from "react";
import { Container, Form, Header, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  editPostTitle,
  editPostContent,
  createPostRequest,
  clearError
} from "../../actions";


const propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.number,
  title: PropTypes.string,
  content: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  currentlySending: PropTypes.bool
};

const defaultProps = {
  error: "",
  currentlySending: false,
  title: "",
  content: ""
};

class CreatePost extends Component {
  changeTitle = event => {
    this.props.dispatch(editPostTitle(event.target.value));
    this.props.dispatch(clearError());
  };

  changeContent = event => {
    this.props.dispatch(editPostContent(event.target.value));
    this.props.dispatch(clearError());
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
    const { id, title, content, currentlySending, error } = this.props;
    return (
      <Container>
        <Header as="h3">Create a Post</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={currentlySending}
          error={!!error}
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
          {!!error &&
            typeof error !== "string" &&
            <Message
              error={!!error}
              header={"Create Post Failed"}
              list={Object.keys(error).map(p => (
                <Message.Item key={p}> {p} {error[p]}</Message.Item>
              ))}
            />}
          {!!error &&
            typeof error === "string" &&
            <Message
              error={!!error}
              header="Create Post Failed"
              content={error}
            />}
          <Form.Button>Submit</Form.Button>
        </Form>
        {id && <Redirect to={`/posts/${id}`} />}
      </Container>
    );
  };
}

CreatePost.propTypes = propTypes;
CreatePost.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    ...state.post,
    error: state.api.error,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(CreatePost);
