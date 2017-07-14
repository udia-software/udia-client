import PropTypes from "prop-types";
import React from "react";
import { Message } from "semantic-ui-react";

const propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  header: PropTypes.string
};

const defaultProps = {
  error: "",
  header: ""
};

const Error = ({ error, header }) => {
  if (typeof error === "string") {
    const hasError = !!error;
    if (hasError) {
      return <Message error={hasError} header={header} content={error} />;
    }
  } else if (typeof error === "object" && Object.keys(error).length > 0) {
    const hasError = !!Object.keys(error);
    if (hasError) {
      return (
        <Message
          error={hasError}
          header={header}
          list={Object.keys(error).map(p => (
            <Message.Item key={p}> {p} {error[p]}</Message.Item>
          ))}
        />
      );
    }
  }
  return null;
};

Error.propTypes = propTypes;
Error.defaultProps = defaultProps;

export default Error;
