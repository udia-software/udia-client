import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editPostTitle, editPostContent, createPostRequest } from '../../actions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  error: PropTypes.string,
  currentlySending: PropTypes.bool
};

const defaultProps = {
  error: '',
  currentlySending: false
};

class CreatePost extends Component {
  changeTitle = (event) => {
    this.props.dispatch(editPostTitle(event.target.value));
  }

  changeContent = (event) => {
    this.props.dispatch(editPostContent(event.target.value));
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch(createPostRequest({
      title: this.props.title,
      content: this.props.content
    }));
  }

  render = () => {
    const { title, content, currentlySending, error } = this.props;
    return (
      <div style={{ padding: '40px' }}>
        <h3>Write a Post</h3>
        <Form
          onSubmit={this.onSubmit}
          loading={currentlySending}
          error={!!error}>
          <Form.Input
            label="Title"
            type='text'
            placeholder="Enter a title..."
            onChange={this.changeTitle}
            value={title} />
          <Form.TextArea
            label="Content"
            type='text'
            placeholder="Write a post..."
            onChange={this.changeContent}
            value={content} />
          {!!error &&
            <Message
              error={!!error}
              header={'Create Post Failed'}
              content={error} />}
          <Form.Button>Submit</Form.Button>
        </Form>
      </div>
    );
  }
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
