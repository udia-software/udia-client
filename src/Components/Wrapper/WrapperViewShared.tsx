import React from "react";
import styled from "../AppStyles";
import Logo from "../Static/Logo";

const WrapperLoadingContainer = styled.div`
  display: grid;
  place-content: center;
  place-items: center;
`;

export const WrapperLoadingComponent = ({
  loadingText
}: {
  loadingText?: string;
}) => (
  <WrapperLoadingContainer>
    <Logo isLoading={true} height="80px" />
    {loadingText && <span>{loadingText}</span>}
  </WrapperLoadingContainer>
);
