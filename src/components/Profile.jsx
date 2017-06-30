import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';

const propTypes = {
  currentUser: PropTypes.shape({
    inserted_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

class Profile extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <Container text>
        <Header as ="h2">Profile</Header>
        <p>Created At: { currentUser.inserted_at }</p>
        <p>Updated At: { currentUser.updated_at }</p>
        <p>Username: { currentUser.username }</p>
      </Container>
    );
  }
}

Profile.propTypes = propTypes;

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Profile);
