import React from "react";
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

export const SignUp = () => {
  document.title = "Sign Up - UDIA";
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
        style={{ ...WHITE_TEXT_STYLE, textAlign: "center" }}
        size="huge"
      >
        <Header>Sign Up</Header>
        <Form>
          <Form.Field>
            <label style={WHITE_TEXT_STYLE}>EMAIL</label>
            <Popup
              style={{ textAlign: "center" }}
              trigger={<input placeholder="u@di.ca" />}
              header="Email"
              content="This is kept hidden from other users."
              on="focus"
              position="top center"
            />
          </Form.Field>
          <Form.Field inline>
            <label style={WHITE_TEXT_STYLE}>USERNAME</label>
            <Popup
              trigger={<input placeholder="UDIA" />}
              header="Username"
              content="This is your public facing ID."
              on="focus"
              position="left center"
              style={{ textAlign: "right" }}
            />
          </Form.Field>
          <Form.Field inline>
            <Popup
              trigger={
                <input
                  style={{ textAlign: "right" }}
                  placeholder=""
                  type="password"
                />
              }
              style={{ textAlign: "left" }}
              header="Password"
              content="Secret! Don't tell anyone!"
              on="focus"
              position="right center"
            />
            <label style={WHITE_TEXT_STYLE}>PASSWORD</label>
          </Form.Field>
          <Form.Field>
            <Checkbox label={<label style={WHITE_TEXT_STYLE}>Hi.</label>} />
          </Form.Field>
          <Button type="submit" inverted={inverted} fluid>Submit</Button>
        </Form>
        <List inverted={inverted} link>
          <List.Item as={Link} to="/signin">Sign In</List.Item>
        </List>
      </Segment>
    </Container>
  );
};
export default SignUp;
