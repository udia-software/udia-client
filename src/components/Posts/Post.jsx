import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Divider,
  Grid,
  Item,
  List,
  Segment
} from "semantic-ui-react";
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
  post: {},
  presence: {}
};

const Post = ({ postRequestError, sendingPostRequest, post, presence }) => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={13}>
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
                      <span>
                        Submitted {moment(post.inserted_at).fromNow()} by{" "}
                      </span>
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
          </Grid.Column>
          <Grid.Column width={3}>
            <List>
              {Object.keys(presence).map(username => {
                return (
                  <List.Item key={username}>
                    {username && <List.Icon name="users" />}
                    {!username && <List.Icon name="question" />}
                    <List.Content>
                      {username && <Link to={`/users/${username}`}>{username}</Link>}
                      {!username && "anonymous"}
                      <List.List>
                        {presence[username].metas.map(meta => {
                          return (
                            <List.Item key={meta.phx_ref}>
                              Joined at {moment(meta.online_at, "X").toString()}
                            </List.Item>
                          );
                        })}
                      </List.List>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <CommentsContainer post_id={post.id} />
    </Container>
  );
};

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

export default Post;
