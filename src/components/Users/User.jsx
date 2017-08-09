import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Dimmer, Header, Loader, Tab } from "semantic-ui-react";
import { setUser } from "../../modules/user/reducer.actions";
import { getUserByUsernameRequest } from "../../modules/user/sagas.actions";
import Error from "../Shared/Error";
import JourneyList from "../Journeys/JourneyList";
import PostList from "../Posts/PostList";
import CommentList from "../Posts/CommentList";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingUser: PropTypes.bool.isRequired,
  userRequestError: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  user: PropTypes.object.isRequired
};

class User extends Component {
  componentWillMount = () => {
    const username = this.props.match.params.username;
    this.props.dispatch(getUserByUsernameRequest({ username }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setUser({}));
  };

  render = () => {
    const { user, currentlyGettingUser, userRequestError } = this.props;
    const panes = [
      {
        menuItem: "Journeys",
        render: () => (
          <Tab.Pane>
            <JourneyList />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Posts",
        render: () => (
          <Tab.Pane>
            <PostList username={user.username} />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Comments",
        render: () => <Tab.Pane><CommentList /></Tab.Pane>
      }
    ];
    return (
      <Container style={{ marginTop: "30px" }}>
        <Error error={userRequestError} header="Get User Failed!" />
        <Dimmer active={currentlyGettingUser} inverted>
          <Loader />
        </Dimmer>
        {user.username &&
          <div>
            <Header as="h2" textAlign="center">{user.username}</Header>
            <Tab panes={panes} />
          </div>}
      </Container>
    );
  };
}

User.propTypes = propTypes;

function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(User);
