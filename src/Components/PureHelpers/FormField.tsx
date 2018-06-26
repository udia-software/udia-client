import React from "react";
import styled from "../AppStyles";

interface IProps {
  error?: boolean;
  success?: boolean;
}

const StyledComponent = styled.div.attrs<IProps>({})`
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    display: flex;
    flex-direction: column;
    color: ${props =>
      props.error
        ? props.theme.inputErrorColor
        : props.success
          ? props.theme.inputSuccessColor
          : "auto"};
    > input {
      grid-area: input;
      justify-items: stretch;
      align-items: center;
      justify-content: stretch;
      color: ${props =>
        props.error
          ? props.theme.inputErrorColor
          : props.success
            ? props.theme.inputSuccessColor
            : "auto"};
      background-color: ${props =>
        props.error
          ? props.theme.inputErrorBackgroundColor
          : props.success
            ? props.theme.inputSuccessBackgroundColor
            : "auto"};
      border: 1px solid
        ${props =>
          props.error
            ? props.theme.inputErrorBorderColor
            : props.success
              ? props.theme.inputSuccessBorderColor
              : "auto"};
    }
  }
`;

const FormField = (props: IProps) => <StyledComponent {...props} />;

export default FormField;
