import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledGridLoadingOverlay = styled.div`
  display: ${props => (props.loading ? "grid" : "none")};
  grid-auto-rows: auto;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  grid-area: ${props => props.gridAreaName};
  background-color: #000000;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: 1;
`;
const GridLoadingOverlay = props => {
  return (
    <StyledGridLoadingOverlay {...props}>
      <svg id="loading-logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 90 90"
          enableBackground="new 0 0 90 90"
        >
          <polygon
            className="loader-bracket"
            points="38.182,57.753 20.18,47.91 20.18,42.455 38.182,32.652 38.182,39.074 25.625,45.113 38.182,51.379 "
          />
          <polygon
            className="loader-slash"
            points="39.848,62.08 46.351,27.918 50.136,27.918 43.56,62.08 "
          />
          <polygon
            className="loader-bracket"
            points="51.8,57.78 51.8,51.4 64.372,45.181 51.8,39.028 51.8,32.696 69.82,42.5 69.82,47.91 "
          />
          <path
            className="loader-hexagon"
            d="M44.999,86.031L9.465,65.517V24.484L44.999,3.969l35.536,20.516v41.029L44.999,86.031L44.999,86.031z M13.07,63.434 l31.929,18.434L76.93,63.434V26.566L44.999,8.131L13.07,26.565V63.434L13.07,63.434z"
          />
        </svg>
      </svg>
      Loading
    </StyledGridLoadingOverlay>
  );
};

GridLoadingOverlay.propTypes = {
  gridAreaName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

export { GridLoadingOverlay };
export default GridLoadingOverlay;
