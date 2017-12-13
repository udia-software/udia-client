import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import {
  Button,
  Checkbox,
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
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  understoodLesson: PropTypes.bool.isRequired
};

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameErrors: [],
      emailErrors: [],
      passwordErrors: [],
      loading: false
    }
  }

  _changeFormEmail = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] })
  }

  _changeFormUsername = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormUsername(event.target.value));
    this.setState({ usernameErrors: [] })
  }

  _changeFormPassword = event => {
    const { dispatch } = this.props;
    dispatch(authActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] })
  }

  _changeFormUnderstoodLesson = event => {
    const { dispatch, understoodLesson } = this.props;
    dispatch(authActions.setUnderstoodLesson(!understoodLesson));
  }

  _submit = async event => {
    event.preventDefault();
    const { username, email, password } = this.props;
    this.setState({ loading: true });
    try {
      const result = await this.props.createUserMutation({
        variables: { username, email, password }
      });
      const { user, token } = result.data.createUser;
      // todo persist token
      console.log(user, token)
    } catch (err) {
      console.error(err);
      (err.graphQLErrors || []).forEach(graphqlError => {
        let { username, email, password } = graphqlError.state
        this.setState({
          usernameErrors: username,
          emailErrors: email,
          passwordErrors: password
        })
      });
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const inverted = true;
    const WHITE_TEXT_STYLE = inverted ? { color: "rgba(255,255,255,0.9)" } : null;
    document.title = "Sign Up - UDIA";

    const { email, username, password, understoodLesson } = this.props;
    const { usernameErrors, emailErrors, passwordErrors } = this.state;

    const emailError = emailErrors && emailErrors.length > 0
    const usernameError = usernameErrors && usernameErrors.length > 0
    const passwordError = passwordErrors && passwordErrors.length > 0

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
          style={{ ...WHITE_TEXT_STYLE, textAlign: "center" }}
          size="huge"
        >
          <Header>Sign Up</Header>
          <Form
            onSubmit={this._submit}
            error={emailError || usernameError || passwordError}
            inverted={inverted}>
            <Form.Field>
              <label style={WHITE_TEXT_STYLE}>EMAIL</label>
              <Popup
                trigger={
                  <Input
                    placeholder="u@di.ca"
                    onChange={this._changeFormEmail}
                    value={email}
                    error={emailError}
                    icon={emailError ? { name: 'warning' } : null}
                  />}
                header="Email"
                content={emailError ? emailErrors[0] : "This is kept hidden from other users."}
                on="focus"
                position="top center"
              />
            </Form.Field>
            <Form.Field inline>
              <label style={WHITE_TEXT_STYLE}>USERNAME</label>
              <Popup
                trigger={
                  <Input
                    placeholder="UDIA"
                    onChange={this._changeFormUsername}
                    value={username}
                    error={usernameError}
                    icon={usernameError ? { name: 'warning' } : null}
                  />}
                header="Username"
                content={usernameError ? usernameErrors[0] : "This is your public facing ID."}
                on="focus"
                position="left center"
                style={{ textAlign: "right" }}
              />
            </Form.Field>
            <Form.Field inline>
              <Popup
                trigger={
                  <Input
                    style={{ textAlign: "right" }}
                    placeholder="••••••••"
                    type="password"
                    onChange={this._changeFormPassword}
                    value={password}
                    error={passwordError}
                    icon={passwordError ? { name: 'warning' } : null}
                  />
                }
                style={{ textAlign: "left" }}
                header="Password"
                content={passwordError ? passwordErrors[0] : "Secret! Don't tell anyone!"}
                on="focus"
                position="right center"
              />
              <label style={WHITE_TEXT_STYLE}>PASSWORD</label>
            </Form.Field>
            <Form.Field>
              <Checkbox
                checked={understoodLesson}
                onChange={this._changeFormUnderstoodLesson}
                label={
                  <label style={WHITE_TEXT_STYLE}>I have understood
                  the <Link to="/lesson">fundamental lesson</Link>.</label>
                }
              />
            </Form.Field>
            <Button
              type="submit"
              inverted={inverted}
              disabled={!understoodLesson}
              fluid
            >
              {understoodLesson ? "Submit" : "Observe the lesson."}
            </Button>
          </Form>
          <List inverted={inverted} link>
            <List.Item as={Link} to="/signin">Sign In</List.Item>
          </List>
        </Segment>
      </Container>
    );
  }
}

SignUp.propTypes = propTypes;

const CREATE_USER_MUTATION = gql`
mutation CreateUserMutation($email: String!, $password: String!, $username: String!) {
  createUser(
    email: $email,
    username: $username,
    password: $password
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
    username: state.auth.username,
    password: state.auth.password,
    understoodLesson: state.auth.understoodLesson,
    error: state.auth.error
  };
}

export default connect(mapStateToProps)(compose(
  graphql(CREATE_USER_MUTATION, { name: "createUserMutation" }),
)(SignUp));
