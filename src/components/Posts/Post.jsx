import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Divider,
  Item,
  List,
  Popup,
  Segment,
  Icon
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import Error from "../Shared/Error";
import ContentText from "../Shared/ContentText";
import ContentHtml from "../Shared/ContentHtml";
import CommentsContainer from "./CommentsContainer";
import FromTime from "../Shared/FromTime";

const propTypes = {
  postRequestError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  sendingPostRequest: PropTypes.bool,
  post: PropTypes.object,
  currentUsername: PropTypes.string
};

const defaultProps = {
  postRequestError: "",
  sendingPostRequest: true,
  post: {},
  presence: {},
  currentUsername: ""
};

const Post = ({
  postRequestError,
  sendingPostRequest,
  post,
  presence,
  currentUsername
}) => {
  return (
    <Container>
      <Segment loading={sendingPostRequest}>
        <Error error={postRequestError} header="Post Fetch Failed!" />
        {post.id &&
          <Item>
            <Item.Content>
              {post.journey &&
                <Item.Meta>
                  <Link to={`/journeys/${post.journey.id}`}>
                    <Icon name="road" />{post.journey.title}
                  </Link>
                </Item.Meta>
              }
              <Item.Header as="h3" style={{ marginTop: '10px' }}>
                {post.title}
              </Item.Header>
              <Item.Description>
                {post.type === "text" && <ContentText content={post.content} />}
                {post.type === "html" && <ContentHtml content={post.content} />}
              </Item.Description>
              <Divider />
              <Item.Extra>
                <p>
                  <span>
                    Submitted
                    {" "}
                    <FromTime time={moment(post.inserted_at)} />
                    {" by "}
                  </span>
                  <Link to={`/users/${post.author.username}`}>
                    {post.author.username}.
                  </Link>
                  {moment(post.inserted_at).format("X") !==
                    moment(post.updated_at).format("X") &&
                    <span>
                      {" Last updated "}
                      <FromTime time={moment(post.updated_at)} />
                      .
                    </span>}
                </p>{currentUsername === post.author.username &&
                  <p>
                    <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                  </p>}
              </Item.Extra>
            </Item.Content>
          </Item>}
      </Segment>
      <h4>Currently Viewing Users</h4>
      <List>
        {Object.keys(presence).map(username => {
          return (
            <List.Item key={username}>
              <List.Content>
                <Popup
                  trigger={
                    !!username
                      ? <Link to={`/users/${username}`}>
                        {username} ({presence[username].metas.length})
                        </Link>
                      : <span>
                        anonymous ({presence[username].metas.length})
                        </span>
                  }
                  content={presence[username].metas.map(meta => {
                    return (
                      <List.Item key={meta.phx_ref}>
                        Joined <FromTime time={moment(meta.online_at, "X")} />
                      </List.Item>
                    );
                  })}
                />
              </List.Content>
            </List.Item>
          );
        })}
      </List>
      {!!post.id && <CommentsContainer post_id={post.id} />}
    </Container>
  );
};

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

export default Post;
