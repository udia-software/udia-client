import React, { Component } from "react";
import { Button, CenterContainer, Input } from "../Styled";
import styled from "styled-components";
import pbkdf2 from "pbkdf2";

const DerivePasswordComponentStyled = styled(CenterContainer)`
  grid-area: derive-password;
`;

export class DerivePasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInputtedPassword: "password1",
      username: "testusername",
      lUsername: "testusername",
      iterations: 3000,
      iterationsMax: 100000,
      keylen: 768,
      digest: "SHA512",
      pw: "",
      mk: "",
      ak: "",
      deriveKeyTime: -1
    };
  }

  handleChangeIterations = event => {
    const { iterationsMax } = this.state;
    let newValue = event.target.value;
    newValue = Math.min(newValue, iterationsMax);
    newValue = Math.max(newValue, 1);
    this.setState({ iterations: newValue });
  };

  handleChangeUsername = event => {
    this.setState({
      username: event.target.value,
      lUsername: event.target.value.trim().toLowerCase()
    });
  };

  handleChangeUserInputtedPassword = event => {
    this.setState({ userInputtedPassword: event.target.value });
  };

  derivePassword = () => {
    const {
      lUsername,
      userInputtedPassword,
      iterations,
      keylen,
      digest
    } = this.state;
    const timeStart = performance.now();
    const decoder = new TextDecoder("utf8");
    const tempRandomArray = new Uint8Array(256);
    window.crypto.getRandomValues(tempRandomArray);
    const randomSalt = decoder.decode(tempRandomArray);
    pbkdf2.pbkdf2(
      userInputtedPassword,
      `${randomSalt}${lUsername}`,
      iterations,
      keylen,
      digest,
      (err, key) => {
        if (err) console.error(err);
        const threekeys = {
          pw: decoder.decode(key.slice(0, keylen / 3)),
          mk: decoder.decode(key.slice(keylen / 3, keylen / 3 * 2)),
          ak: decoder.decode(key.slice(keylen / 3 * 2, keylen))
        };
        const timeTookMs = performance.now() - timeStart;
        this.setState({ ...threekeys, deriveKeyTime: timeTookMs });
      }
    );
    // window.crypto.subtle.generateKey(
    //   { name: "PBKDF2" },
    //   true,
    //   ["deriveKey", "deriveBits"]
    // );
  };

  render() {
    const {
      userInputtedPassword,
      username,
      lUsername,
      iterations,
      iterationsMax,
      pw,
      mk,
      ak,
      deriveKeyTime
    } = this.state;
    return (
      <DerivePasswordComponentStyled>
        <h2>Derive Password</h2>
        {deriveKeyTime < 0 && <span>Awaiting generation.</span>}
        {deriveKeyTime >= 0 && <span>Took approx. {deriveKeyTime}ms.</span>}
        <Input
          value={iterations}
          onChange={this.handleChangeIterations}
          type="number"
          min="1"
          max={iterationsMax}
        />
        <span>how may iterations to spend on key generation</span>
        <Input
          value={username}
          onChange={this.handleChangeUsername}
          placeholder="Test username."
          type="text"
        />
        <span>lower case, trimmed username: {lUsername || "N/A"}</span>
        <Input
          value={userInputtedPassword}
          onChange={this.handleChangeUserInputtedPassword}
          placeholder="PW in plaintext! WARN."
          type="text"
        />
        <div>
          pw: {pw || "N/A"}
          <br />
          mk: {mk || "N/A"}
          <br />
          ak: {ak || "N/A"}
        </div>
        <Button size="mini" onClick={this.derivePassword}>
          Derive Password
        </Button>
      </DerivePasswordComponentStyled>
    );
  }
}

export default DerivePasswordComponent;
