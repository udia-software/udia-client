import React from "react";
import { Container, Header, List } from "semantic-ui-react";

export const Contact = () => {
  document.title = "Contact - UDIA";
  return (
    <Container>
      <Header as="h2">
        <Header.Content>Contact</Header.Content>
      </Header>
      <p>Headquarters is located in the Startup Edmonton office. The best way to contact UDIA is through email.</p>
      <List link size="large">
        <List.Item>
          <List.Icon name="marker" />
          <List.Content>
            <List.Header>Udia Software Incorporated</List.Header>
            <List.Description as="a" href="https://goo.gl/maps/sXheMfn7PRE2">
              Unit 301 - 10359 104 Street NW <br />
              Edmonton, AB T5J1B9 <br />
              Canada
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="mail outline" />
          <List.Content>
            <List.Header>Email</List.Header>
            <List.Description as="a" href="mailto:admin@udia.ca">
              admin@udia.ca
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="phone" />
          <List.Content>
            <List.Header>Phone</List.Header>
            <List.Description as="a" href="tel:17809996174">
              +1 780 999 6174
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
    </Container>
  );
};

export default Contact;
