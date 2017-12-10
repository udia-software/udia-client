import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gql from "graphql-tag";
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
import { authActions } from "../../modules/auth/actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailErrors: [],
      passwordErrors: [],
    }
  }

  _changeFormEmail = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] })
  }

  _changeFormPassword = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] })
  }

  _submit = async event => {
    event.preventDefault();
    const { email, password } = this.props
    try {
      const result = await this.props.signInUserMutation({
        variables: { email, password }
      });
      const { user, token } = result.data.createUser;
      // todo persist token
      console.log(user, token)
    } catch (err) {
      console.error(err);
      (err.graphQLErrors || []).forEach(graphqlError => {
        let { email, password } = graphqlError.state;
        this.setState({
          emailErrors: email,
          passwordErrors: password
        });
      })
    }
  }

  render() {
    document.title = "Sign In - UDIA";
    const inverted = true;
    const WHITE_TEXT_STYLE = inverted ? { color: "rgba(255,255,255,0.9)" } : null;
    const { email, password } = this.props;
    const { emailErrors, passwordErrors } = this.state;

    const emailError = emailErrors && emailErrors.length > 0
    const passwordError = passwordErrors && passwordErrors > 0

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
          >
            <Form.Field>
              <label style={WHITE_TEXT_STYLE}>EMAIL</label>
              <Popup
                trigger={<Input
                  placeholder="u@di.ca"
                  onChange={this._changeFormEmail}
                  value={email}
                  error={emailError}
                  icon={emailError ? { name: 'warning' } : null}
                />}
                style={{ textAlign: 'center' }}
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
                    style={{ textAlign: 'right' }}
                    onChange={this._changeFormPassword}
                    value={password}
                    error={passwordError}
                    icon={passwordError ? { name: 'warning' } : null}
                  />
                }
                style={{ textAlign: 'center' }}
                header="Password"
                content={passwordError ? passwordErrors[0] : "How do I know it's you?"}
                on="focus"
                position="top center"
              />
            </Form.Field>
            <Button type="submit" inverted={inverted} fluid>Submit</Button>
          </Form>
          <List inverted={inverted} link>
            <List.Item as={Link} to="/signup">Sign Up</List.Item>
          </List>
        </Segment>
      </Container>
    );
  };
}

SignIn.propTypes = propTypes;

const SIGN_IN_MUTATION = gql`
mutation SignInMutation($email: String!, $password: String!) {
  signinUser(
    email: {
      email: $email,
      password: $password  
    }
  ) {
    token
    user {
      _id
    }
  }
}
`;

function mapStateToProps(state) {
  return {
    email: state.auth.email,
    password: state.auth.password,
  };
}

export default connect(mapStateToProps)(compose(
  graphql(SIGN_IN_MUTATION, { name: "signInUserMutation" }),
)(SignIn));
