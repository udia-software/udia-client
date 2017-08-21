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
  Visibility,
  Confirm
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import { getJourneyRequest, deleteJourneyRequest } from "../../modules/journey/sagas.actions";
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
  currentUser: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired
};

const defaultProps = {
  currentUser: {}
}

class Journey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false,
      confirmModalOpen: false
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

  deleteJourney = () => {
    const journeyId = this.props.match.params.id;
    const { history } = this.props;
    this.props.dispatch(deleteJourneyRequest({ id: journeyId }));
    history.push('/');
  }

  render = () => {
    const {
      sendingJourneyRequest,
      journeyRequestError,
      journey,
      posts,
      currentUser
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
                <span>started this journey on {moment(journey.start_date).format('MMMM Do, YYYY')}</span>
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
                  <Button as={Link}
                    to={`/posts/create/${journey.id}`}
                    content='Write a Post'
                    color='green'
                    icon='edit' />
                </Grid.Column>
              </Grid>
            }
            <Visibility onUpdate={this.onVisibilityUpdate}>
              <Card.Group style={{ marginTop: '10px' }}>
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
            {currentUser && journey.explorer && journey.explorer.username === currentUser.username &&
              <div>
                <Divider />
                <Grid>
                  <Grid.Column textAlign='center'>
                    <Button
                      onClick={() => this.setState({ confirmModalOpen: true })}
                      content='Delete Journey'
                      color='red'
                      icon='delete' />
                    <Confirm
                      content="Are you sure you wish to delete this journey?"
                      open={this.state.confirmModalOpen}
                      onCancel={() => this.setState({ confirmModalOpen: false })}
                      onConfirm={this.deleteJourney}
                    />
                    <Button
                      as={Link}
                      to={`/journeys/${journey.id}/edit`}
                      content='Edit Journey'
                      color='yellow'
                      icon='edit' />
                  </Grid.Column>
                </Grid>
              </div>
            }
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