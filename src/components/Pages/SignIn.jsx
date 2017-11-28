import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Checkbox,
  Container,
  Form,
  Header,
  List,
  Segment
} from "semantic-ui-react";

export const SignIn = () => {
  document.title = "Sign In - UDIA";
  const inverted = true;
  const WHITE_TEXT_STYLE = inverted ? { color: "rgba(255,255,255,0.9)" } : null;
  // TODO: right text align the input element blinker on Password
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
        <Form>
          <Form.Field inline>
            <label style={WHITE_TEXT_STYLE}>USERNAME</label>
            <input placeholder="UDIA" />
          </Form.Field>
          <Form.Field inline>
            <input placeholder="" type="password" style={{textAlign: "right"}}/>
            <label style={WHITE_TEXT_STYLE}>PASSWORD</label>
          </Form.Field>
          <Form.Field>
            <Checkbox label={<label style={WHITE_TEXT_STYLE}>Hi.</label>} />
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
export default SignIn;
