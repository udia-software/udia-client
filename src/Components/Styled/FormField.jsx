import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleComponent = styled.div`
  display: flex;
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    color: ${props => (props.error ? "#e0b4b4" : "auto")};
  }

  > input {
    color: ${props => (props.error ? "#9f3a38" : "auto")};
    background-color: ${props => (props.error ? "#e0b4b4" : "auto")};
  }
`;

const FormField = props => {
  return <StyleComponent {...props} />;
};

FormField.propTypes = {
  error: PropTypes.bool.isRequired
};

export { FormField };
export default FormField;
