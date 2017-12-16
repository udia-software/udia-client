import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";

class AllNodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeErrors: []
    };
  }

  render() {
    document.title = "All Nodes - UDIA";
    return (
      <Container>
        <Header>All Nodes</Header>
        to do
      </Container>
    );
  }
}

export default AllNodes;
