// @flow
import React from 'react';
import styled from 'styled-components';
import RandomValuesComponent from '../../Components/CryptoDemo/RandomValuesComponent';
import DerivePasswordComponent from '../../Components/CryptoDemo/DerivePasswordComponent';
import { CenterContainer } from '../../Components/Styled';
import { DetectBrowser } from '../../Components/CryptoDemo/DetectBrowser';

const RawWebCryptoPageDiv = styled(CenterContainer)`
  grid-template-areas:
    'title'
    'description'
    'random-values'
    'derive-password';
`;

const WebCryptoPageContainer = props => <RawWebCryptoPageDiv {...props} />;

const WebCryptoPage = () => {
  document.title = 'Web Crypto - UDIA';

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
            <a href="https://caniuse.com/#feat=cryptography">Can I use WebCrypto?</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
              Web Crypto API
            </a>
          </li>
          <li>
            <a href="https://udia-software.github.io/webcrypto-examples/">
              Full Web Crypto Examples
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
        </dl>
      </Description>
      <RandomValuesComponent />
      <DerivePasswordComponent />
    </WebCryptoPageContainer>
  );
};

export default WebCryptoPage;
