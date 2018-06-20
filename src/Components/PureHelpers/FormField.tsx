import React from "react";
import styled from "../AppStyles";

export interface IProps {
  error?: boolean;
}

const StyledComponent = styled.div.attrs<IProps>({})`
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    display: flex;
    flex-direction: column;
    color: ${props => (props.error ? props.theme.inputErrorColor : "auto")};
    > input {
      grid-area: input;
      justify-items: stretch;
      align-items: center;
      justify-content: stretch;
      color: ${props => (props.error ? props.theme.inputErrorColor : "auto")};
      background-color: ${props =>
        props.error ? props.theme.inputErrorBackgroundColor : "auto"};
      border: 1px solid
        ${props => (props.error ? props.theme.inputErrorBorderColor : "auto")};
    }
  }
`;

const FormField = (props: IProps) => <StyledComponent {...props} />;

export default FormField;
