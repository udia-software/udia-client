import React from "react";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Header,
  List,
  Loader,
  Popup
} from "semantic-ui-react";
import moment from "moment";
import FromTime from "../Static/FromTime";
import Logo from "../Static/Logo";
import UdiaOfficeMap from "../Static/UdiaOfficeMap";

export const Contact = () => {
  document.title = "Contact - UDIA";
  const inverted = true;
  const ALEXANDER_WONG_UDIA_DATE = new moment(
    "23-02-2016 12:14 -07:00",
    "DD-MM-YYYY HH:mm ZZ",
    true
  );
  return (
    <div style={{ flex: 1 }}>
      <Container>
        <Header as="h2" inverted={inverted}>
          <Header.Content>Contact</Header.Content>
        </Header>
        <p>
          Headquarters is located in the Startup Edmonton office. The best way
          to contact UDIA is through email.
        </p>
      </Container>
      <UdiaOfficeMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDjl_3CluAMqehsXlE0FNZ1OR4m9nmVi9I"
        loadingElement={
          <Dimmer.Dimmable
            style={{ height: `400px`, padding: `15px 0px` }}
            dimmed
          >
            <Dimmer active>
              <Loader active />
            </Dimmer>
          </Dimmer.Dimmable>
        }
        containerElement={
          <div style={{ height: `400px`, padding: `15px 0px` }} />
        }
        mapElement={<div style={{ height: `100%` }} />}
      />
      <Container>
        <Card.Group textAlign="center" stackable={true} itemsPerRow={2}>
          <Card fluid>
            <div
              className="ui centered"
              style={{
                position: "relative",
                display: "block",
                flex: "0 0 auto",
                padding: "0",
                textAlign: "center"
              }}
            >
              <Logo maxHeight={180} />
            </div>
            <Card.Content>
              <Card.Header>Alexander Wong</Card.Header>
              <Card.Meta>
                <Popup
                  inverted
                  wide
                  position="right center"
                  content={
                    "Founded UDIA on " +
                    ALEXANDER_WONG_UDIA_DATE.format(
                      "dddd, MMMM Do, YYYY HH:mm a ZZ"
                    ) +
                    "."
                  }
                  on="hover"
                  trigger={
                    <span className="date">
                      Founder; <FromTime time={ALEXANDER_WONG_UDIA_DATE} /> duty
                      served.
                    </span>
                  }
                />
              </Card.Meta>
              <Card.Description>
                Alexander is a software developer contractor. He is currently on
                a contract for EPCOR as a Systems Analyst. UDIA is an ongoing
                sideproject involving neural networks, particularly deep
                learning applications like generative adversarial networks.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button
                as="a"
                href="https://www.alexander-wong.com/"
                animated="fade"
                attached="bottom"
              >
                <Button.Content visible>Personal Domain</Button.Content>
                <Button.Content hidden>alexander-wong.com</Button.Content>
              </Button>
            </Card.Content>
          </Card>

          <Card fluid>
            <div
              className="ui centered"
              style={{
                backgroundColor: "#000",
                position: "relative",
                display: "block",
                flex: "0 0 auto",
                padding: "0",
                textAlign: "center"
              }}
            >
              <Logo
                maxHeight={180}
                inverted={true}
                style={{ backgroundColor: "#000" }}
              />
            </div>
            <Card.Content>
              <List link size="large">
                <List.Item>
                  <List.Icon name="marker" />
                  <List.Content>
                    <List.Header>Udia Software Incorporated</List.Header>
                    <List.Description
                      as="a"
                      href="https://goo.gl/maps/sXheMfn7PRE2"
                    >
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
            </Card.Content>
          </Card>
        </Card.Group>
      </Container>
    </div>
  );
};

export default Contact;
