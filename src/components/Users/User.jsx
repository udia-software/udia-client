import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Dimmer, Header, List, Loader } from "semantic-ui-react";
import moment from "moment";
import { getUserByUsernameRequest } from "../../modules/user/sagas.actions";
import Error from "../Shared/Error";

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

  render = () => {
    const { user, currentlyGettingUser, userRequestError } = this.props;
    return (
      <Container>
        <Error error={userRequestError} header="Get User Failed!" />
        <Dimmer active={currentlyGettingUser} inverted>
          <Loader />
        </Dimmer>
        {user.username &&
          <div>
            <Header as="h2">{user.username}</Header>
            <List>
              <List.Item>
                <List.Header>Created At</List.Header>
                <List.Description>
                  {moment(user.inserted_at).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </List.Description>
              </List.Item>
              <List.Item>
                <List.Header>Updated At</List.Header>
                <List.Description>
                  {moment(user.updated_at).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </List.Description>
              </List.Item>
            </List>
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
