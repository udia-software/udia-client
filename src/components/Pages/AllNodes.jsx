import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Container, Header, Label, List, Popup } from "semantic-ui-react";
import moment from "moment";
import FromTime from "../Static/FromTime";

class AllNodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeErrors: []
    };
  }

  componentWillMount = () => {
    this.props.subscribeToNewNodes();
  };

  render() {
    document.title = "All Nodes - UDIA";
    const nodesToRender = this.props.allNodesQuery.allNodes;
    return (
      <Container>
        <Header>All Nodes</Header>
        {nodesToRender && (
          <List divided relaxed inverted size="huge">
            {nodesToRender.length > 0 &&
              nodesToRender.filter(a => a && a._id).map(nodeBlock => (
                <List.Item key={nodeBlock._id}>
                  <List.Header as={Link} to={`/node/${(nodeBlock || {})._id}`}>
                    {nodeBlock.title || <Label size="mini">Untitled</Label>}
                  </List.Header>
                  <List.Content>
                    Created{" "}
                    <Popup
                      trigger={<FromTime time={moment(nodeBlock.createdAt)} />}
                      content={(nodeBlock.createdAt || {}).displayTime || 0}
                      inverted
                    />{" "}
                    ago, by{" "}
                    <Link to={`/contact`}>
                      {(nodeBlock.createdBy || {}).username || (
                        <Label size="mini">Unnamed</Label>
                      )}
                    </Link>
                  </List.Content>
                </List.Item>
              ))}
          </List>
        )}
      </Container>
    );
  }
}

export const ALL_NODES_QUERY = gql`
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

export const ALL_NODES_SUBSCRIPTION = gql`
  subscription AllNodesSubscription($filter: NodeSubscriptionFilter) {
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

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(ALL_NODES_QUERY, {
      name: "allNodesQuery",
      options: props => {
        return {
          variables: {
            orderBy: "createdAt_DESC"
          }
        }
      },
      props: props => {
        return {
          ...props,
          subscribeToNewNodes: () => {
            props.allNodesQuery.subscribeToMore({
              document: ALL_NODES_SUBSCRIPTION,
              updateQuery: (previous, { subscriptionData }) => {
                const newAllNodes = [
                  ((subscriptionData.data || {}).NodeSubscription || {}).node ||
                    null,
                  ...(previous.allNodes || [])
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
  )(AllNodes)
);
