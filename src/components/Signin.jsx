import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { clearError, loginRequest } from "../actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlySending: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.shape({
    state: PropTypes.shape({})
  }),
  loggedIn: PropTypes.bool.isRequired,
};

const defaultProps = {
  currentlySending: false,
  error: "",
  location: { state: {} },
};

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.props.dispatch(clearError());
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch(loginRequest({
      username: this.state.username,
      password: this.state.password,
    }));
  }

  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  render = () => {
    const { username, password } = this.state;
    const { currentlySending, error } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (this.props.loggedIn) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <h2>Sign In</h2>
        <Form onSubmit={this.onSubmit} loading={currentlySending} error={!!error}>
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
          {!!error && <Message
            error={!!error}
            header={'Sign In Failed'}
            content={error}
          />}
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

Signin.propTypes = propTypes;
Signin.defaultProps = defaultProps;

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(Signin);
