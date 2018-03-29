import React, { Component } from "react";
import styled from "styled-components";
import RandomValuesComponent from "Components/CryptoDemo/RandomValues";
import { CenterContainer } from "Components/Styled";
import { DetectBrowser } from "../../Components/CryptoDemo/DetectBrowser";

const RawWebCryptoPageDiv = styled(CenterContainer)`
  grid-template-areas:
    "title"
    "description"
    "random-values";
`;

const WebCryptoPageContainer = props => {
  return <RawWebCryptoPageDiv {...props} />;
};

export class WebCryptoPage extends Component {
  render() {
    document.title = "Web Crypto - UDIA";

    const Title = styled.h1`
      grid-area: title;
    `;
    const Description = styled.div`
      grid-area: description;
      min-width: 18rem;
      @media screen and (min-width: 768px) {
        max-width: 24rem;
      }
    `;

    return (
      <WebCryptoPageContainer>
        <Title>Web Crypto</Title>
        <Description>
          Proof of concept. Be wary of security and privacy.<br />
          <ul>
            <li>
              <a href="https://caniuse.com/#feat=cryptography">
                Can I use WebCrypto?
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
                Web Crypto API
              </a>
            </li>
          </ul>
          <dl>
            <dt>User Agent</dt>
            <dd>{navigator.userAgent}</dd>
            <dt>Possible User Browser</dt>
            <dd>
              <DetectBrowser />
            </dd>
            <dt>Web Crypto Module Defined</dt>
            <dd>{Boolean(typeof window.crypto !== "undefined").toString()}</dd>
          </dl>
        </Description>
        <RandomValuesComponent />
      </WebCryptoPageContainer>
    );
  }
}

export default WebCryptoPage;
