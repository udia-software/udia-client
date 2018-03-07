import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledAuthFormFieldErrors = ({ errors }) => {
  const StyledList = styled.ul`
    display: ${errors.length > 0 ? "auto" : "none"};
    padding-left: 1em;
    margin-top: 0.4em;
    margin-bottom: 0;
  `;
  return (
    <StyledList>
      {errors.map((error, index) => <li key={index}>{error}</li>)}
    </StyledList>
  );
};

StyledAuthFormFieldErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export { StyledAuthFormFieldErrors };
export default StyledAuthFormFieldErrors;
