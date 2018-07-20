import { Link } from "react-router-dom";
import styled from "../AppStyles";

export const ThemedLink = styled(Link)`
  transition: color 0.1s ease;
  text-decoration: none;
  color: ${props => props.theme.intermediateColor};
  &:hover {
    color: ${props => props.theme.primaryColor};
  }
`;

export const ThemedAnchor = styled.a`
  cursor: pointer;
  transition: color 0.1s ease;
  text-decoration: none;
  color: ${props => props.theme.intermediateColor};
  &:hover {
    color: ${props => props.theme.primaryColor};
  }
`;
