import React from "react";
import styled from "styled-components";

const StyleComponent = styled.div`
  display: grid;
  grid-auto-rows: auto;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;

  grid-area: content;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;

const CenterContainer = props => {
  return <StyleComponent {...props} />;
};
export { CenterContainer };
export default CenterContainer;
