import React, { Component } from "react";
import { Container, Form, Header, TextArea } from "semantic-ui-react";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import { nodeActions } from "../../modules/nodes";
import { isAuthenticated } from "../../modules/auth";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Popup from "semantic-ui-react/dist/commonjs/modules/Popup/Popup";

const propTypes = {
  dispatch: PropTypes.func.isRequired
};

class CreateNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeErrors: []
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

  render() {
    document.title = "Create Node - UDIA";
    const { title, content } = this.props;
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
        <Form>
          <Input
            fluid
            label="Title"
            placeholder="The pursuit of meaning in life"
            onChange={this._changeFormTitle}
            value={title}
            action={
              content && title ? <Button color="green">Submit</Button> : null
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

export default connect(mapStateToProps)(CreateNode);
