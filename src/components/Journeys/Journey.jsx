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
  Confirm,
  Container
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
      <div className={'pad'}>
        <Error error={journeyRequestError} header="Journey Fetch Failed!" />
        <Loader active={sendingJourneyRequest} inline='centered' />
        {journey.id &&
          <Container>
            <Grid divided='vertically' verticalAlign='middle'>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <Header as='h1' icon textAlign="center">
                    <Icon name='road' circular />
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h1' icon textAlign='center'>
                    <Header.Content>
                      {journey.title}
                    </Header.Content>
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h3'>
                    <Link to={`/users/${journey.explorer.username}`}>
                      {journey.explorer.username}{' '}
                    </Link>
                  </Header>
                  {journey.end_date ?
                    <p>
                      Journey travelled from {' '}
                      {moment(journey.start_date).format('MMM D, YYYY')}
                      {' to '}{moment(journey.end_date).format('MMM D, YYYY')}
                    </p>
                    :
                    <p>Started journey {moment(journey.start_date).format('MMMM Do, YYYY')}</p>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Container>
              <p className={'pad-left pad-right'}>
                {journey.description.split("\n").map((item, key) => {
                  return <span key={key}>{item}<br /></span>;
                })}
              </p>
            </Container>
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
          </Container>
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