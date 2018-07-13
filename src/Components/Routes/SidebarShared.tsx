import { NavLink } from "react-router-dom";
import { StyledComponentClass } from "styled-components";
import styled, { IThemeInterface } from "../AppStyles";
import { Button } from "../PureHelpers/Button";

export const WithSidebarContainer: StyledComponentClass<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface
> = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto;
  grid-template-areas: "with-sidebar-content";
`;

export const WithSidebarContentContainer: StyledComponentClass<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface
> = styled.div`
  grid-area: with-sidebar-content;
  grid-auto-rows: 1fr auto;
  grid-auto-flow: row;
  display: grid;
  height: 100%;
  @media only screen and (min-width: ${({ theme }) => theme.smScrnBrkPx}px) {
    max-width: calc(100% - 8em);
  }
`;

export const Sidebar: StyledComponentClass<
  React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      showsidebar?: string | undefined;
    },
  IThemeInterface
> = styled.div.attrs<{ showsidebar?: string }>({})`
  display: grid;
  grid-area: with-sidebar-content;
  justify-self: end;
  grid-row-gap: 1em;
  grid-auto-rows: 3em;
  grid-auto-flow: row;
  align-items: start;
  justify-items: center;
  background-color: ${({ theme }) => theme.panelBackgroundColor};
  transition: all 0.2s;
  @media only screen and (max-width: ${({ theme }) =>
      theme.smScrnBrkPx - 1}px) {
    ${({ showsidebar }) =>
      showsidebar
        ? `overflow: visible; width: auto;`
        : `overflow: hidden; width: 0px;`};
  }
  @media only screen and (min-width: ${({ theme }) => theme.smScrnBrkPx}px) {
    width: 8em;
  }
  z-index: 1;
`;

// necessary for integration with react-router, prevents tampering by minfication
export const activeClassName = "sidebar-nav-active";

export const StyledSidebarLink = styled(NavLink).attrs<{
  showsidebar?: string;
  activeClassName: string;
}>({ activeClassName })`
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: ${props => props.theme.intermediateColor};
  margin-top: 1em;
  font-size: large;
  display: grid;
  grid-auto-flow: row;
  place-items: center;
  align-content: space-evenly;
  justify-content: center;
  place-self: center;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.inverseColor};
  border-bottom: 1px solid ${({ theme }) => theme.inverseColor};
  &:hover {
    color: ${props => props.theme.primaryColor};
    border-top: 1px solid ${({ theme }) => theme.primaryColor};
    border-bottom: 1px solid ${({ theme }) => theme.primaryColor};
  }
  @media only screen and (max-width: ${({ theme }) =>
      theme.smScrnBrkPx - 1}px) {
    ${({ showsidebar }) =>
      showsidebar ? `width: 8em;` : `overflow: hidden; width: 0px;`};
  }
  &.${activeClassName} {
    color: ${({ theme }) => theme.primaryColor};
    border-top: 1px solid ${({ theme }) => theme.primaryColor};
    border-bottom: 1px solid ${({ theme }) => theme.primaryColor};
  }
`;

export const SidebarToggleButton: StyledComponentClass<
  React.ClassAttributes<HTMLButtonElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      showsidebar?: string | undefined;
    },
  IThemeInterface
> = Button.extend.attrs<{
  showsidebar?: string;
}>({})`
&:active {
  opacity: 0;  
}
${props => (props.showsidebar ? "transform: rotate(90deg);" : undefined)}
@media only screen and (
  max-width: ${({ theme: { smScrnBrkPx } }) => smScrnBrkPx - 1}px
) {
  justify-self: end;
  position: sticky;
  bottom: 1em;
  opacity: 100;
  height: 4em;
  width: 4em;
  border-radius: 50%;
  padding: 0;
  margin: 1em;
}
@media only screen and (min-width: ${props => props.theme.smScrnBrkPx}px) {
  display: none;
}
z-index: 1;
`;
