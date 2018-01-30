import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Container, Header } from "semantic-ui-react";
import { ALL_NODES_SUBSCRIPTION, ALL_NODES_QUERY } from "../../constants";

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
      document: ALL_NODES_SUBSCRIPTION,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllNodes = [...previous.allNodes, subscriptionData.data.NodeSubscription.node];
        const result = {
          ...previous,
          allNodes: newAllNodes
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
            {nodeBlock.title || "no title"}
          </div>
        ))}
      </Container>
    );
  }
}


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
