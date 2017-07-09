import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getUsersRequest } from '../../actions';

class ListUsers extends Component {
  componentWillMount() {
    this.props.dispatch(getUsersRequest());
  }
  render = () => {
    return (
      <Container>
        <Header as='h2'>All Users</Header>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(ListUsers);
