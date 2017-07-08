import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editPostTitle, editPostContent } from '../../actions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

class CreatePost extends Component {
  changeTitle = (event) => {
    this.props.dispatch(editPostTitle(event.target.value));
    console.log(event.target.value);
  }

  render = () => {
    const { title, content } = this.props;
    console.log(title);
    return (
      <div style={{ padding: '40px' }}>
        <h3>Write a Post</h3>
        <Form>
          <Form.Input
            label="Title"
            type='text'
            placeholder="Enter a title..."
            onChange={this.changeTitle}
            value={title} />
          <Form.TextArea
            label="Content"
            placeholder="Write a post..." />
          <Form.Button>Submit</Form.Button>
        </Form>
      </div>
    );
  }
}

CreatePost.propTypes = propTypes;

function mapStateToProps(state) {
  return state.post;
}

export default connect(mapStateToProps)(CreatePost);
