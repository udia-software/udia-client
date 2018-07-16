import React from "react";
import styled from "./AppStyles";
import { ThemedAnchor } from "./PureHelpers/ThemedLinkAnchor";

const ContactContainer = styled.div`
  display: grid;
  place-content: center;
  align-items: center;
  justify-items: center;
`;

const Contact = () => {
  document.title = "Contact - UDIA";
  return (
    <ContactContainer>
      <h1>Contact</h1>
      <address style={{ textDecoration: "none", fontStyle: "normal" }}>
        <ThemedAnchor href="https://goo.gl/maps/sXheMfn7PRE2">
          Startup Edmonton<br />
          Unit 301 - 10359 104 Street NW<br />
          Edmonton, AB T5J 1B9<br />
          Canada
        </ThemedAnchor>
      </address>
      <dl>
        <dt>
          <ThemedAnchor href="mailto:alex@udia.ca">alex@udia.ca</ThemedAnchor>
        </dt>
        <dd style={{ marginLeft: "1em" }}>
          <strong>role</strong>: developer > president<br />
          <strong>gpg</strong>:{" "}
          <ThemedAnchor href="https://api.udia.ca/static/keys/Alexander%20Wong.asc">
            armor
          </ThemedAnchor>,{" "}
          <ThemedAnchor href="https://api.udia.ca/static/keys/Alexander%20Wong.gpg">
            raw
          </ThemedAnchor>
        </dd>
      </dl>
    </ContactContainer>
  );
};

export default Contact;
