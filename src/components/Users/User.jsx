import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Dimmer, Header, List, Loader } from "semantic-ui-react";
import moment from "moment";
import { getUserByUsername } from "../../actions";
import Error from "../Shared/Error";

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsername(username));
  };
  render = () => {
    const {
      username,
      inserted_at,
      updated_at,
      currentlySending,
      error
    } = this.props;
    return (
      <Container>
        <Error error={error} header="Get User Failed!" />
        <Dimmer active={currentlySending} inverted>
          <Loader />
        </Dimmer>
        {username &&
          <div>
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
