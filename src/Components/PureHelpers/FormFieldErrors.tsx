import React from "react";
import styled from "../AppStyles";

const StyledUnorderedList = styled.ul.attrs<IProps>({})`
  display: ${props => (props.errors.length > 0 ? "auto" : "none")};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: "\u26A0";
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

const FormFieldErrors = (props: IProps) => (
  <StyledUnorderedList {...props} errors={props.errors}>
    {props.errors.map((errStr, idx) => <li key={idx}>{errStr}</li>)}
  </StyledUnorderedList>
);

export default FormFieldErrors;
