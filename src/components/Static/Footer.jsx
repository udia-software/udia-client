import React from "react";
import { Link } from "react-router-dom";
import { Grid, Header, List, Segment } from "semantic-ui-react";
import { animateScroll } from "react-scroll";
import Logo from "./Logo";

export const Footer = () => {
  const inverted = true;
  return (
    <Segment color="black" inverted={inverted} padded={true}>
      <Grid centered columns="equal">
        <Grid.Row centered columns="equal">
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Header as="h4" inverted={inverted} style={{ textAlign: "left" }}>
              Udia Software Incorporated
            </Header>
            <List inverted={inverted} link>
              <List.Item
                as="a"
                href="https://goo.gl/maps/sXheMfn7PRE2"
                style={{ textAlign: "left" }}
              >
                Unit 301 - 10359 104 Street NW <br />
                Edmonton, AB T5J1B9 <br />
                Canada
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column
            onClick={() => animateScroll.scrollToTop()}
            mobile={16}
            tablet={4}
            computer={4}
            style={{ textAlign: "center" }}
          >
            <Logo maxHeight={80} inverted={inverted} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Header as="h4" inverted={inverted} style={{ textAlign: "right" }}>
              Links
            </Header>
            <List inverted={inverted} link style={{ textAlign: "right" }}>
              <List.Item as={Link} to="/">Home</List.Item>
              <List.Item as={Link} to="/contact">Contact</List.Item>
              <List.Item as={Link} to="/lesson">Fundamental Lesson</List.Item>
              </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default Footer;
