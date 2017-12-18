import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import {
  Button,
  Container,
  Form,
  Header,
  Icon,
  Input,
  Label,
  Popup,
  TextArea
} from "semantic-ui-react";
import { nodeActions } from "../../modules/nodes";
import { isAuthenticated } from "../../modules/auth";

const propTypes = {
  dispatch: PropTypes.func.isRequired
};

class CreateNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      titleErrors: [],
      contentErrors: []
    };
  }

  _changeFormTitle = event => {
    const { dispatch } = this.props;
    dispatch(nodeActions.setFormTitle(event.target.value));
  };

  _changeFormContent = event => {
    const { dispatch } = this.props;
    dispatch(nodeActions.setFormContent(event.target.value));
  };

  _submit = async event => {
    event.preventDefault();
    const { title, content, dispatch, history } = this.props;
    const type = "TEXT";
    this.setState({ loading: true });
    try {
      const result = await this.props.createNodeMutation({
        variables: { title, content, type }
      });
      dispatch(nodeActions.setFormTitle(""));
      dispatch(nodeActions.setFormContent(""));
      console.log(result.data.createNode);
      history.push(`/all`);
    } catch (err) {
      console.error(err);
      (err.graphQLErrors || []).forEach(graphqlError => {
        let { title, content } = graphqlError.state;
        this.setState({
          titleErrors: title,
          contentErrors: content
        });
      });
      this.setState({ loading: false });
    }
  };

  render() {
    document.title = "Create Node - UDIA";
    const { title, content } = this.props;
    const { titleErrors, contentErrors, loading } = this.state;
    const titleError = titleErrors && titleErrors.length > 0;
    const contentError = contentErrors && contentErrors.length > 0;
    return (
      <Container style={{ flex: 0.95 }}>
        <div stle={{ display: "block", wordWrap: "break-word" }}>
          <ReactMarkdown source={content} />
        </div>
        <div>
          {!content && <Header>Create Node</Header>}
          {content && (
            <Label
              pointing
              circular
              color="black"
              style={{ textAlign: "center", width: "-webkit-fill-available" }}
            >
              This is how others will see you.
            </Label>
          )}
        </div>
        <Form
          onSubmit={this._submit}
          error={titleError || contentError}
          loading={loading}
        >
          <Input
            fluid
            label="Title"
            placeholder="The pursuit of meaning in life"
            onChange={this._changeFormTitle}
            value={title}
            action={
              content && title ? (
                <Button disabeld={!loading} color="green">
                  Submit
                </Button>
              ) : null
            }
          />
          <TextArea
            autoHeight
            onChange={this._changeFormContent}
            value={content}
            placeholder="the courage to write and commit a single character."
          />
        </Form>
        <Popup
          trigger={
            <Label size="tiny">
              <Icon name="pencil" /> Markdown
            </Label>
          }
          position="bottom left"
        >
          Try <code>**doing** __this__</code>.
        </Popup>
      </Container>
    );
  }
}

CreateNode.propTypes = propTypes;

const CREATE_NODE_MUTATION = gql`
  mutation CreateNodeMutation(
    $type: NodeType!
    $title: String!
    $content: String!
  ) {
    createNode(type: $type, title: $title, content: $content) {
      _id
      type
      title
      content
      createdAt
      updatedAt
      createdBy {
        _id
      }
    }
  }
`;

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state),
    content: state.nodes.content,
    title: state.nodes.title
  };
}

export default connect(mapStateToProps)(
  compose(graphql(CREATE_NODE_MUTATION, { name: "createNodeMutation" }))(
    CreateNode
  )
);
