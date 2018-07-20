import React from "react";
import styled from "../AppStyles";
import SimpleLoader from "../Helpers/SimpleLoader";

const StatusContainer = styled.div`
  grid-area: content;
  position: sticky;
  margin-top: auto;
  margin-right: auto;
  width: auto;
  left: 0;
  bottom: 0;
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
`;

// status not yet ready
const Status = () => (
  null && <StatusContainer>
    <SimpleLoader loading={true} /> Loading...
  </StatusContainer>
);

export default Status;
