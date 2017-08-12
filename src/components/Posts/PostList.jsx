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
import { clearPosts } from "../../modules/posts/reducer.actions";
import { getPostsRequest } from "../../modules/posts/sagas.actions";
import ContentText from "../Shared/ContentText";
import ContentHtml from "../Shared/ContentHtml";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingPosts: PropTypes.bool.isRequired,
  postsRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  postsPagination: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  username: PropTypes.string
};

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false
    };
    if (this.props.username) {
      this.props.dispatch(
        getPostsRequest({ page: 1, username: this.props.username })
      );
    } else {
      this.props.dispatch(getPostsRequest({ page: 1 }));
    }
  }

  getNextPage = () => {
    const { page_number, total_pages } = this.props.postsPagination;
    if ((page_number || 0) < (total_pages || 0)) {
      if (this.props.username) {
        this.props.dispatch(
          getPostsRequest({
            page: page_number + 1,
            username: this.props.username
          })
        );
      } else {
        this.props.dispatch(getPostsRequest({ page: page_number + 1 }));
      }
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

  componentWillUnmount = () => {
    this.props.dispatch(clearPosts());
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
                    {post.journey &&
                      <span>
                        {" | "}
                        <Link to={`/journeys/${post.journey.id}`}>
                          {post.journey.title}
                        </Link>
                      </span>}
                    <Feed.Date>
                      <FromTime time={moment(post.inserted_at)} />
                    </Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    <Segment compact>
                      {post.type === "text" &&
                        <ContentText content={post.content} />}
                      {post.type === "html" &&
                        <ContentHtml content={post.content} />}
                    </Segment>
                  </Feed.Extra>
                  <Feed.Meta>
                    {moment(post.inserted_at).format("X") !==
                      moment(post.updated_at).format("X") &&
                      <span>
                        {"Last updated "}
                        <FromTime time={moment(post.updated_at)} />
                        .
                      </span>}
                    <Link to={`/posts/${post.id}`}>
                      Show Post
                    </Link>
                  </Feed.Meta>
                </Feed.Content>
              </Feed.Event>
            ))}
            {!endOfFeed &&
              <Segment textAlign="center">
                <Dimmer active={currentlyGettingPosts} inverted>
                  <Loader />
                </Dimmer>
                <Feed.Event>
                  <Feed.Content>
                    <Button onClick={this.getNextPage}>Load More Posts</Button>
                  </Feed.Content>
                </Feed.Event>
              </Segment>}
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
