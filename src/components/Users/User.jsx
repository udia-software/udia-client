import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Dimmer, Header, Loader } from "semantic-ui-react";
import { setUser } from "../../modules/user/reducer.actions";
import { getUserByUsernameRequest } from "../../modules/user/sagas.actions";
import Error from "../Shared/Error";
import JourneyList from "../Journeys/JourneyList";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingUser: PropTypes.bool.isRequired,
  userRequestError: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  user: PropTypes.object.isRequired
};

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsernameRequest({ username }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setUser({}));
  }

  render = () => {
    const { user, currentlyGettingUser, userRequestError } = this.props;
    return (
      <Container style={{marginTop: '30px'}}>
        <Error error={userRequestError} header="Get User Failed!" />
        <Dimmer active={currentlyGettingUser} inverted>
          <Loader />
        </Dimmer>
        {user.username &&
          <div>
            <Header as="h2" textAlign="center">{user.username}</Header>
            <JourneyList />
          </div>}
      </Container>
    );
  };
}

User.propTypes = propTypes;

function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(User);
