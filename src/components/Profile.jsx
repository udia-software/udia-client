import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';

const propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

class Profile extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <Container text>
        <Header as ="h2">Profile</Header>
        <p>ID: { currentUser.id }</p>
        <p>Username: { currentUser.username }</p>
        <p>Email: { currentUser.email || 'No Email Provided!' }</p>
      </Container>
    );
  }
}

Profile.propTypes = propTypes;

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Profile);
