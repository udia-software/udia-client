import React from "react";
import PropTypes from "prop-types";
import { Container, Divider, Item, Segment } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import CommentsContainer from "./CommentsContainer";

const propTypes = {
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  sendingPostRequest: PropTypes.bool,
  post: PropTypes.object
};

const defaultProps = {
  postRequestError: "",
  sendingPostRequest: true,
  post: {}
};

const Post = ({ postRequestError, sendingPostRequest, post }) => {
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
                  <span>
                    Last updated {moment(post.updated_at).fromNow()}.
                  </span>}
              </Item.Extra>
            </Item.Content>
          </Item>}
      </Segment>
      <CommentsContainer post_id={post.id} />
    </Container>
  );
};

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

export default Post;
