import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions";
import { Feed, Icon, Visibility } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
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
    this.state = {
      calculations: {
        height: 0,
        width: 0,
        topPassed: false,
        bottomPassed: false,
        pixelsPassed: 0,
        percentagePassed: 0,
        topVisible: false,
        bottomVisible: false,
        fits: false,
        passing: false,
        onScreen: false,
        offScreen: false
      }
    };
    this.props.dispatch(getPosts(1));
  }

  handleUpdate = (e, { calculations }) => this.setState({ calculations });

  render = () => {
    const { page_number, total_pages, posts } = this.props;

    const getNext =
      (this.state.calculations.bottomVisible ||
        this.state.calculations.bottomPassed) &&
      (page_number || 0) < (total_pages || 0);
    if (getNext) {
      // dispatch pagination call next page
      this.props.dispatch(getPosts(page_number + 1));
    }

    return (
      <div style={{ padding: "40px" }}>
        <Visibility onUpdate={this.handleUpdate}>
          <Feed>
            {posts.map(post => (
              <Feed.Event key={post.id}>
                <Feed.Label>
                  <Icon name="user" />
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    <strong>
                      <Link to={`/users/${post.author.username}`}>{post.author.username}</Link>
                    </strong> wrote{" "}
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    <Feed.Date>{moment(post.inserted_at).fromNow()}</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    {post.content}
                  </Feed.Extra>
                </Feed.Content>
              </Feed.Event>
            ))}
            {page_number === total_pages &&
              <div>
                <p>End of feed.</p>
              </div>}
          </Feed>
        </Visibility>
      </div>
    );
  };
}

PostList.propTypes = propTypes;

function mapStateToProps(state) {
  return state.postList;
}

export default connect(mapStateToProps)(PostList);
