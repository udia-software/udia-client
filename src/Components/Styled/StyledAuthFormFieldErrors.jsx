import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleComponent = styled.ul`
  display: ${props => (props.errors.length > 0 ? "auto" : "none")};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
`;

const StyledAuthFormFieldErrors = props => {
  const { errors } = props;
  return (
    <StyleComponent {...props}>
      {errors.map((error, index) => <li key={index}>{error}</li>)}
    </StyleComponent>
  );
};

StyledAuthFormFieldErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export { StyledAuthFormFieldErrors };
export default StyledAuthFormFieldErrors;
