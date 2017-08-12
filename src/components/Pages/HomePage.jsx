import React from "react";
import { connect } from "react-redux";
import { Grid, Segment, Label, Container } from "semantic-ui-react";
import PostList from "../Posts/PostList";
import JourneyList from "../Journeys/JourneyList";

const HomePage = auth => {
  const { currentUser } = auth;
  const loggedIn = !!Object.keys(currentUser || {}).length;

  return (
    <Container>
      <Grid stackable reversed="mobile vertically" columns={loggedIn ? 2 : 1}>
        <Grid.Column>
          <PostList />
        </Grid.Column>
        {loggedIn &&
          <Grid.Column>
            <Segment>
              <Label color="blue" ribbon="right">My Journeys</Label>
              <JourneyList user={currentUser} />
            </Segment>
          </Grid.Column>}
      </Grid>
    </Container>
  );
};

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(HomePage);
