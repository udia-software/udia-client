import React from 'react';
import ReactDOM from 'react-dom';

const $ = window.$;
const MediumEditor = window.MediumEditor;

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    const options = {};
    this._updated = true;
    if (this.props.text) {
      options.placeholder = false;
    }
    this.medium = new MediumEditor(dom, Object.assign(options, this.props.options));
    $(dom).mediumInsert({
      editor: this.medium
    });

    if (this.props.text) {
      this.setState({
        text: this.props.text
      });
      this._updated = true;
    }

    /**
     * @TODO: When a large file is added, the blob preview is literally a text string 
     * in the src attribute of the img tag. This causes lagging when typing.
     */
    this.medium.subscribe('editableInput', (e) => {
      this._updated = true;
      var html = dom.innerHTML;
      var htmlWithoutButtons = $(html).filter(":not(.medium-insert-buttons)");
      var htmlWithoutButtonsText = htmlWithoutButtons.get().map(e => e.outerHTML).join('');
      this.change(htmlWithoutButtonsText);
    });
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text && !this._updated) {
      console.log(nextProps.text)
      this.setState({ text: nextProps.text });
    }

    if (this._updated) this._updated = false;
  }

  render() {
    return React.createElement('div', {
      dangerouslySetInnerHTML: { __html: this.state.text }
    });
  }

  change(text) {
    if (this.props.onChange) this.props.onChange(text, this.medium);
  }
}

export default Editor;