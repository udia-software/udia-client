import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Container, Header } from "semantic-ui-react";
import { isAuthenticated } from "../../modules/auth";
import { CREATE_NODE_MUTATION } from "../../constants";

class ViewNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    document.title = "UDIA";
    return (
      <Container style={{ flex: 0.95 }}>
        <Header>View Node</Header>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state)
  }
}

export default connect(mapStateToProps)(
  compose(graphql(CREATE_NODE_MUTATION, { name: "createNodeMutation"}))(
    ViewNode
  )
)