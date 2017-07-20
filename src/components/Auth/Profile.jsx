import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Container, Header, List } from "semantic-ui-react";
import moment from "moment";
import { logoutRequest } from "../../modules/auth/sagas.actions";

const propTypes = {
  currentUser: PropTypes.shape({
    inserted_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired
};

class Profile extends Component {
  handleSignOut = () => {
    this.props.dispatch(logoutRequest());
  };

  render() {
    const { currentUser } = this.props;
    return (
      <Container>
        <Header as="h2">My Profile</Header>
        <List>
          <List.Item>
            <List.Header>Username</List.Header>
            <List.Description>
              {currentUser.username}
            </List.Description>
          </List.Item>
          <List.Item>
            <List.Header>Created At</List.Header>
            <List.Description>
              {moment(currentUser.inserted_at).format(
                "dddd, MMMM Do YYYY, h:mm:ss a"
              )}
            </List.Description>
          </List.Item>
          <List.Item>
            <List.Header>Updated At</List.Header>
            <List.Description>
              {moment(currentUser.updated_at).format(
                "dddd, MMMM Do YYYY, h:mm:ss a"
              )}
            </List.Description>
          </List.Item>
        </List>
        <p>TODO: email, password change, etc.</p>
        <Button onClick={this.handleSignOut}>
          Sign Out
        </Button>
      </Container>
    );
  }
}

Profile.propTypes = propTypes;

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(Profile);
