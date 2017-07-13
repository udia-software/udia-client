import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Container, Form, Header, Input } from "semantic-ui-react";
import Error from "../Shared/Error";
import { clearError, registerRequest } from "../../actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlySending: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  location: PropTypes.shape({
    state: PropTypes.shape({})
  }),
  currentUser: PropTypes.object
};

const defaultProps = {
  currentlySending: false,
  error: "",
  location: { state: {} }
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.props.dispatch(clearError());
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      registerRequest({
        username: this.state.username,
        password: this.state.password
      })
    );
  };

  changeUsername = event => {
    this.setState({ username: event.target.value });
  };

  changePassword = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { username, password } = this.state;
    const { currentUser, currentlySending, error } = this.props;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const loggedIn = !!Object.keys(currentUser || {}).length;
    if (loggedIn) return <Redirect to={from} />;

    return (
      <Container>
        <Header as="h2">Sign Up</Header>
        <Form
          onSubmit={this.onSubmit}
          loading={currentlySending}
          error={!!error}
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
          <Error error={error} header="Sign Up Failed!" />
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    );
  }
}

Signup.propTypes = propTypes;
Signup.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    ...state.auth,
    error: state.api.error,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(Signup);