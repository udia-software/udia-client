import React from "react";
import styled from "./AppStyles";

const ContactContainer = styled.div`
  display: grid;
  place-content: center;
  place-items: center;
`;

const Contact = () => {
  document.title = "Contact - UDIA";
  return (
    <ContactContainer>
      <h1>Contact</h1>
      <address style={{ textDecoration: "none", fontStyle: "normal" }}>
        <a href="https://goo.gl/maps/sXheMfn7PRE2">
          Startup Edmonton<br />
          Unit 301 - 10359 104 Street NW<br />
          Edmonton, AB T5J 1B9<br />
          Canada
        </a>
      </address>
      <dl>
        <dt>
          <a href="mailto:alex@udia.ca">alex@udia.ca</a>
        </dt>
        <dd style={{ marginLeft: "1em" }}>
          <strong>role</strong>: developer > president<br />
          <strong>gpg</strong>:{" "}
          <a href="https://api.udia.ca/static/keys/Alexander%20Wong.asc">
            armor
          </a>,{" "}
          <a href="https://api.udia.ca/static/keys/Alexander%20Wong.gpg">raw</a>
        </dd>
      </dl>
    </ContactContainer>
  );
};

export default Contact;
