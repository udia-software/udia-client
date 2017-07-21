import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Divider, Item, Segment } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import Comments from "./Comments";
import { getPostRequest } from "../../modules/post/sagas.actions";
import { setPost, clearPostError } from "../../modules/post/reducer.actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  sendingPostRequest: PropTypes.bool.isRequired,
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  post: PropTypes.object.isRequired
};

class Post extends Component {
  componentWillMount = () => {
    const postId = this.props.match.params.id;
    this.props.dispatch(getPostRequest({ id: postId }));
  };

  componentWillUnmount = () => {
    this.props.dispatch(setPost({}));
    this.props.dispatch(clearPostError());
  };

  render = () => {
    const { sendingPostRequest, postRequestError, post } = this.props;

    return (
      <Container>
        <Error error={postRequestError} header="Post Fetch Failed!" />
        <Segment loading={sendingPostRequest}>
          {post.id &&
            <Item>
              <Item.Content>
                <Item.Header as="h3">
                  {post.title}
                </Item.Header>
                <Item.Description>
                  {post.content.split("\n").map((item, key) => {
                    return <span key={key}>{item}<br /></span>;
                  })}
                </Item.Description>
                <Divider />
                <Item.Extra>
                  <span>Submitted {moment(post.inserted_at).fromNow()} by </span>
                  <Link to={`/users/${post.author.username}`}>
                    {post.author.username}.
                  </Link>
                  {moment(post.inserted_at).format("X") !==
                    moment(post.updated_at).format("X") &&
                    <span>Last updated {moment(post.updated_at).fromNow()}.</span>}
                </Item.Extra>
              </Item.Content>
            </Item>}
        </Segment>
        <Comments post_id={post.id}/>
      </Container>
    );
  };
}

Post.propTypes = propTypes;

function mapStateToProps(state) {
  return state.post;
}

export default connect(mapStateToProps)(Post);
