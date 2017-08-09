import React from "react";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";

const Footer = () => {
  return (
    <Segment textAlign="center" color="teal" style={{ margin: "0" }}>
      <List bulleted horizontal link>
        <List.Item as={Link} to="/about">About</List.Item>
        <List.Item as="a" href="https://github.com/udia-software/udia">
          Source Code
        </List.Item>
        <List.Item as={Link} to="/">Udia</List.Item>
      </List>
    </Segment>
  );
};

export default Footer;
