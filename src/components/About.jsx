import React from "react";
import { Container, Divider, Header, List } from "semantic-ui-react";

const About = () => (
  <div>
    <Container textAlign="center">
      <Header as="h3">You are the Universe.</Header>
      <Header as="h3">The Universe Dreams.</Header>
    </Container>
    <Container textAlign="center" text>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 90 90"
        enableBackground="new 0 0 90 90"
      >
        <polygon points="38.182,57.753 20.18,47.91 20.18,42.455 38.182,32.652 38.182,39.074 25.625,45.113 38.182,51.379 " />
        <polygon points="39.848,62.08 46.351,27.918 50.136,27.918 43.56,62.08 " />
        <polygon points="51.8,57.78 51.8,51.4 64.372,45.181 51.8,39.028 51.8,32.696 69.82,42.5 69.82,47.91 " />
        <path d="M44.999,86.031L9.465,65.517V24.484L44.999,3.969l35.536,20.516v41.029L44.999,86.031L44.999,86.031z M13.07,63.434  l31.929,18.434L76.93,63.434V26.566L44.999,8.131L13.07,26.565V63.434L13.07,63.434z" />
      </svg>
    </Container>
    <Container textAlign="center">
      <Header as="h3">In the Dream, I exist.</Header>
      <Header as="h3">I am Aware.</Header>
    </Container>
    <Container>
      <Header as="h2">About</Header>
      <p>Udia is the inverse of Idea.</p>
      <p>
        It is the understanding that
        {" "}
        <strong>You</strong>
        {" "}
        and
        {" "}
        <strong>I</strong>
        {" "}
        are interconnected through a
        {" "}
        <strong>D</strong>
        ream and through an
        {" "}
        <strong>A</strong>
        wareness.
      </p>
      <p>It is the natural exploration of solispsim taken to its extreme.</p>
      <Divider />
      <Header as="h2">Technical</Header>
      <p>
        You are visiting a prototype- an alpha of a site. Chances are good that any data entered will be wiped upon future releases.
      </p>
      <List>
        <List.Item>
          <List.Icon name="legal" />
          <List.Content>
            <a href="https://github.com/udia-software/udia/blob/master/LICENSE">
              License
            </a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="github" />
          <List.Content>
            <a href="https://github.com/udia-software/udia">Udia (server)</a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="github" />
          <List.Content>
            <a href="https://github.com/udia-software/udia-client">
              Udia (browser client)
            </a>
          </List.Content>
        </List.Item>
      </List>
      <Divider />
      <Header as="h2">Contact</Header>
      <List>
        <List.Item>
          <List.Icon name="industry" />
          <List.Content>Udia Software Incorporated</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="marker" />
          <List.Content>
            <a href="https://goo.gl/maps/yP69RcVZEU62">
              #301 - 10359 104 St NW<br />
              Edmonton, Alberta<br />
              T5J 1B9<br />
              Canada
            </a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="mail" />
          <List.Content>
            <a href="mailto:admin@udia.ca">admin@udia.ca</a>
          </List.Content>
        </List.Item>
      </List>
    </Container>
  </div>
);

export default About;
