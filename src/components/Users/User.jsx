import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Dimmer, Header, List, Loader } from "semantic-ui-react";
import moment from "moment";
import { getUserByUsernameRequest } from "../../modules/user/actions";
import Error from "../Shared/Error";

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsernameRequest(username));
  };
  render = () => {
    const {
      user,
      currentlySending,
      error
    } = this.props;
    return (
      <Container>
        <Error error={error} header="Get User Failed!" />
        <Dimmer active={currentlySending} inverted>
          <Loader />
        </Dimmer>
        {user.username &&
          <div>
            <Header as="h2">{user.username}</Header>
            <List>
              <List.Item>
                <List.Header>Created At</List.Header>
                <List.Description>
                  {moment(user.inserted_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </List.Description>
              </List.Item>
              <List.Item>
                <List.Header>Updated At</List.Header>
                <List.Description>
                  {moment(user.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </List.Description>
              </List.Item>
            </List>
          </div>}
      </Container>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.user,
    currentlySending: state.api.currentlySending,
    error: state.api.error
  };
}

export default connect(mapStateToProps)(User);
