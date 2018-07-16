import React from "react";
import styled from "../AppStyles";

const StyledUnorderedList = styled.ul.attrs<IProps>({})`
  ${props =>
    props.errors.length > 0 ? "" : "display: none;"} padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: "\u2718";
      color: ${props => props.theme.red};
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      padding-right: 0.2em;
    }
  }
`;

interface IProps {
  errors: string[];
}

const FieldErrors = (props: IProps) => (
  <StyledUnorderedList {...props} errors={props.errors}>
    {props.errors.map((errStr, idx) => <li key={idx}>{errStr}</li>)}
  </StyledUnorderedList>
);

export default FieldErrors;
