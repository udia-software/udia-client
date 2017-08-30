import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Dimmer,
  Card,
  Loader,
  Segment,
  Visibility,
  Icon,
  Grid,
  Header
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import FromTime from "../Shared/FromTime";
import { clearPosts } from "../../modules/posts/reducer.actions";
import { getPostsRequest } from "../../modules/posts/sagas.actions";
import ContentHtml from "../Shared/ContentHtml";
import ContentText from "../Shared/ContentText";
const $ = window.$;

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

  formatText = text => {
    text = text.replace(/\r?\n|\r/g, "");
    text = text.replace(/\s\s+/g, "");
    text = text.replace(/\?/g, "? ");
    text = text.replace(/\./g, ". ");
    text = text.replace(/,/g, ", ");
    text = text.replace(/!/g, "! ");
    text = text.replace(/;/g, "; ");
    if (text.length > 350) {
      return text.substring(0, 350) + "...";
    } else {
      return text.substring(0, 350);
    }
  }

  getTextFromHtml = html => {
    const $html = $(html)
    let text = $html.text();
    text = this.formatText(text);
    const iframesAndImages = $html.filter(".medium-insert-embeds, .medium-insert-images");
    if (iframesAndImages[0]) {
      text = iframesAndImages[0].outerHTML + text;
    }
    return text;
  };

  render = () => {
    const { currentlyGettingPosts, posts, postsRequestError } = this.props;
    const { endOfFeed } = this.state;

    return (
      <Container>
        <Visibility onUpdate={this.onVisibilityUpdate}>
          <Card.Group>
            {posts.map(post => (
              <Card key={post.id} fluid>
                <Card.Content>
                  <Grid verticalAlign="bottom">
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <Header as={Link} to={`/posts/${post.id}`}>
                          {post.title}
                        </Header>
                      </Grid.Column>
                      {post.journey &&
                        <Grid.Column textAlign="right">
                          <Header
                            as={Link}
                            to={`/journeys/${post.journey.id}`}
                            style={{ fontSize: "1em" }}
                          >
                            <Icon name="road" />{post.journey.title}
                          </Header>
                        </Grid.Column>}
                    </Grid.Row>
                  </Grid>
                  <Card.Meta>
                    <FromTime time={moment(post.inserted_at)} />
                  </Card.Meta>
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    {post.type === 'html' &&
                      <ContentHtml content={this.getTextFromHtml(post.content)} />
                    }
                    {post.type === 'text' &&
                      <ContentText content={this.formatText(post.content)} />
                    }
                  </Card.Description>
                </Card.Content>
                <Card.Content>
                  <Card.Meta>
                    <Icon name="user" />
                    <Link to={`/users/${post.author.username}`}>
                      {post.author.username}
                    </Link>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
            {!endOfFeed &&
              <Segment textAlign="center">
                <Dimmer active={currentlyGettingPosts} inverted>
                  <Loader />
                </Dimmer>
                <Button onClick={this.getNextPage}>Load More Posts</Button>
              </Segment>}
          </Card.Group>
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
