import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Dimmer, Header, List, Loader } from "semantic-ui-react";
import moment from "moment";
import { getUserByUsername } from "../../actions";

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsername(username));
  };
  render = () => {
    const { username, inserted_at, updated_at, currentlySending } = this.props;
    return (
      <Container>
        <Dimmer active={currentlySending} inverted>
          <Loader />
        </Dimmer>
        <Header as="h2">{username}</Header>
        <List>
          <List.Item>
            <List.Header>Created At</List.Header>
            <List.Description>
              {moment(inserted_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </List.Description>
          </List.Item>
          <List.Item>
            <List.Header>Updated At</List.Header>
            <List.Description>
              {moment(updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </List.Description>
          </List.Item>
        </List>
      </Container>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.user,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(User);
