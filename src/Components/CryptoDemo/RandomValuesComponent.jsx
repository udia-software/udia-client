// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, CenterContainer, Input, Select, Textarea } from '../Styled';

const RandomValuesComponentStyled = styled(CenterContainer)`
  grid-area: random-values;
`;

type Props = {};

type State = {
  randomValuesMaxLength: number,
  randomValuesLength: number,
  randomValues: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array,
  randomValueType: string,
  randomValueTime: number,
  showRandomValues: string,
};

class RandomValuesComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      randomValuesMaxLength: 32768,
      randomValuesLength: 8192,
      randomValues: new Uint16Array(6000),
      randomValueType: 'Uint16',
      randomValueTime: -1,
      showRandomValues: 'hide',
    };
  }

  handleChangeShowRandomValues = (event: any) => {
    this.setState({ showRandomValues: event.target.value });
  };

  handleChangeRandomValuesLength = (event: any) => {
    const { randomValueType, randomValuesMaxLength } = this.state;
    let newValue = event.target.value;
    newValue = Math.min(newValue, randomValuesMaxLength);
    newValue = Math.max(newValue, 0);
    let tempRandomValues = new Uint16Array(newValue);
    switch (randomValueType) {
      case 'Uint32':
        tempRandomValues = new Uint32Array(newValue);
        break;
      case 'Int32':
        tempRandomValues = new Int32Array(newValue);
        break;
      case 'Uint16':
        tempRandomValues = new Uint16Array(newValue);
        break;
      case 'Int16':
        tempRandomValues = new Int16Array(newValue);
        break;
      case 'Uint8':
        tempRandomValues = new Uint8Array(newValue);
        break;
      case 'Int8':
        tempRandomValues = new Int8Array(newValue);
        break;
      default:
        break;
    }
    this.setState({
      randomValuesLength: newValue,
      randomValueTime: -1,
      randomValues: tempRandomValues,
    });
  };

  handleChangeRandomValueType = (event: any) => {
    const { randomValuesLength } = this.state;
    const randomValueType = event.target.value;
    let tempMaxLength = 32768;
    let tempLength = randomValuesLength;
    let tempRandomValues = new Uint16Array(tempLength);
    switch (randomValueType) {
      case 'Uint32':
        tempMaxLength = 65536 / 4;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint32Array(tempLength);
        break;
      case 'Int32':
        tempMaxLength = 65536 / 4;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Int32Array(tempLength);
        break;
      case 'Uint16':
        tempMaxLength = 65536 / 2;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint16Array(tempLength);
        break;
      case 'Int16':
        tempMaxLength = 65536 / 2;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Int16Array(tempLength);
        break;
      case 'Uint8':
        tempMaxLength = 65536;
        tempLength = Math.min(tempLength, tempMaxLength);
        tempRandomValues = new Uint8Array(tempLength);
        break;
      case 'Int8':
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
      randomValues: tempRandomValues,
    });
  };

  generateRandomValues = () => {
    const { randomValuesLength, randomValueType } = this.state;
    let temporaryArray = new Int8Array(randomValuesLength);
    let tempMaxLength = 65536;
    switch (randomValueType) {
      case 'Uint32':
        temporaryArray = new Uint32Array(randomValuesLength);
        tempMaxLength = 16384;
        break;
      case 'Int32':
        temporaryArray = new Int32Array(randomValuesLength);
        tempMaxLength = 16384;
        break;
      case 'Uint16':
        temporaryArray = new Uint16Array(randomValuesLength);
        tempMaxLength = 32768;
        break;
      case 'Int16':
        temporaryArray = new Int16Array(randomValuesLength);
        tempMaxLength = 32768;
        break;
      case 'Uint8':
        temporaryArray = new Uint8Array(randomValuesLength);
        tempMaxLength = 65536;
        break;
      case 'Int8':
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
      randomValueTime: timeTookMs,
    });
  };

  render() {
    const {
      randomValues,
      randomValuesMaxLength,
      randomValuesLength,
      randomValueType,
      randomValueTime,
      showRandomValues,
    } = this.state;
    const LengthInput = styled(Input)`
      font-size: small;
    `;
    return (
      <RandomValuesComponentStyled>
        <h2>Random Values ({randomValueType}Array)</h2>
        {showRandomValues === 'show' && (
          <Textarea value={randomValues.join(' ')} readOnly cols={40} rows={4} />
        )}
        <br />
        {randomValueTime < 0 && <span>Awaiting generation.</span>}
        {randomValueTime >= 0 && <span>Took approx. {randomValueTime}ms.</span>}
        <dl>
          <dt>Show Values</dt>
          <dd>
            <Select value={showRandomValues} onChange={this.handleChangeShowRandomValues}>
              <option value="show">Show</option>
              <option value="hide">Hide</option>
            </Select>
          </dd>
          <dt>Type</dt>
          <dd>
            <Select value={randomValueType} onChange={this.handleChangeRandomValueType}>
              <option value="Uint32">Uint32</option>
              <option value="Int32">Int32</option>
              <option value="Uint16">Uint16</option>
              <option value="Int16">Int16</option>
              <option value="Uint8">Uint8</option>
              <option value="Int8">Int8</option>
            </Select>
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
      </RandomValuesComponentStyled>
    );
  }
}

export default RandomValuesComponent;
