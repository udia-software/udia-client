import gql from "graphql-tag";

// Although we're persisting the entire Redux Store,
// JWT and User object are excluded and manually handled
export const GC_AUTH_TOKEN = "udia-auth-token";

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// GraphQL Mutations, Queries, Subscriptions
export const CREATE_NODE_MUTATION = gql`
  mutation CreateNodeMutation(
    $dataType: NodeDataType!
    $relationType: NodeRelationType!
    $title: String!
    $content: String!
    $parentId: ID
  ) {
    createNode(
      dataType: $dataType
      relationType: $relationType
      title: $title
      content: $content
      parentId: $parentId
    ) {
      _id
      dataType
      relationType
      title
      content
      createdAt
      updatedAt
      createdBy {
        username
        _id
      }
      countImmediateChildren
      countAllChildren
    }
  }
`;

export const SELF_USER_QUERY = gql`
  query selfUserQuery {
    me {
      _id
      username
      createdAt
      updatedAt
      email
      emailVerified
      passwordHash
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation(
    $email: String!
    $password: String!
    $username: String!
  ) {
    createUser(email: $email, username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
