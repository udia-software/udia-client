import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleComponent = styled.div`
  display: flex;
  padding: 0.5em 0;
  flex-direction: column;
  label {
  }
`;
const StyledAuthFormField = props => {
  return <StyleComponent {...props} />;
};

StyledAuthFormField.propTypes = {
  warning: PropTypes.bool
};

export { StyledAuthFormField };
export default StyledAuthFormField;
