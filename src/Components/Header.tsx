import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { withTheme } from "styled-components";
import { IRootState } from "../Modules/ConfigureReduxStore";
import {
  isAuthenticated as selectIsAuth,
  maybeAuthenticated as selectMaybeAuth,
  selectSelfUsername
} from "../Modules/Reducers/Auth/Selectors";
import styled from "./AppStyles";

const HeaderContainer = styled.div`
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${props => props.theme.panelBackgroundColor};
  align-items: center;
  padding: 0 0.4em;
`;

// nav active styles defined outside of the literal due to styled-components minificiation + react-router integration
const activeClassName = "header-nav-active";
const StyledTitleLink = styled(NavLink).attrs<{ activeClassName: string }>({
  activeClassName
})`
  justify-self: start;
  align-self: center;
  padding: 0.4em;
  font-weight: 400;
  font-size: x-large;
  border-left: 1px solid ${props => props.theme.inverseColor};
  border-right: 1px solid ${props => props.theme.inverseColor};
  transition-property: border-left, border-right;
  transition-duration: 0.2s;
  &:hover {
    border-right: 1px solid ${props => props.theme.primaryColor};
    border-left: 1px solid ${props => props.theme.primaryColor};
  }
  &.${activeClassName} {
    color: ${props => props.theme.primaryColor};
  }
`;

const StyledSubTitleLink = StyledTitleLink.extend`
  font-size: medium;
`;

const HeaderSubMenu = styled.div`
  justify-self: end;
  align-self: center;
  grid-auto-flow: column;
  display: grid;
  justify-items: end;
  align-items: center;
  justify-content: end;
  align-content: center;
`;

interface IProps {
  isAuthenticated: boolean;
  maybeAuthenticated: boolean;
  selfUsername: string | false;
}

class Header extends Component<IProps> {
  public render() {
    const { isAuthenticated, maybeAuthenticated, selfUsername } = this.props;

    return (
      <HeaderContainer>
        <StyledTitleLink to="/" activeClassName={activeClassName}>
          UDIA
        </StyledTitleLink>
        <HeaderSubMenu>
          {!maybeAuthenticated &&
            !isAuthenticated && (
              <Fragment>
                <StyledSubTitleLink
                  to="/sign-in"
                  activeClassName={activeClassName}
                >
                  Sign In
                </StyledSubTitleLink>
                <StyledSubTitleLink
                  to="/sign-up"
                  activeClassName={activeClassName}
                >
                  Sign Up
                </StyledSubTitleLink>
              </Fragment>
            )}
          {maybeAuthenticated &&
            isAuthenticated && (
              <Fragment>
                <StyledSubTitleLink
                  to="/note"
                  activeClassName={activeClassName}
                >
                  Secret Notes
                </StyledSubTitleLink>
                <StyledSubTitleLink
                  to="/auth"
                  activeClassName={activeClassName}
                >
                  {selfUsername ? selfUsername : "ERR"}
                </StyledSubTitleLink>
              </Fragment>
            )}
          {maybeAuthenticated &&
            !isAuthenticated && <span>Loading User..</span>}
        </HeaderSubMenu>
      </HeaderContainer>
    );
  }
}

function mapStateToProps(state: IRootState) {
  return {
    maybeAuthenticated: selectMaybeAuth(state),
    isAuthenticated: selectIsAuth(state),
    selfUsername: selectSelfUsername(state)
  };
}

// Pure: false here is necessary to get the NavLinks active styles working
export default withTheme(
  connect(
    mapStateToProps,
    null,
    null,
    { pure: false }
  )(Header)
);
