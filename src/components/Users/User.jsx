import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header } from "semantic-ui-react";
import { getUserByUsername } from '../../actions';

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsername(username));
  }
  render = () => {
    const { username, inserted_at, updated_at } = this.props;
    return (
      <Container>
        <Header as='h2'>{username}</Header>
        {inserted_at} {' | '}
        {updated_at}
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps)(User);
