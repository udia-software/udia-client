import React from "react";
import {
  Grid,
  Segment,
  Label,
  Container
} from "semantic-ui-react";
import PostList from "../Posts/PostList";
import JourneyList from "../Journeys/JourneyList";

const HomePage = () => (
  <Container>
    <Grid columns={2}>
      <Grid.Column>
        <PostList />
      </Grid.Column>
      <Grid.Column>
        <Segment>
          <Label color='blue' ribbon='right'>My Journeys</Label>
          <JourneyList />
        </Segment>
      </Grid.Column>
    </Grid>
  </Container>
);

export default HomePage;