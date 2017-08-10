import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  content: PropTypes.string
};

const defaultProps = {
  content: ""
};

const ContentText = ({ content }) => {
  return (
    <div>
      {content.split("\n").map((item, key) => {
        return <span key={key}>{item}<br /></span>;
      })}
    </div>
  );
};

ContentText.propTypes = propTypes;
ContentText.defaultProps = defaultProps;

export default ContentText;