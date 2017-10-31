import React from "react";
import {
  Button,
  Container,
  Divider,
  Flag,
  Grid,
  Header,
  Icon,
  Segment
} from "semantic-ui-react";
import Logo from "../Static/Logo";

export const Home = () => {
  document.title = "UDIA";
  return (
    <div>
      <Segment vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={10}>
              <Header as="h3">
                Manifestation of the Four Definitions of Self
              </Header>
              <p>
                UDIA is the understanding that self is simultaneously being one with the universe, being one with your
                opposites, being one with your identity, and being one with awareness.
              </p>
              <Header as="h3">
                Self-Reflection
              </Header>
              <p>
                Existence is a search problem. We are constantly performing self-reflection in search of meaning.
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center" width={6}>
              <Logo maxHeight={200} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "0em" }} vertical>
        <Grid celled="internally" columns="equal" stackable>
          <Grid.Row textAlign="center">
            <Grid.Column style={{ paddingBottom: "3em", paddingTop: "3em" }}>
              <Header as="h3">
                Universe
              </Header>
              <p>You are the Universe.</p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: "3em", paddingTop: "3em" }}>
              <Header as="h3">
                Diametric
              </Header>
              <p>You are the opposite of me.</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Grid.Column style={{ paddingBottom: "3em", paddingTop: "3em" }}>
              <Header as="h3">
                Identity
              </Header>
              <p>You are an individual.</p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: "3em", paddingTop: "3em" }}>
              <Header as="h3">
                Awareness
              </Header>
              <p>You are aware.</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h2">
            Mission
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Meaning in life is something that is found through existence. It is something that comes when one learns
            themselves. It does not matter what one expects from life, but rather what matters is what life expects from
            us. It means taking the responsibility to find the right answer to life's problems and to fulfill the tasks
            which life relentlessly sets for each individual.
          </p>
          <p style={{ fontSize: "1.33em" }}>
            Meaning in life can be measured using software and intelligent machine learning algorithms.
          </p>
          <p style={{ fontSize: "1.33em" }}>
            A ledger of tracked pursuit of meaning in life can be used to represent an individual in their entirety.
          </p>
        </Container>
      </Segment>
    </div>
  );
};

export default Home;
