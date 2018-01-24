import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Container, Header } from "semantic-ui-react";

class AllNodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeErrors: []
    };
  }

  componentDidMount = () => {
    this._subscribeToNewNodes();
  }

  _subscribeToNewNodes = () => {
    this.props.allNodesQuery.subscribeToMore({
      document: gql`
        subscription {
          NodeSubscription(filter: {
            mutation_in: [CREATED]
          }) {
            mutation
            node {
              _id
              title
              content
              createdAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [...previous.allLinks, subscriptionData.Link.node];
        const result = {
          ...previous,
          allLinks: newAllLinks
        };
        return result;
      }
    });
  }

  render() {
    document.title = "All Nodes - UDIA";
    const nodesToRender = this.props.allNodesQuery.allNodes;
    return (
      <Container>
        <Header>All Nodes</Header>
        to do
        {nodesToRender && nodesToRender.length > 0 && nodesToRender.map(nodeBlock => (
          <div key={nodeBlock._id}>
            {nodeBlock._id}<br/>
            {nodeBlock.title}
          </div>
        ))}
      </Container>
    );
  }
}

const ALL_NODES_QUERY = gql`
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

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(
  compose(graphql(ALL_NODES_QUERY, { name: "allNodesQuery" }))(
    AllNodes
  )
);
