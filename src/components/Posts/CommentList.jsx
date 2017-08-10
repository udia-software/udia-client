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
import ContentText from "../Shared/ContentText";
import FromTime from "../Shared/FromTime";
import { clearUserComments } from "../../modules/comments/reducer.actions";
import { getUserCommentsRequest } from "../../modules/comments/sagas.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlyGettingUserComments: PropTypes.bool.isRequired,
  userCommentsRequestError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  userCommentsRequestPagination: PropTypes.object.isRequired,
  userComments: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOfFeed: false
    };

    const username = this.props.user.username;
    this.props.dispatch(
      getUserCommentsRequest({
        page: 1,
        username
      })
    );
  }

  getNextPage = () => {
    const {
      page_number,
      total_pages
    } = this.props.userCommentsRequestPagination;
    const username = this.props.user.username;
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(
        getUserCommentsRequest({
          page: page_number + 1,
          username
        })
      );
    }
  };

  onVisibilityUpdate = (e, { calculations }) => {
    if (calculations.bottomVisible || calculations.bottomPassed) {
      this.getNextPage();
    }
  };

  componentWillReceiveProps = nextProps => {
    const {
      page_number,
      total_pages
    } = nextProps.userCommentsRequestPagination;
    if (page_number >= 1 && page_number === total_pages) {
      this.setState({ endOfFeed: true });
    }
  };

  componentWillUnmount = () => {
    this.props.dispatch(clearUserComments());
  };

  render = () => {
    const {
      currentlyGettingUserComments,
      userComments,
      userCommentsRequestError
    } = this.props;
    const { endOfFeed } = this.state;

    return (
      <Container>
        <Visibility onUpdate={this.onVisibilityUpdate}>
          <Feed>
            {userComments.map(comment => (
              <Feed.Event key={comment.id}>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User
                      as={Link}
                      to={`/users/${comment.author.username}`}
                    >
                      {comment.author.username}
                    </Feed.User>
                    {" replied to "}
                    <Link to={`/posts/${comment.post_id}`}>this post</Link>
                    {"."}
                    <Feed.Date>
                      <FromTime time={moment(comment.inserted_at)} />
                    </Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    <Segment compact>
                      {comment.type === "text" && <ContentText content={comment.content} />}
                    </Segment>
                  </Feed.Extra>
                  <Feed.Meta>
                    {moment(comment.inserted_at).format("X") !==
                      moment(comment.updated_at).format("X") &&
                      <span>
                        {"Last updated "}
                        <FromTime time={moment(comment.updated_at)} />
                        .
                      </span>}
                    <Link to={`/posts/${comment.post_id}`}>
                      Show Post
                    </Link>
                  </Feed.Meta>
                </Feed.Content>
              </Feed.Event>
            ))}
            <Segment textAlign="center">
              <Dimmer active={currentlyGettingUserComments} inverted>
                <Loader />
              </Dimmer>
              {endOfFeed &&
                <Feed.Event>
                  <Feed.Content>End of feed.</Feed.Content>
                </Feed.Event>}
              {!endOfFeed &&
                <Feed.Event>
                  <Feed.Content>
                    <Button onClick={this.getNextPage}>
                      Load More Comments
                    </Button>
                  </Feed.Content>
                </Feed.Event>}
            </Segment>
          </Feed>
        </Visibility>
        <Error
          error={userCommentsRequestError}
          header="Get User Comments Failed!"
        />
      </Container>
    );
  };
}

CommentList.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    ...state.comments,
    ...state.user
  };
}

export default connect(mapStateToProps)(CommentList);
