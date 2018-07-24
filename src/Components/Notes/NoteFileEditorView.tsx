import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEventHandler, MouseEventHandler, RefObject } from "react";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import { MutedSpan, NoteMarkdownContent, ViewNoteTitle } from "./NotesShared";

const NoteFileEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const EditNoteTitle = styled.textarea`
  background: transparent;
  color: ${props => props.theme.primaryColor};
  border: 0px;
  padding: 0;
  margin: 0;
  font-size: 2em;
  height: auto;
  width: 100%;
`;

const EditNoteContent = styled.textarea`
  background: transparent;
  color: ${props => props.theme.primaryColor};
  border: 0px;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;

const EditorActions = styled.div`
  width: 100%;
  text-align: right;
`;

const ProcessDraftButton = styled(Button)`
  margin: auto;
  padding: 0.3em 0.1em;
  width: 8em;
`;

const TogglePreviewButton = styled(Button)`
  margin: auto;
  padding: 0.3em 0.1em;
  width: 8em;
`;

interface IProps {
  isPreview: boolean;
  hasDraft: boolean;
  titleValue: string;
  contentValue: string;
  handleTogglePreview: MouseEventHandler<HTMLElement>;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleDiscardDraft: MouseEventHandler<HTMLElement>;
  contentEditorRef: RefObject<HTMLTextAreaElement>;
}

const NoteFileEditorView = ({
  isPreview,
  hasDraft,
  titleValue,
  contentValue,
  handleTogglePreview,
  handleDraftChange,
  handleDiscardDraft,
  contentEditorRef
}: IProps) => (
  <div style={{ height: "100%" }}>
    <NoteFileEditorContainer>
      {isPreview ? (
        <ViewNoteTitle>
          {titleValue || <MutedSpan>Untitled</MutedSpan>}
        </ViewNoteTitle>
      ) : (
        <EditNoteTitle
          name="title"
          value={titleValue}
          placeholder="Untitled"
          onChange={handleDraftChange}
        />
      )}
      {isPreview ? (
        <div style={{ height: "100%" }}>
          {contentValue ? (
            <NoteMarkdownContent source={contentValue} />
          ) : (
            <MutedSpan>No Content</MutedSpan>
          )}
        </div>
      ) : (
        <EditNoteContent
          name="content"
          autoFocus={true}
          innerRef={contentEditorRef}
          value={contentValue}
          placeholder={`- What is meaningful to you?\n- What do you need to remember for later?`}
          onChange={handleDraftChange}
        />
      )}
      <EditorActions>
        {hasDraft && (
          <ProcessDraftButton onClick={handleDiscardDraft}>
            <FontAwesomeIcon icon="trash" /> Discard Draft
          </ProcessDraftButton>
        )}
        {hasDraft && (
          <ProcessDraftButton>
            <FontAwesomeIcon icon="save" /> Save Draft
          </ProcessDraftButton>
        )}

        <TogglePreviewButton onClick={handleTogglePreview}>
          {isPreview ? (
            <span>
              <FontAwesomeIcon icon="pencil-alt" /> Edit Note
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon="eye" /> Preview Note
            </span>
          )}
        </TogglePreviewButton>
      </EditorActions>
    </NoteFileEditorContainer>
  </div>
);

export default NoteFileEditorView;
