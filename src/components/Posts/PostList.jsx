import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Dimmer,
  Feed,
  Loader,
  Segment,
  Visibility
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import FromTime from "../Shared/FromTime";
import { getPostsRequest } from "../../modules/posts/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingPosts: PropTypes.bool.isRequired,
  postsRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  postsPagination: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired
};

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false
    };
    this.props.dispatch(getPostsRequest({ page: 1 }));
  }

  getNextPage = () => {
    const { page_number, total_pages } = this.props.postsPagination;
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(getPostsRequest({ page: page_number + 1 }));
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
    const { currentlyGettingPosts, posts, postsRequestError } = this.props;
    const { endOfFeed } = this.state;

    return (
      <Container>
        <Visibility onUpdate={this.onVisibilityUpdate}>
          <Feed>
            {posts.map(post => (
              <Feed.Event key={post.id}>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User as={Link} to={`/users/${post.author.username}`}>
                      {post.author.username}
                    </Feed.User>
                    {" wrote "}
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    <Feed.Date>
                      <FromTime time={moment(post.inserted_at)} />
                    </Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    {post.content.split("\n").map((item, key) => {
                      return <span key={key}>{item}<br /></span>;
                    })}
                  </Feed.Extra>
                </Feed.Content>
              </Feed.Event>
            ))}
            <Segment textAlign="center">
              <Dimmer active={currentlyGettingPosts} inverted>
                <Loader />
              </Dimmer>
              {endOfFeed &&
                <Feed.Event>
                  <Feed.Content>End of feed.</Feed.Content>
                </Feed.Event>}
              {!endOfFeed &&
                <Feed.Event>
                  <Feed.Content>
                    <Button onClick={this.getNextPage}>Load More Posts</Button>
                  </Feed.Content>
                </Feed.Event>}
            </Segment>
          </Feed>
        </Visibility>
        <Error error={postsRequestError} header="Get Posts Failed!" />
      </Container>
    );
  };
}

PostList.propTypes = propTypes;

function mapStateToProps(state) {
  return state.posts;
}

export default connect(mapStateToProps)(PostList);
