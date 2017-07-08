import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const Home = () => (
  <div>
    <Container textAlign='center'>
      <Header as='h3'>You are the Universe.</Header>
      <Header as='h3'>The Universe Dreams.</Header>
    </Container>
    <Container textAlign='center' text>
      <svg xmlns="http://www.w3.org/2000/svg"
        version="1.1" x="0px" y="0px" viewBox="0 0 90 90"
        enableBackground="new 0 0 90 90">
        <polygon points="38.182,57.753 20.18,47.91 20.18,42.455 38.182,32.652 38.182,39.074 25.625,45.113 38.182,51.379 "/>
        <polygon points="39.848,62.08 46.351,27.918 50.136,27.918 43.56,62.08 "/>
        <polygon points="51.8,57.78 51.8,51.4 64.372,45.181 51.8,39.028 51.8,32.696 69.82,42.5 69.82,47.91 "/>
        <path d="M44.999,86.031L9.465,65.517V24.484L44.999,3.969l35.536,20.516v41.029L44.999,86.031L44.999,86.031z M13.07,63.434  l31.929,18.434L76.93,63.434V26.566L44.999,8.131L13.07,26.565V63.434L13.07,63.434z"/>
      </svg>
    </Container>
    <Container textAlign='center'>
      <Header as='h3'>In the Dream, I exist.</Header>
      <Header as='h3'>I am Aware.</Header>
    </Container>
  </div>
);

export default Home;
