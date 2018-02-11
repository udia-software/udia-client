import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Button,
  Container,
  Form,
  Header,
  Input,
  List,
  Popup,
  Segment
} from "semantic-ui-react";
import { isAuthenticated, authActions } from "../../modules/auth";
import { SIGN_IN_MUTATION } from "../../constants";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailErrors: [],
      passwordErrors: [],
      loading: false
    };
  }

  componentDidMount() {
    const { isAuthenticated, history } = this.props;
    if (isAuthenticated) {
      history.push(`/`);
    }
  }

  _changeFormEmail = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  _changeFormPassword = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] });
  };

  _submit = async event => {
    event.preventDefault();
    const { email, password, dispatch, history } = this.props;
    this.setState({ loading: true });
    try {
      const result = await this.props.signInUserMutation({
        variables: { email, password }
      });
      const { user, token } = result.data.signinUser;
      dispatch(authActions.setAuthData({ user, jwt: token }));
      history.push(`/`);
    } catch (err) {
      console.error(err);
      (err.graphQLErrors || []).forEach(graphqlError => {
        let { email, rawPassword } = graphqlError.state;
        this.setState({
          emailErrors: email,
          passwordErrors: rawPassword
        });
      });
      this.setState({ loading: false });
    }
  };

  render() {
    document.title = "Sign In - UDIA";
    const inverted = true;
    const WHITE_TEXT_STYLE = inverted
      ? { color: "rgba(255,255,255,0.9)" }
      : null;
    const { email, password } = this.props;
    const { emailErrors, passwordErrors, loading } = this.state;
    const emailError = emailErrors && emailErrors.length > 0;
    const passwordError = passwordErrors && passwordErrors.length > 0;

    return (
      <Container
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Segment
          inverted={inverted}
          style={WHITE_TEXT_STYLE}
          circular
          size="huge"
        >
          <Header>Sign In</Header>
          <Form
            onSubmit={this._submit}
            error={emailError || passwordError}
            inverted={inverted}
            loading={loading}
          >
            <Form.Field>
              <label style={WHITE_TEXT_STYLE}>EMAIL</label>
              <Popup
                trigger={
                  <Input
                    placeholder="u@di.ca"
                    onChange={this._changeFormEmail}
                    value={email}
                    error={emailError}
                    icon={emailError ? { name: "warning" } : null}
                  />
                }
                style={{ textAlign: "center" }}
                header="Email"
                content={emailError ? emailErrors[0] : "Who are you?"}
                on="focus"
                position="top center"
              />
            </Form.Field>
            <Form.Field>
              <label style={WHITE_TEXT_STYLE}>PASSWORD</label>
              <Popup
                trigger={
                  <Input
                    placeholder="••••••••"
                    type="password"
                    style={{ textAlign: "right" }}
                    onChange={this._changeFormPassword}
                    value={password}
                    error={passwordError}
                    icon={passwordError ? { name: "warning" } : null}
                  />
                }
                style={{ textAlign: "center" }}
                header="Password"
                content={
                  passwordError ? passwordErrors[0] : "How do I know it's you?"
                }
                on="focus"
                position="top center"
              />
            </Form.Field>
            <Button type="submit" inverted={inverted} fluid>
              Submit
            </Button>
          </Form>
          <List inverted={inverted} link>
            <List.Item as={Link} to="/signup">
              Sign Up
            </List.Item>
          </List>
        </Segment>
      </Container>
    );
  }
}

SignIn.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state),
    email: state.auth.email,
    password: state.auth.password
  };
}

export default connect(mapStateToProps)(
  compose(graphql(SIGN_IN_MUTATION, { name: "signInUserMutation" }))(SignIn)
);
