import React from "react";
import { Link } from "react-router-dom";
import { Grid, Header, List, Segment } from "semantic-ui-react";
import Logo from "./Logo";

export const Footer = () => {
  const inverted = true;
  return (
    <Segment color="black" inverted={inverted} padded={true}>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Header as="h4" inverted={inverted}>Links</Header>
            <List inverted={inverted} link>
              <List.Item as={Link} to="/contact">Contact</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={3} computer={3}>
            <Logo maxHeight={80} inverted={inverted} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={7} computer={7}>
            <Header as="h4" inverted={inverted}>
              Udia Software Incorporated
            </Header>
            <List inverted={inverted} link>
              <List.Item as="a" href="https://goo.gl/maps/sXheMfn7PRE2">
                Unit 301 - 10359 104 Street NW <br />
                Edmonton, AB T5J1B9 <br />
                Canada
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default Footer;
