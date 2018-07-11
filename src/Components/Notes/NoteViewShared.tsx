import ReactMarkdown from "react-markdown";
import styled from "../AppStyles";

export const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0;
`;

export const NoteMarkdownContent = styled(ReactMarkdown)`
  flex: 10 1 100%;
`;

export const NoteTextContent = styled.div`
  margin-top: 1em;
  white-space pre-line;
`;
