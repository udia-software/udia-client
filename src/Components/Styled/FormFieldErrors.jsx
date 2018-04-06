import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleComponent = styled.ul`
  display: ${props => (props.errors.length > 0 ? "auto" : "none")};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: "↑";
      color: #9f3a38;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
`;

const FormFieldErrors = props => {
  const { errors } = props;
  return (
    <StyleComponent {...props}>
      {errors.map((error, index) => <li key={index}>{error}</li>)}
    </StyleComponent>
  );
};

FormFieldErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export { FormFieldErrors };
export default FormFieldErrors;
