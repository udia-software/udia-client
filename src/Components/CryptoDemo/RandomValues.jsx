import React, { Component } from "react";
import { Button, CenterContainer, Input } from "Components/Styled";
import styled from "styled-components";

const RandomValuesTextArea = props => {
  const StyledComponent = styled.textarea`
    background: black;
    color: white;
    border-radius: 1em;
  `;
  return <StyledComponent {...props} />;
};

export class RandomValuesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomValuesMaxLength: 32768,
      randomValuesLength: 8192,
      randomValues: new Uint16Array(6000),
      randomValueType: "Uint16",
      randomValueTime: -1,
      showRandomValues: "hide"
    };
  }

  handleChangeShowRandomValues = event => {
    this.setState({ showRandomValues: event.target.value });
  };

  handleChangeRandomValuesLength = event => {
    const { randomValueType, randomValuesMaxLength } = this.state;
    let newValue = event.target.value;
    newValue = Math.min(newValue, randomValuesMaxLength);
    newValue = Math.max(newValue, 0);
    let tempRandomValues = new Uint16Array(newValue);
    switch (randomValueType) {
      case "Uint32":
        tempRandomValues = new Uint32Array(newValue);
        break;
      case "Int32":
        tempRandomValues = new Int32Array(newValue);
        break;
      case "Uint16":
        tempRandomValues = new Uint16Array(newValue);
        break;
      case "Int16":
        tempRandomValues = new Int16Array(newValue);
        break;
      case "Uint8":
        tempRandomValues = new Uint8Array(newValue);
        break;
      case "Int8":
        tempRandomValues = new Int8Array(newValue);
        break;
      default:
        break;
    }
    this.setState({
      randomValuesLength: newValue,
      randomValueTime: -1,
      randomValues: tempRandomValues
    });
  };

  handleChangeRandomValueType = event => {
    const { randomValuesLength } = this.state;
    let randomValueType = event.target.value;
    let tempMaxLength = 32768;
    let tempLength = randomValuesLength;
    let tempRandomValues = new Uint16Array(tempLength);
    switch (randomValueType) {
      case "Uint32":
        tempMaxLength = 65536 / 4;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint32Array(tempLength);
        break;
      case "Int32":
        tempMaxLength = 65536 / 4;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Int32Array(tempLength);
        break;
      case "Uint16":
        tempMaxLength = 65536 / 2;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint16Array(tempLength);
        break;
      case "Int16":
        tempMaxLength = 65536 / 2;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Int16Array(tempLength);
        break;
      case "Uint8":
        tempMaxLength = 65536;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint8Array(tempLength);
        break;
      case "Int8":
        tempMaxLength = 65536;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Int8Array(tempLength);
        break;
      default:
        break;
    }
    this.setState({
      randomValueType,
      randomValuesMaxLength: tempMaxLength,
      randomValuesLength: tempLength,
      randomValueTime: -1,
      randomValues: tempRandomValues
    });
  };

  generateRandomValues = () => {
    const { randomValuesLength, randomValueType } = this.state;
    let temporaryArray = new Int8Array(randomValuesLength);
    let tempMaxLength = 65536;
    switch (randomValueType) {
      case "Uint32":
        temporaryArray = new Uint32Array(randomValuesLength);
        tempMaxLength = 16384;
        break;
      case "Int32":
        temporaryArray = new Int32Array(randomValuesLength);
        tempMaxLength = 16384;
        break;
      case "Uint16":
        temporaryArray = new Uint16Array(randomValuesLength);
        tempMaxLength = 32768;
        break;
      case "Int16":
        temporaryArray = new Int16Array(randomValuesLength);
        tempMaxLength = 32768;
        break;
      case "Uint8":
        temporaryArray = new Uint8Array(randomValuesLength);
        tempMaxLength = 65536;
        break;
      case "Int8":
        temporaryArray = new Int8Array(randomValuesLength);
        tempMaxLength = 65536;
        break;
      default:
        break;
    }

    const timeStart = performance.now();
    window.crypto.getRandomValues(temporaryArray);
    const timeTookMs = performance.now() - timeStart;

    this.setState({
      randomValues: temporaryArray,
      randomValuesMaxLength: tempMaxLength,
      randomValueTime: timeTookMs
    });
  };

  render() {
    const {
      randomValues,
      randomValuesMaxLength,
      randomValuesLength,
      randomValueType,
      randomValueTime,
      showRandomValues
    } = this.state;
    const RandomValuesComponent = styled(CenterContainer)`
      grid-area: random-values;
    `;
    const LengthInput = styled(Input)`
      font-size: small;
    `;
    const RandomValueSelector = styled.select`
      color: white;
      background-color: black;
      appearance: none;
      border-radius: 3px;
      background: transparent;
      background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position-x: 110%;
      background-position-y -3px;
      padding: 2px 1.3em 2px 3px;
    `;
    return (
      <RandomValuesComponent>
        <h2>Random Values ({randomValueType}Array)</h2>
        {showRandomValues === "show" && (
          <RandomValuesTextArea
            value={randomValues.join(" ")}
            readOnly={true}
            cols={40}
            rows={4}
          />
        )}
        <br />
        {randomValueTime < 0 && <span>Awaiting generation.</span>}
        {randomValueTime >= 0 && <span>Took approx. {randomValueTime}ms.</span>}
        <dl>
          <dt>Show Values</dt>
          <dd>
            <RandomValueSelector
              value={showRandomValues}
              onChange={this.handleChangeShowRandomValues}
            >
              <option value="show">Show</option>
              <option value="hide">Hide</option>
            </RandomValueSelector>
          </dd>
          <dt>Type</dt>
          <dd>
            <RandomValueSelector
              value={randomValueType}
              onChange={this.handleChangeRandomValueType}
            >
              <option value="Uint32">Uint32</option>
              <option value="Int32">Int32</option>
              <option value="Uint16">Uint16</option>
              <option value="Int16">Int16</option>
              <option value="Uint8">Uint8</option>
              <option value="Int8">Int8</option>
            </RandomValueSelector>
          </dd>
          <dt>Length (max {randomValuesMaxLength})</dt>
          <dd>
            <LengthInput
              value={randomValuesLength}
              onChange={this.handleChangeRandomValuesLength}
              type="number"
              min="1"
              max={randomValuesMaxLength}
            />
          </dd>
        </dl>
        <Button size="mini" onClick={this.generateRandomValues}>
          Generate Random Values
        </Button>
      </RandomValuesComponent>
    );
  }
}

export default RandomValuesComponent;
