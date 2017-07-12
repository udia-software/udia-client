import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPost, getPostById } from "../../actions";
import { Container, Loader, Item } from "semantic-ui-react";
import moment from "moment";

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
  currentlySending: false
};

class Post extends Component {
  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostById(postId));
  };
  componentWillUnmount = () => {
    this.props.dispatch(setPost(null));
  };
  render = () => {
    const {
      id,
      author,
      title,
      inserted_at,
      updated_at,
      content,
      currentlySending
    } = this.props;
    return (
      <Container>
        <Loader active={currentlySending} inline="centered" />
        {id &&
          <Item>
            <Item.Content>
              <Item.Header as="h3">
                {title}
              </Item.Header>
              <Item.Meta>
                Written by
                {" "}
                {author.username}
                {" "}
                on
                {" "}
                {moment(inserted_at).format("MMMM D [at] h:mm Z")}
                {" "}
                and last updated at
                {" "}
                {moment(updated_at).format("MMMM D [at] h:mm a Z")}
              </Item.Meta>
              <Item.Description>
                <br />
                {content}
              </Item.Description>
              <Item.Extra />
            </Item.Content>
          </Item>}
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
