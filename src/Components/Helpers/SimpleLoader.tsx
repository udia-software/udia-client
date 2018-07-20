import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled, { keyframes } from "../AppStyles";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface IProps { loading: boolean }

const SimpleLoader = ({ loading }: IProps) => {
  const BaseLoader = styled(FontAwesomeIcon)`
    display: inline-block;
    animation: ${rotate360} 2s linear infinite;
  `;
  if (loading) {
    return <BaseLoader icon="spinner" />;
  }
  return null;
};

export default SimpleLoader;
