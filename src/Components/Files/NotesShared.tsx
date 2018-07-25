import ReactMarkdown from "react-markdown";
import styled from "../AppStyles";
import { ThemedLink } from "../Helpers/ThemedLinkAnchor";

export const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0;
`;

export const ViewNoteLinkTitle = styled(ThemedLink)`
  color: ${props => props.theme.primaryColor};
  &:hover {
    text-decoration: underline;
  }
`;

export const NoteMarkdownContent = styled(ReactMarkdown)`
  flex: 10 1 100%;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: ${props => props.theme.panelBackgroundColor};
  }
  a {
    cursor: pointer;
    transition: color 0.1s ease;
    text-decoration: none;
    color: ${props => props.theme.intermediateColor};
    &:hover {
      color: ${props => props.theme.primaryColor};
    }
  }
`;

export const NoteTextContent = styled.div`
  flex: 10 1 100%;
  margin-top: 1em;
  white-space: pre-wrap;
`;

export const MutedSpan = styled.span`
  font-style: italic;
  color: ${props => props.theme.intermediateColor};
`;

export const HorizontalLine = styled.hr`
  width: 100%;
`;

export const EditNoteTitle = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  font-family: monospace;
  padding: 0;
  margin: 0;
  font-size: 2em;
  height: 100%;
  width: 100%;
`;

export const EditNoteContent = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;
