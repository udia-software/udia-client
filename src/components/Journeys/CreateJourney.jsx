import React, { Component } from "react";
import { Container, Form, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Error from "../Shared/Error";
import { 
    setJourneyTitle,
    setJourneyDescription,
    clearJourneyError
} from "../../modules/journey/reducer.actions";
import { createJourneyRequest } from "../../modules/journey/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

class CreateJourney extends Component {
  changeTitle = event => {
    this.props.dispatch(setJourneyTitle(event.target.value));
    this.props.dispatch(clearJourneyError());
  };

  changeDescription = event => {
    this.props.dispatch(setJourneyDescription(event.target.value));
    this.props.dispatch(clearJourneyError());
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      createJourneyRequest({
        title: this.props.title,
        description: this.props.description
      })
    );
  };

  render = () => {
    const {
      journey,
      title,
      description,
      sendingJourneyRequest,
      journeyRequestError
    } = this.props;
    return (
      <Container>
        {/* When creating a journey, if the ID is set, journey is created. */
        !!journey.id && <Redirect to={`/journeys/${journey.id}`} />}
        <Header as="h3">Start a Journey</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={sendingJourneyRequest}
          error={!!journeyRequestError}
        >
          <Form.Input
            label="Title"
            type="text"
            placeholder="What is this journey called?"
            onChange={this.changeTitle}
            value={title}
          />
          <Form.TextArea
            label="Description"
            type="text"
            placeholder="Tell us about your journey..."
            onChange={this.changeDescription}
            value={description}
          />
          <Error header="Create Journey Failed!" error={journeyRequestError} />
          <Form.Button>Submit</Form.Button>
        </Form>
      </Container>
    );
  };
}

CreateJourney.propTypes = propTypes;

function mapStateToProps(state) {
  return state.journey;
}

export default connect(mapStateToProps)(CreateJourney);
