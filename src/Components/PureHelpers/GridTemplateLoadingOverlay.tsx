import React from "react";
import styled from "../AppStyles";
import Logo from "../Static/Logo";

const StyledGridLoadingOverlay = styled.div.attrs<IProps>({})`
  display: ${props => (props.loading ? "grid" : "none")};
  grid-auto-rows: auto;
  place-items: center;
  place-content: center;
  background-color: ${props => props.theme.backgroundColor};
  padding-bottom: 1px;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: 1;
  grid-area: ${props => props.gridAreaName};
`;

interface IProps {
  gridAreaName: string;
  loading: boolean;
  loadingText?: string;
}

const GridTemplateLoadingOverlay = (props: IProps) => (
  <StyledGridLoadingOverlay {...props}>
    <Logo isLoading={props.loading} height="80px" />
    {!!props.loadingText ? props.loadingText : "Loading..."}
  </StyledGridLoadingOverlay>
);

export default GridTemplateLoadingOverlay;
