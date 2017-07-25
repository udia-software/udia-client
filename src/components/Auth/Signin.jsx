import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Button, Container, Form, Header, Input } from "semantic-ui-react";
import Error from "../Shared/Error";
import { loginRequest } from "../../modules/auth/sagas.actions";
import {
  clearAuthError,
  setUsername,
  setPassword
} from "../../modules/auth/reducer.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingAuthRequest: PropTypes.bool.isRequired,
  authError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  currentUser: PropTypes.object,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

class Signin extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(clearAuthError());
  }

  onSubmit = event => {
    event.preventDefault();
    const { dispatch, username, password } = this.props;
    dispatch(loginRequest({ username, password }));
  };

  changeUsername = event => {
    const { dispatch } = this.props;
    dispatch(setUsername(event.target.value));
  };

  changePassword = event => {
    const { dispatch } = this.props;
    dispatch(setPassword(event.target.value));
  };

  render = () => {
    const {
      sendingAuthRequest,
      authError,
      currentUser,
      username,
      password
    } = this.props;

    const loggedIn = !!Object.keys(currentUser || {}).length;
    if (loggedIn) return <Redirect to={"/"} />;

    return (
      <Container>
        <Header as="h2">Sign In</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={sendingAuthRequest}
          error={!!authError}
        >
          <Form.Field>
            <Input
              label="Username"
              type="text"
              placeholder="username"
              onChange={this.changeUsername}
              value={username}
            />
          </Form.Field>
          <Form.Field>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              onChange={this.changePassword}
              value={password}
            />
          </Form.Field>
          <Error header="Sign in failed!" error={authError} />
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    );
  };
}

Signin.propTypes = propTypes;

function mapStateToProps(state) {
  return { ...state.auth };
}

export default connect(mapStateToProps)(Signin);
