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
import { createJourneyRequest } from "../../modules/journey/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  start_date: PropTypes.object.isRequired,
  end_date: PropTypes.object
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

  changeStartDate = date => {
    this.props.dispatch(setJourneyStartDate(date));
    this.props.dispatch(clearJourneyError());
  }

  changeEndDate = date => {
    const { start_date } = this.props;
    if (date < start_date) {
      this.props.dispatch(setJourneyStartDate(date));
    }
    this.props.dispatch(setJourneyEndDate(date));
    this.props.dispatch(clearJourneyError());
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      createJourneyRequest({
        title: this.props.title,
        description: this.props.description,
        start_date: this.props.start_date,
        end_date: this.props.end_date
      })
    );
  };

  toggleEndDateCheckbox = () => {
    const { end_date } = this.props;
    end_date ? this.props.dispatch(setJourneyEndDate(null)) : this.props.dispatch(setJourneyEndDate(new Date()));
  }

  render = () => {
    const {
      journey,
      title,
      start_date,
      end_date,
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
            value={title}
          />
          <Form.Field>
            <Grid columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label>Start Date</label>
                  <DatePicker
                    selected={moment(start_date)}
                    onChange={this.changeStartDate}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>End Date</label>
                  {!end_date &&
                    <Checkbox
                      label="Present"
                      checked={end_date === null}
                      onChange={this.toggleEndDateCheckbox}
                    />
                  }
                  {end_date &&
                    <DatePicker
                      selected={moment(end_date)}
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
