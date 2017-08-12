import React, { Component } from "react";
import { Container, Form, Header, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import Error from "../Shared/Error";
import {
  setPostTitle,
  setPostContent,
  clearPostError
} from "../../modules/post/reducer.actions";
import { createPostRequest } from "../../modules/post/sagas.actions";
import { getJourneyRequest } from "../../modules/journey/sagas.actions";
import { setJourney } from "../../modules/journey/reducer.actions";
import Editor from "react-medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/bootstrap.css";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingPostRequest: PropTypes.bool.isRequired,
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  post: PropTypes.object.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired
};

class CreatePost extends Component {
  componentWillMount = () => {
    this.props.dispatch(setJourney({}));
    const journeyId = this.props.match.params.journeyId;
    if (journeyId) {
      this.props.dispatch(getJourneyRequest({ id: journeyId }));
    }
  };

  changeTitle = event => {
    this.props.dispatch(setPostTitle(event.target.value));
    this.props.dispatch(clearPostError());
  };

  changeContent = text => {
    this.props.dispatch(setPostContent(text));
    this.props.dispatch(clearPostError());
  };

  onSubmit = event => {
    event.preventDefault();
    const { post, journey } = this.props;

    this.props.dispatch(
      createPostRequest({
        ...post,
        journey_id: journey.id
      })
    );
  };

  render = () => {
    const { post, sendingPostRequest, postRequestError, journey } = this.props;

    if (!!post.id) {
      return <Redirect to={`/posts/${post.id}`} />;
    }

    return (
      <Container>
        <Header as="h3">Create a Post</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={sendingPostRequest}
          error={!!postRequestError}
        >
          {journey.id &&
            <Form.Field>
              <Link to={`/journeys/${journey.id}`}>
                <Icon name="road" />{journey.title}
              </Link>
            </Form.Field>}
          <Form.Input
            label="Title"
            type="text"
            placeholder="Enter a title..."
            onChange={this.changeTitle}
            value={post.title}
          />
          <Form.Field>
            <label>Content</label>
            <Editor
              name="text"
              onChange={this.changeContent}
              text={post.content}
              options={{
                toolbar: {
                  buttons: ["bold", "italic", "underline", "anchor"]
                },
                placeholder: {
                  text: "Write a post... (highlight text for formatting options)"
                }
              }}
            />
          </Form.Field>
          <Error header="Create Post Failed!" error={postRequestError} />
          <Form.Button>Submit</Form.Button>
        </Form>
      </Container>
    );
  };
}

CreatePost.propTypes = propTypes;

function mapStateToProps(state) {
  return Object.assign({}, state.post, state.journey);
}

export default connect(mapStateToProps)(CreatePost);
