import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Container, Header, Label, Popup, Segment } from "semantic-ui-react";
import gql from "graphql-tag";
import moment from "moment";
import FromTime from "../Static/FromTime";
import { isAuthenticated } from "../../modules/auth";

class ViewNode extends Component {
  constructor(props) {
    super(props);
    const nodeUID = props.match.params.node_uid;
    this.state = {
      loading: true,
      nodeUID
    };
  }

  componentWillMount = () => {
    this.props.subscribeToNewNodes({
      node_uid: this.state.nodeUID
    });
  };

  render() {
    document.title = "UDIA";
    const nodesToRender = this.props.nodeQuery.allNodes;
    return (
      <Container style={{ flex: 0.95 }}>
        <Header>View Node</Header>
        {nodesToRender &&
          nodesToRender.length && (
            <div>
              {nodesToRender.length > 0 &&
                nodesToRender.filter(a => a && a._id).map(nodeBlock => (
                  <div key={nodeBlock._id}>
                    <Header inverted>
                      {nodeBlock.title || <Label size="mini">Untitled</Label>}
                      <Header.Subheader>
                        Created{" "}
                        <Popup
                          trigger={
                            <FromTime time={moment(nodeBlock.createdAt)} />
                          }
                          content={(nodeBlock.createdAt || {}).displayTime || 0}
                          inverted
                        />{" "}
                        ago, by{" "}
                        <Link to={`/contact`}>
                          {(nodeBlock.createdBy || {}).username || (
                            <Label size="mini">Unnamed</Label>
                          )}
                        </Link>
                      </Header.Subheader>
                    </Header>
                    <Segment
                      style={{ display: "block", wordWrap: "break-word" }}
                      inverted
                    >
                      <ReactMarkdown source={nodeBlock.content} />
                    </Segment>
                  </div>
                ))}
            </div>
          )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state)
  };
}

const NODE_QUERY = gql`
  query AllNodesQuery(
    $filter: NodeFilter
    $orderBy: NodeOrderBy
    $skip: Int
    $first: Int
  ) {
    allNodes(filter: $filter, orderBy: $orderBy, skip: $skip, first: $first) {
      _id
      title
      content
      dataType
      relationType
      createdAt
      createdBy {
        username
      }
    }
  }
`;

const NODE_SUBSCRIPTION = gql`
  subscription NodeSubscription($filter: NodeSubscriptionFilter) {
    NodeSubscription(filter: $filter) {
      mutation
      node {
        _id
        dataType
        relationType
        title
        content
        createdBy {
          _id
          username
        }
        createdAt
      }
    }
  }
`;

export default connect(mapStateToProps)(
  compose(
    graphql(NODE_QUERY, {
      name: "nodeQuery",
      options: props => {
        return {
          variables: {
            filter: {
              id: `${props.match.params.node_uid}`
            }
          }
        };
      },
      props: props => {
        return {
          ...props,
          subscribeToNewNodes: params => {
            return props.nodeQuery.subscribeToMore({
              document: NODE_SUBSCRIPTION,
              variables: {
                filter: {
                  parentId: `${props.ownProps.match.params.node_uid}`
                }
              },
              updateQuery: (previous, { subscriptionData }) => {
                const newAllNodes = [
                  ...(previous.allNodes || []),
                  ((subscriptionData.data || {}).NodeSubscription || {}).node ||
                    null
                ].filter(node => !!node);
                const result = {
                  ...previous,
                  allNodes: newAllNodes
                };
                return result;
              }
            });
          }
        };
      }
    })
  )(ViewNode)
);
