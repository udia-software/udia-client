import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions";
import { Container, Feed, Icon, Loader, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentlySending: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  page_number: PropTypes.number,
  page_size: PropTypes.number,
  total_entries: PropTypes.number,
  total_pages: PropTypes.number,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        inserted_at: PropTypes.string,
        updated_at: PropTypes.string,
        username: PropTypes.string
      }),
      type: PropTypes.oneOf(["text"]),
      title: PropTypes.string,
      content: PropTypes.string,
      id: PropTypes.number,
      inserted_at: PropTypes.string,
      updated_at: PropTypes.string
    })
  )
};

class PostList extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getPosts(1));
    this.state = {
      endOfFeed: false
    };
  }

  getNextPage = () => {
    const { page_number, total_pages } = this.props;
    console.log(page_number, total_pages)
    if ((page_number || 0) < (total_pages || 0)) {
      this.props.dispatch(getPosts(page_number + 1));
    } else {
      this.setState({ endOfFeed: true });
    }
  };

  onVisibilityUpdate = (e, {calculations}) => {
    if (calculations.bottomVisible || calculations.buttonPassed) {
      this.getNextPage();
    }
  }

  render = () => {
    const { currentlySending, posts } = this.props;
    const { endOfFeed } = this.state;

    return (
      <Container>
        <Visibility
          onBottomVisible={this.getNextPage}
          onUpdate={this.onVisibilityUpdate}
        >
          <Feed>
            {posts.map(post => (
              <Feed.Event key={post.id}>
                <Feed.Label>
                  <Icon name="user" />
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User as={Link} to={`/users/${post.author.username}`}>
                      {post.author.username}
                    </Feed.User>
                    {" "}
                    wrote
                    {" "}
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    <Feed.Date>{moment(post.inserted_at).fromNow()}</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    {post.content.split('\n').map((item, key) => {
                      return <span key={key}>{item}<br/></span>
                    })}
                  </Feed.Extra>
                </Feed.Content>
              </Feed.Event>
            ))}
            <Loader active={currentlySending}/>
            {endOfFeed &&
              <Feed.Event>
                <Feed.Content>End of feed.</Feed.Content>
              </Feed.Event>}
          </Feed>
        </Visibility>
      </Container>
    );
  };
}

PostList.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    ...state.postList,
    error: state.api.error,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(PostList);
