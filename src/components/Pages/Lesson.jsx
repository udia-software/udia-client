import React from "react";
import { Container, Header, List, Segment } from "semantic-ui-react";
import Logo from "../Static/Logo";

export const Lesson = () => {
  const TOC_STYLE = { fontSize: "1.33em" }
  const SQUARE_STYLE = { width: 175, height: 175 }
  document.title = "UDIA - The Fundamental Lesson";
  return (
    <div style={{ flex: 1 }}>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h2">
            The Fundamental Lesson
          </Header>
          <p style={TOC_STYLE}>
            So, if I may start by insulting your intelligence, with what is called the most elementary lesson.
            </p>
          <p style={TOC_STYLE}>
            The thing that we should have learned before we learned:
          </p>
          <List style={TOC_STYLE} ordered>
            <List.Item>) One.</List.Item>
            <List.Item>) Two.</List.Item>
            <List.Item>) Three.</List.Item>
          </List>
          <p style={{ ...TOC_STYLE, textAlign: 'center' }}>
            Or
          </p>
          <List style={{ ...TOC_STYLE, textAlign: 'right' }}>
            <List.Item>A.</List.Item>
            <List.Item>B.</List.Item>
            <List.Item>C.</List.Item>
          </List>
          <p style={TOC_STYLE}>
            The lesson is quite simply this:
          </p>
          <p style={TOC_STYLE}>
            Any experience that we have through our senses, whether of sound or of light, or of touch, is
            a <strong>vibration</strong>.
            A vibration has two aspects, one called <code>on</code> and one called <code>off</code>.
            Vibration seems to be propagated by waves. Every wave has <code>crests</code> and it
            has <code>troughs</code>.
            Therefore, life is a system of now you see it, now you don't. These two aspects <strong>always</strong> go
            together.
          </p>
          <p style={TOC_STYLE}>
            Take, for instance, sound. Sound is not <i>pure</i> sound. It is a rapid alternation of sound and slience.
          </p>
          <p style={TOC_STYLE}>
            This is simply the way things are! You must remember that the crest and the trough of the wave are
            inseperable.
            Just like you don't encounter people with fronts but no backs.
            Just like you don't encounter coins with heads but no tails.
          </p>
          <p style={TOC_STYLE}>
            And although the heads and the tails; the fronts and the backs; the positives and the negatives are
            different- they're are the same time one.
          </p>
          <p style={{...TOC_STYLE, textAlign: 'right', paddingTop: '2em'}}>
            Different things can be inseperable.
          </p>
          <div style={{ textAlign: '-webkit-center', paddingBottom: '1em' }}>
            <Segment circular style={SQUARE_STYLE}>
              <Header as='h2'>
                WHITE
              <Header.Subheader>
                  implies
              </Header.Subheader>
              </Header>
            </Segment>
            <Segment circular inverted style={SQUARE_STYLE}>
              <Header as='h2' inverted>
                <Header.Subheader>
                  implies
              </Header.Subheader>
                BLACK
            </Header>
            </Segment>
          </div>
          <p style={{...TOC_STYLE, textAlign: 'left', paddingBottom: '2em'}}>
            What is explicitly two can, at the same time, be implicitly one.
          </p>
          <Logo />
          <p style={{ ...TOC_STYLE, textAlign: 'center', paddingTop: '4em' }}>
            UDIA
          </p>
        </Container>
      </Segment>
    </div>
  );
};

export default Lesson;
