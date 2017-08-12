import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  content: PropTypes.string
};

const defaultProps = {
  content: ""
};

const ContentHtml = ({ content }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

ContentHtml.propTypes = propTypes;
ContentHtml.defaultProps = defaultProps;

export default ContentHtml;
