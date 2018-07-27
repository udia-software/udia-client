import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  RefObject
} from "react";
import ReactMarkdown from "react-markdown";
import styled from "../AppStyles";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import HorizontalLine from "../Helpers/HorizontalLine";
import MutedSpan from "../Helpers/MutedSpan";
import { ThemedAnchor } from "../Helpers/ThemedLinkAnchor";
import { DiscardDraftButton, EditItemTitle, EditorActions, ProcessDraftButton, SaveDraftButton } from "./ItemFileShared";

const downloadRaw = (raw: Item | DecryptedNote, type: "ENC" | "DEC") => () => {
  const elem = document.createElement("a");
  const rawFile = new Blob([JSON.stringify(raw, null, 2)], {
    type: "application/json"
  });
  elem.href = URL.createObjectURL(rawFile);
  let filename = "Untitled";
  if (type === "ENC" && (raw as Item).uuid) {
    filename = (raw as Item).uuid;
  } else if (type === "DEC" && (raw as DecryptedNote).title) {
    filename = (raw as DecryptedNote).title;
  }
  elem.download = `${filename}.json`;
  elem.click();
};

const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0;
`;

const NoteMarkdownContent = styled(ReactMarkdown)`
  flex: 10 1 100%;
  img {
    max-width: 100%;
    height: auto;
  }
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

const HiddenPointerAnchor = styled(ThemedAnchor)`
  color: ${props => props.theme.backgroundColor};
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
  isEditing: boolean;
  isPreview: boolean;
  hasDraft: boolean;
  noteType: "text" | "markdown";
  titleValue: string;
  contentValue: string;
  protocolVersion?: string;
  rawNoteItem?: Item;
  processedNoteItem?: ProcessedNotePayload;
  handleTogglePreview: MouseEventHandler<HTMLElement>;
  handleDraftFocus: FocusEventHandler<HTMLTextAreaElement>;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleDiscardDraft: MouseEventHandler<HTMLElement>;
  handleSaveDraft: MouseEventHandler<HTMLElement>;
  handleDeleteNote: MouseEventHandler<HTMLElement>;
  titleRef: RefObject<HTMLTextAreaElement>;
  contentRef: RefObject<HTMLTextAreaElement>;
}

const NoteItemEditorView = ({
  loading,
  loadingText,
  isEditing,
  isPreview,
  hasDraft,
  noteType,
  titleValue,
  contentValue,
  protocolVersion,
  rawNoteItem,
  processedNoteItem,
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
        <EditItemTitle
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
      {isPreview && rawNoteItem && !hasDraft ? (
        <div style={{ width: "100%" }}>
          <HorizontalLine />
          {processedNoteItem && (
            <span>
              {"client processed on: "}
              <MutedSpan>
                {DateTime.fromMillis(
                  processedNoteItem.processedAt
                ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}
              </MutedSpan>
              {" • "}
            </span>
          )}
          note last updated:{" "}
          <MutedSpan>
            {DateTime.fromMillis(rawNoteItem.updatedAt).toLocaleString(
              DateTime.DATETIME_HUGE_WITH_SECONDS
            )}
          </MutedSpan>
          <br />
          <code>
            ENC PROTO VER: {protocolVersion} {" • "}
            <ThemedAnchor onClick={downloadRaw(rawNoteItem, "ENC")}>
              DL ENC_RAW
            </ThemedAnchor>
            {processedNoteItem &&
              processedNoteItem.processedContent && (
                <span>
                  {" • "}
                  <HiddenPointerAnchor
                    onClick={downloadRaw(
                      processedNoteItem.processedContent,
                      "DEC"
                    )}
                  >
                    DL DEC_RAW
                  </HiddenPointerAnchor>
                </span>
              )}
          </code>
        </div>
      ) : null}
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
          isEditing && (
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

export default NoteItemEditorView;
