import React from 'react';
import { Form } from 'semantic-ui-react';

const CreatePost = () => (
  <div>
    <h3>Write a Post</h3>
    <Form>
      <Form.Input label="Title" placeholder="Enter a title..." />
      <Form.TextArea label="Content" placeholder="Write a post..." />
      <Form.Button>Submit</Form.Button>
    </Form>
  </div>
);

export default CreatePost;
