import React, { ChangeEventHandler, RefObject } from "react";
import styled from "../AppStyles";

const NoteFileEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const EditNoteTitle = styled.textarea`
  background: transparent;
  border: 2px dotted ${props => props.theme.intermediateColor};
  color: ${props => props.theme.primaryColor};
  padding: 0;
  margin: 0;
  font-size: 2em;
  height: auto;
  width: 100%;
`;

const EditNoteContent = styled.textarea`
  background: transparent;
  border-top: 0px solid ${props => props.theme.backgroundColor};
  border-left: 2px dotted ${props => props.theme.intermediateColor};
  border-right: 2px dotted ${props => props.theme.intermediateColor};
  border-bottom: 2px dotted ${props => props.theme.intermediateColor};
  color: ${props => props.theme.primaryColor};
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;

interface IProps {
  titleValue: string;
  contentValue: string;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  contentEditorRef: RefObject<HTMLTextAreaElement>;
}

const NoteFileEditorView = ({
  titleValue,
  contentValue,
  handleDraftChange,
  contentEditorRef
}: IProps) => (
  <NoteFileEditorContainer>
    <EditNoteTitle
      name="title"
      value={titleValue}
      placeholder="Untitled"
      onChange={handleDraftChange}
    />
    <EditNoteContent
      name="content"
      autoFocus={true}
      innerRef={contentEditorRef}
      value={contentValue}
      placeholder={`- What is meaningful to you?\n- What do you need to remember for later?`}
      onChange={handleDraftChange}
    />
  </NoteFileEditorContainer>
);

export default NoteFileEditorView;
