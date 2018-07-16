import React from "react";
import styled from "../AppStyles";

const StyledUnorderedList = styled.ul.attrs<IProps>({})`
  display: ${props => (props.successes.length > 0 ? "auto" : "none")};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: "\u2714";
      color: ${({ theme }) => theme.green};
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      padding-right: 0.2em;
    }
  }
`;

interface IProps {
  successes: string[];
}

const FieldSuccesses = (props: IProps) => (
  <StyledUnorderedList {...props} successes={props.successes}>
    {props.successes.map((okmsg, idx) => <li key={idx}>{okmsg}</li>)}
  </StyledUnorderedList>
);

export default FieldSuccesses;
