import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Divider, Item, Segment } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import { clearError, setPost, getPostById } from "../../actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  currentlySending: PropTypes.bool,
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
};

const defaultProps = {
  error: "",
  currentlySending: false,
  id: 0,
};

class Post extends Component {
  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostById(postId));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setPost(null));
    this.props.dispatch(clearError());
  };

  render = () => {
    const {
      id,
      author,
      title,
      inserted_at,
      updated_at,
      content,
      currentlySending,
      error
    } = this.props;

    return (
      <Container>
        <Error error={error} header="Post Fetch Failed!" />
        <Segment loading={currentlySending}>
          {id &&
            <Item>
              <Item.Content>
                <Item.Header as="h3">
                  {title}
                </Item.Header>
                <Item.Description>
                  {content.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                  })}
                </Item.Description>
                <Divider />
                <Item.Extra>
                  <span>Submitted {moment(inserted_at).fromNow()} by </span>
                  <Link to={`/users/${author.username}`}>
                    {author.username}.
                  </Link>
                  {moment(inserted_at).format("X") !== moment(updated_at).format("X") &&
                    <span>Last updated {moment(updated_at).fromNow()}.</span>
                  }
                </Item.Extra>
              </Item.Content>
            </Item>}
        </Segment>
      </Container>
    );
  };
}

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    ...state.post,
    error: state.api.error,
    currentlySending: state.api.currentlySending
  };
}

export default connect(mapStateToProps)(Post);
