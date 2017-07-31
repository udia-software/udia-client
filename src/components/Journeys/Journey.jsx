import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Segment
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import { getJourneyRequest } from "../../modules/journey/sagas.actions";
import { setJourney, clearJourneyError } from "../../modules/journey/reducer.actions";
import { getPostsRequest } from "../../modules/posts/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired
};

class Journey extends Component {
  componentWillMount = () => {
    const journeyId = this.props.match.params.id;
    this.props.dispatch(getJourneyRequest({ id: journeyId }));
    this.props.dispatch(getPostsRequest({
      page: 1,
      journey_id: journeyId
    }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setJourney({}));
    this.props.dispatch(clearJourneyError());
  };

  render = () => {
    const { 
      sendingJourneyRequest, 
      journeyRequestError, 
      journey,
      posts 
    } = this.props;

    return (
      <Container>
        <Segment loading={sendingJourneyRequest}>
          {journey.id &&
            <div>
              
            </div>
          }
        </Segment>
      </Container>
    );
  };
}

Journey.propTypes = propTypes;

function mapStateToProps(state) {
  return Object.assign({}, state.journey, state.posts);
}

export default connect(mapStateToProps)(Journey);