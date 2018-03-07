import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledAuthFormField = ({ warning, children }) => {
  const StyledDiv = styled.div`
    display: flex;
    padding: 0.5em 0;
    flex-direction: column;
    label {
      
    }
  `;
  return <StyledDiv>{children}</StyledDiv>;
};

StyledAuthFormField.propTypes = {
  warning: PropTypes.bool
};

export { StyledAuthFormField };
export default StyledAuthFormField;
