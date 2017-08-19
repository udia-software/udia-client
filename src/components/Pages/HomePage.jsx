import React from "react";
import { connect } from "react-redux";
import { Grid, Segment, Label, Container } from "semantic-ui-react";
import PostList from "../Posts/PostList";
import JourneyList from "../Journeys/JourneyList";

import { getPresignedUrl } from '../../modules/upload/api';

class HomePage extends React.Component {

  constructor() {
    super();
    this.state = {
      signedRequest: {}
    };
  }

  getSignedUrl = (file, callback) => {
    getPresignedUrl(file.name, file.type)
      .then(data => {
        this.setState({ signedRequest: data.credentials })
        callback({ signedUrl: data.url });
      })
  }

  render() {
    const { currentUser } = this.props;
    const loggedIn = !!Object.keys(currentUser || {}).length;

    return (
      <Container>
        <Grid stackable reversed="mobile vertically">
          <Grid.Column width={10}>
            <PostList />
          </Grid.Column>
          {loggedIn &&
            <Grid.Column width={6}>
              <Segment>
                <Label color="blue" ribbon="right">My Journeys</Label>
                <JourneyList user={currentUser} />
              </Segment>
            </Grid.Column>}
        </Grid>
      </Container>
    );

  }

};

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(HomePage);
