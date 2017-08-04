import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Header,
  Icon,
  Divider,
  Loader,
  Card,
  Button,
  Grid,
  Visibility
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import { getJourneyRequest } from "../../modules/journey/sagas.actions";
import { setJourney, clearJourneyError } from "../../modules/journey/reducer.actions";
import { getPostsRequest } from "../../modules/posts/sagas.actions";
import { clearPosts } from "../../modules/posts/reducer.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingJourneyRequest: PropTypes.bool.isRequired,
  journeyRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  journey: PropTypes.object.isRequired,
  currentlyGettingPosts: PropTypes.bool.isRequired,
  postsRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  postsPagination: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

const defaultProps = {
  currentUser: {}
}

class Journey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false
    };
  }

  componentWillMount = () => {
    const journeyId = this.props.match.params.id;
    this.props.dispatch(getJourneyRequest({ id: journeyId }));
    this.props.dispatch(getPostsRequest({
      page: 1,
      journey_id: journeyId
    }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setJourney({}));
    this.props.dispatch(clearJourneyError());
    this.props.dispatch(clearPosts())
  };

  getNextPage = () => {
    const { page_number, total_pages } = this.props.postsPagination;
    const journeyId = this.props.match.params.id;
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(getPostsRequest({
        page: page_number + 1,
        journey_id: journeyId
      }));
    }
  };

  onVisibilityUpdate = (e, { calculations }) => {
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage();
    }
  };

  componentWillReceiveProps = nextProps => {
    const { page_number, total_pages } = nextProps.postsPagination;
    if (page_number >= 1 && page_number === total_pages) {
      this.setState({ endOfFeed: true });
    }
  };

  render = () => {
    const {
      sendingJourneyRequest,
      journeyRequestError,
      journey,
      posts,
      currentUser,
      history
    } = this.props;

    return (
      <div style={{ padding: '40px' }}>
        <Error error={journeyRequestError} header="Journey Fetch Failed!" />
        <Loader active={sendingJourneyRequest} inline='centered' />
        {journey.id &&
          <div>
            <Header as='h1' icon textAlign="center">
              <Icon name='road' circular />
              {journey.title}
              <Header.Subheader>
                <Link to={`/users/${journey.explorer.username}`}>
                  {journey.explorer.username}{' '}
                </Link>
                <span>started this journey on {moment(journey.inserted_at).format('MMMM Do, YYYY')}</span>
                {moment(journey.inserted_at).format("X") !==
                  moment(journey.updated_at).format("X") &&
                  <span>Last updated {moment(journey.updated_at).fromNow()}.</span>}
              </Header.Subheader>
              <Header.Subheader style={{ paddingTop: '10px' }}>
                {journey.description.split("\n").map((item, key) => {
                  return <span key={key}>{item}<br /></span>;
                })}
              </Header.Subheader>
            </Header>
            <Divider />
            {currentUser && journey.explorer && journey.explorer.username === currentUser.username &&
              <Grid>
                <Grid.Column textAlign='center'>
                  <Button
                    onClick={() => history.push(`/posts/create?journey=${journey.id}`)}
                    content='Write a Post'
                    color='green'
                    icon='edit' />
                </Grid.Column>
              </Grid>
            }
            <Visibility onUpdate={this.onVisibilityUpdate}>
              <Card.Group style={{marginTop: '10px'}}>
                {posts.map((post) => (
                  <Card href={`/posts/${post.id}`} key={post.id}>
                    <Card.Content>
                      <Card.Header>
                        {post.title}
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <Card.Meta>
                        Written {moment(post.inserted_at).fromNow()}
                      </Card.Meta>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
            </Visibility>
          </div>
        }
      </div>
    );
  };
}

Journey.propTypes = propTypes;
Journey.defaultProps = defaultProps;

function mapStateToProps(state) {
  return Object.assign({}, state.journey, state.posts, state.auth);
}

export default connect(mapStateToProps)(Journey);