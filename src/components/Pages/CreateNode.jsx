import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
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
import { CREATE_NODE_MUTATION } from "../../constants";

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

  componentDidMount = () => {
    const { isAuthenticated, history } = this.props;
    if (!isAuthenticated) {
      history.push(`/`);
    }
  };

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
    const dataType = "TEXT";
    const relationType = "POST";
    this.setState({ loading: true });
    try {
      const result = await this.props.createNodeMutation({
        variables: { title, content, dataType, relationType }
      });
      dispatch(nodeActions.setFormTitle(""));
      dispatch(nodeActions.setFormContent(""));
    } catch (err) {
      console.error(err);
      (err.graphQLErrors || []).forEach(graphqlError => {
        console.log(graphqlError);
        let { title, content } = graphqlError.state;
        this.setState({
          titleErrors: title,
          contentErrors: content
        });
      });
    } finally {
      this.setState({ loading: false });
      const { titleErrors, contentErrors } = this.state;
      const titleError = titleErrors && titleErrors.length > 0;
      const contentError = contentErrors && contentErrors.length > 0;
      if (!titleError && !contentError) {
        history.push(`${"/all"}`);
      }
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
                <Button disabled={!!loading} color="green">
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
