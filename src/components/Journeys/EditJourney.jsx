import React, { Component } from "react";
import { Container, Form, Header, Grid, Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from "prop-types";
import Error from "../Shared/Error";
import {
  setJourneyTitle,
  setJourneyDescription,
  setJourneyStartDate,
  setJourneyEndDate,
  clearJourneyError
} from "../../modules/journey/reducer.actions";
import { getJourneyRequest, editJourneyRequest } from "../../modules/journey/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired,
  editSuccess: PropTypes.bool
};

class CreateJourney extends Component {

  componentWillMount = () => {
    const journeyId = this.props.match.params.id;
    this.props.dispatch(getJourneyRequest({ id: journeyId }));
  }

  changeTitle = event => {
    this.props.dispatch(setJourneyTitle(event.target.value));
    this.props.dispatch(clearJourneyError());
  };

  changeDescription = event => {
    this.props.dispatch(setJourneyDescription(event.target.value));
    this.props.dispatch(clearJourneyError());
  };

  changeStartDate = date => {
    this.props.dispatch(setJourneyStartDate(date.toDate()));
    this.props.dispatch(clearJourneyError());
  }

  changeEndDate = date => {
    const { start_date } = this.props;
    if (date < start_date) {
      this.props.dispatch(setJourneyStartDate(date.toDate()));
    }
    this.props.dispatch(setJourneyEndDate(date.toDate()));
    this.props.dispatch(clearJourneyError());
  }

  onSubmit = event => {
    event.preventDefault();
    const { journey } = this.props;

    console.log(journey)

    this.props.dispatch(editJourneyRequest(journey));
  };

  toggleEndDateCheckbox = () => {
    const { journey } = this.props;
    journey.end_date ? this.props.dispatch(setJourneyEndDate(null)) : this.props.dispatch(setJourneyEndDate(new Date()));
  }

  render = () => {

    const {
      journey,
      sendingJourneyRequest,
      journeyRequestError,
      editSuccess
    } = this.props;
    
    if (!!editSuccess) {
      return <Redirect to={`/journeys/${journey.id}`} />;
    }

    return (
      <Container className={'pad-top'}>
        <Header as="h3">Edit a Journey</Header>
        <Form
          style={{ minHeight: '500px' }}
          onSubmit={this.onSubmit}
          loading={sendingJourneyRequest}
          error={!!journeyRequestError}
        >
          <Form.Input
            label="Title"
            type="text"
            placeholder="What is this journey called?"
            onChange={this.changeTitle}
            value={journey.title}
          />
          <Form.Field>
            <Grid columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label>Start Date</label>
                  <DatePicker
                    selected={moment(journey.start_date)}
                    onChange={this.changeStartDate}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>End Date</label>
                  {!journey.end_date &&
                    <Checkbox
                      label="Present"
                      checked={journey.end_date === null}
                      onChange={this.toggleEndDateCheckbox}
                    />
                  }
                  {journey.end_date &&
                    <DatePicker
                      selected={moment(journey.end_date)}
                      onChange={this.changeEndDate}
                    />
                  }
                </Form.Field>
              </Grid.Column>
            </Grid>
          </Form.Field>
          <Form.TextArea
            label="Description"
            type="text"
            placeholder="Tell us about your journey..."
            onChange={this.changeDescription}
            value={journey.description}
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
