import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Dimmer,
  Item,
  Loader,
  Visibility
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import { getJourneysRequest } from "../../modules/journeys/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingJourneys: PropTypes.bool.isRequired,
  journeysRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journeysPagination: PropTypes.object.isRequired,
  journeys: PropTypes.array.isRequired
};

class JourneyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false
    };
    this.props.dispatch(getJourneysRequest({ page: 1 }));
  }

  getNextPage = () => {
    const { page_number, total_pages } = this.props.journeysPagination;
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(getJourneysRequest({ page: page_number + 1 }));
    }
  };

  onVisibilityUpdate = (e, { calculations }) => {
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage();
    }
  };

  componentWillReceiveProps = nextProps => {
    const { page_number, total_pages } = nextProps.journeysPagination;
    if (page_number >= 1 && page_number === total_pages) {
      this.setState({ endOfFeed: true });
    }
  };

  render = () => {
    const { currentlyGettingJourneys, journeys, journeysRequestError } = this.props;
    const { endOfFeed } = this.state;

    return (
      <Container style={{margin: '30px'}}>
        <Visibility onUpdate={this.onVisibilityUpdate}>
          <Item.Group>
            {journeys.map(journey => (
              <Item key={journey.id}>
                <Item.Content>
                  <Item.Header as={Link} to={`/journeys/${journey.id}`}>{journey.title}</Item.Header>
                  <Item.Meta>{journey.description}</Item.Meta>
                  <Item.Extra>Created on {moment(journey.inserted_at).format('MMMM Do YYYY')}</Item.Extra>
                </Item.Content>
              </Item>
            ))}
            <Dimmer active={currentlyGettingJourneys} inverted>
              <Loader />
            </Dimmer>
          </Item.Group>
        </Visibility>
        <Error error={journeysRequestError} header="Get Journeys Failed!" />
      </Container>
    );
  };
}

JourneyList.propTypes = propTypes;

function mapStateToProps(state) {
  return state.journeys;
}

export default connect(mapStateToProps)(JourneyList);
