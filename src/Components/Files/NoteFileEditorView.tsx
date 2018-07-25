import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  RefObject
} from "react";
import ReactMarkdown from "react-markdown";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import MutedSpan from "../Helpers/MutedSpan";

const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0;
`;

const NoteMarkdownContent = styled(ReactMarkdown)`
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

const NoteTextContent = styled.div`
  flex: 10 1 100%;
  margin-top: 1em;
  white-space: pre-wrap;
`;

const NoteEditorLoadingGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas: "note-editor";
`;

const NoteFileEditorContainer = styled.div`
  grid-area: note-editor;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const EditNoteTitle = styled.textarea`
  background: transparent;
  font-family: monospace;
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
  font-family: monospace;
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

const DiscardDraftButton = styled(ProcessDraftButton)`
  border-color: ${props => props.theme.red};
`;

const SaveDraftButton = styled(ProcessDraftButton)`
  border-color: ${props => props.theme.green};
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
  isRaw: boolean;
  isPreview: boolean;
  hasDraft: boolean;
  noteType: "text" | "markdown";
  titleValue: string;
  contentValue: string;
  handleTogglePreview: MouseEventHandler<HTMLElement>;
  handleDraftFocus: FocusEventHandler<HTMLTextAreaElement>;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleDiscardDraft: MouseEventHandler<HTMLElement>;
  handleSaveDraft: MouseEventHandler<HTMLElement>;
  handleDeleteNote: MouseEventHandler<HTMLElement>;
  titleRef: RefObject<HTMLTextAreaElement>;
  contentRef: RefObject<HTMLTextAreaElement>;
}

const NoteFileEditorView = ({
  loading,
  loadingText,
  isRaw,
  isPreview,
  hasDraft,
  noteType,
  titleValue,
  contentValue,
  handleDraftChange,
  handleDraftFocus,
  handleTogglePreview,
  handleDiscardDraft,
  handleSaveDraft,
  handleDeleteNote,
  titleRef,
  contentRef
}: IProps) => (
  <NoteEditorLoadingGrid>
    <GridTemplateLoadingOverlay
      gridAreaName="note-editor"
      loading={loading}
      loadingText={loadingText}
    />
    <NoteFileEditorContainer>
      {isPreview ? (
        <ViewNoteTitle>
          {titleValue || <MutedSpan>Untitled</MutedSpan>}
        </ViewNoteTitle>
      ) : (
        <EditNoteTitle
          id="edit-note-title"
          key="edit-note-title"
          rows={1}
          name="title"
          innerRef={titleRef}
          value={titleValue}
          placeholder="Untitled"
          onChange={handleDraftChange}
          onFocus={handleDraftFocus}
        />
      )}
      {isPreview ? (
        <div style={{ height: "100%" }}>
          {contentValue ? (
            noteType === "markdown" ? (
              <NoteMarkdownContent source={contentValue} />
            ) : (
              <NoteTextContent>{contentValue}</NoteTextContent>
            )
          ) : (
            <MutedSpan>No Content</MutedSpan>
          )}
        </div>
      ) : (
        <EditNoteContent
          id="edit-note-content"
          key="edit-note-content"
          name="content"
          innerRef={contentRef}
          value={contentValue}
          placeholder={`- What is meaningful to you?\n- What do you need to remember for later?`}
          onChange={handleDraftChange}
          onFocus={handleDraftFocus}
        />
      )}
      <EditorActions>
        {hasDraft && (
          <DiscardDraftButton onClick={handleDiscardDraft}>
            <FontAwesomeIcon icon="trash" /> Discard Draft
          </DiscardDraftButton>
        )}
        {hasDraft && (
          <SaveDraftButton onClick={handleSaveDraft}>
            <FontAwesomeIcon icon="save" /> Save Draft
          </SaveDraftButton>
        )}
        {!hasDraft &&
          isRaw && (
            <DiscardDraftButton onClick={handleDeleteNote}>
              <FontAwesomeIcon icon="trash" /> Delete Note
            </DiscardDraftButton>
          )}
        <ProcessDraftButton onClick={handleTogglePreview}>
          {isPreview ? (
            <span>
              <FontAwesomeIcon icon="pencil-alt" /> Edit Note
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon="eye" /> Preview Note
            </span>
          )}
        </ProcessDraftButton>
      </EditorActions>
    </NoteFileEditorContainer>
  </NoteEditorLoadingGrid>
);

export default NoteFileEditorView;
