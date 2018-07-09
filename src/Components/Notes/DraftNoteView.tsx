import React, { ChangeEventHandler, Fragment, MouseEventHandler } from "react";
import ReactMarkdown from "react-markdown";
import { IDraftNote } from "../../Modules/Reducers/Notes/Reducer";
import styled from "../AppStyles";
import { Button } from "../Auth/SignViewShared";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";

const NoteViewContainer = styled.div`
  display: grid;
  margin: 1em;
  max-width: 100%;
  height: 100%;
  grid-template-areas: "note-draft-view";
`;

const NoteViewContent = styled.div`
  grid-area: note-draft-view;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-flow-auto: row;
  margin: 1em;
  max-width: 100%;
  @media only screen and (max-width: ${({ theme: { lgScrnBrkPx } }) =>
      lgScrnBrkPx - 1}px) {
    grid-template-areas:
      "state-holder"
      "note-title"
      "note-content";
  }
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    grid-template-areas:
      "state-holder state-holder"
      "note-editor-title note-preview-title"
      "note-editor-content note-preview-content";
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
  }
`;

const NoteStateHolder = styled.div`
  grid-area: state-holder;
  display: grid;
  grid-template-areas:
    "note-actions"
    "toggle-note-type"
    "note-response";
`;

const NoteStateActions = styled.div`
  display: grid;
  grid-area: note-actions;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

const ToggleNoteTypeContainer = styled.div`
  grid-area: toggle-note-type;
  display: grid;
  grid-auto-flow: column;
`;

const ToggleNoteTypeLabel = styled.label`
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
`;

const NoteStateResponse = styled.div`
  display: grid;
  grid-area: note-response;
  grid-auto-flow: row;
  grid-auto-rows: auto;
`;

const EditNoteTitle = styled.textarea.attrs<{ preview?: boolean }>({})`
  @media only screen and (max-width: ${props =>
      props.theme.lgScrnBrkPx - 1}px) {
    grid-area: note-title;
    ${({ preview }) => preview && "display: none;"};
  }
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    grid-area: note-editor-title;
  }
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  font-family: monospace;
  padding: 0 0 0.5em 0;
  font-size: 2em;
  max-height: 100%;
  width: 100%;
`;

const ViewNoteTitle = styled.h1.attrs<{ preview?: boolean }>({})`
  ${({ preview, theme: { lgScrnBrkPx } }) =>
    preview !== undefined
      ? `@media only screen and (max-width: ${lgScrnBrkPx - 1}px) {
        display: ${preview ? "inline-block" : "none"};
      }`
      : ""} padding: 0;
  margin: 0.2em 0;
`;

const DraftNoteContent = styled.textarea.attrs<{ preview?: boolean }>({})`
  @media only screen and (max-width: ${({ theme: { lgScrnBrkPx } }) =>
      lgScrnBrkPx - 1}px) {
    ${({ preview }) => preview && "display: none;"};
    grid-area: note-content;
  }
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    grid-area: note-editor-content;
  }
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  padding: 0;
  width: 100%;
`;

const HideOnLargeScreenButton = Button.extend`
  @media only screen and (max-width: ${({ theme: { lgScrnBrkPx } }) =>
      lgScrnBrkPx - 1}px) {
    display: inline-block;
  }
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    display: none;
  }
`;

const ShowOnLargeScreenButton = Button.extend`
  @media only screen and (max-width: ${({ theme: { lgScrnBrkPx } }) =>
      lgScrnBrkPx - 1}px) {
    display: none;
  }
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    display: inline-block;
  }
`;

const NoteMarkdownContent = styled(ReactMarkdown).attrs<{ preview?: boolean }>(
  {}
)`
  @media only screen and (max-width: ${props =>
      props.theme.lgScrnBrkPx - 1}px) {
    ${({ preview }) => !preview && "display: none;"};
  }
`;

const NoteTextContent = styled.div.attrs<{ preview?: boolean }>({})`
  @media only screen and (max-width: ${props =>
    props.theme.lgScrnBrkPx - 1}px) {
    ${({ preview }) => !preview && "display: none;"};
  }
  white-space pre-line;
`;

const NoValue = styled.span`
  font-style: italic;
  color: ${props => props.theme.inputErrorColor};
`;

const HorizontalLine = styled.hr`
  width: 100%;
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  preview: boolean;
  draftNote: IDraftNote;
  handleDiscardDraftNote: MouseEventHandler<HTMLButtonElement>;
  handleTogglePreview: MouseEventHandler<HTMLButtonElement>;
  handleToggleNoteType: ChangeEventHandler<HTMLInputElement>;
  handleChangeNoteTitle: ChangeEventHandler<HTMLTextAreaElement>;
  handleChangeNoteContent: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
}

const DraftNoteView = ({
  loading,
  loadingText,
  errors,
  preview,
  draftNote,
  handleDiscardDraftNote,
  handleTogglePreview,
  handleToggleNoteType,
  handleChangeNoteTitle,
  handleChangeNoteContent,
  handleSubmit
}: IProps) => {
  return (
    <NoteViewContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="note-draft-view"
        loading={loading}
        loadingText={loadingText}
      />
      <NoteViewContent>
        <NoteStateHolder>
          <NoteStateActions>
            <ViewNoteTitle>
              {preview ? "View Note" : "Draft Note"}
            </ViewNoteTitle>
            {!preview && (
              <Fragment>
                {(draftNote.content || draftNote.title) && (
                  <HideOnLargeScreenButton onClick={handleDiscardDraftNote}>
                    Discard Note
                  </HideOnLargeScreenButton>
                )}
                <HideOnLargeScreenButton onClick={handleTogglePreview}>
                  Preview
                </HideOnLargeScreenButton>
              </Fragment>
            )}
            {preview && (
              <Fragment>
                <HideOnLargeScreenButton onClick={handleTogglePreview}>
                  Edit
                </HideOnLargeScreenButton>
                <HideOnLargeScreenButton onClick={handleSubmit}>
                  Submit
                </HideOnLargeScreenButton>
              </Fragment>
            )}
            {(draftNote.content || draftNote.title) && (
              <ShowOnLargeScreenButton onClick={handleDiscardDraftNote}>
                Discard Note
              </ShowOnLargeScreenButton>
            )}
            <ShowOnLargeScreenButton onClick={handleSubmit}>
              Submit
            </ShowOnLargeScreenButton>
          </NoteStateActions>
          <ToggleNoteTypeContainer>
            <ToggleNoteTypeLabel>
              <input
                type="radio"
                name="noteType"
                value="text"
                checked={draftNote.noteType === "text"}
                onChange={handleToggleNoteType}
              />
              Text
            </ToggleNoteTypeLabel>
            <ToggleNoteTypeLabel>
              <input
                type="radio"
                name="noteType"
                value="markdown"
                checked={draftNote.noteType === "markdown"}
                onChange={handleToggleNoteType}
              />
              Markdown
            </ToggleNoteTypeLabel>
          </ToggleNoteTypeContainer>
          <NoteStateResponse>
            <FormFieldErrors errors={errors} />
          </NoteStateResponse>
          <HorizontalLine />
        </NoteStateHolder>
        <EditNoteTitle
          preview={preview}
          placeholder="Note Title"
          onChange={handleChangeNoteTitle}
          value={draftNote.title}
        />
        <ViewNoteTitle preview={preview}>
          {draftNote.title || (
            <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
          )}
        </ViewNoteTitle>

        {draftNote.content ? (
          draftNote.noteType === "markdown" ? (
            <NoteMarkdownContent source={draftNote.content} />
          ) : (
            <NoteTextContent preview={preview}>
              {draftNote.content}
            </NoteTextContent>
          )
        ) : (
          <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
        )}
        <DraftNoteContent
          preview={preview}
          placeholder="Note Content"
          onChange={handleChangeNoteContent}
          value={draftNote.content}
        />
      </NoteViewContent>
    </NoteViewContainer>
  );
};

export default DraftNoteView;
