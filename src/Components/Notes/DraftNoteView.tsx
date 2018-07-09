import React, { ChangeEventHandler, MouseEventHandler } from "react";
import ReactMarkdown from "react-markdown";
import { IDraftNote } from "../../Modules/Reducers/Notes/Reducer";
import styled from "../AppStyles";
import { Button } from "../Auth/SignViewShared";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";

const NoteViewContainer = styled.div`
  display: grid;
  grid-template-areas: "note-draft-view";
  margin: 1em;
  max-width: 100%;
  height: 100%;
`;

const NoteViewContent = styled.div`
  grid-area: note-draft-view;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    "state-holder"
    "note-title"
    "note-content";
  margin: 1em;
  max-width: 100%;
`;

const StaticNoteTitle = styled.h1`
  padding: 0;
  margin: 0.2em 0;
`;

const NoteStateHolder = styled.div`
  grid-area: state-holder;
  display: grid;
  grid-template-areas:
    "note-actions"
    "note-response";
`;

const NoteStateActions = styled.div`
  display: grid;
  grid-area: note-actions;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

const NoteStateResponse = styled.div`
  display: grid;
  grid-area: note-response;
  grid-auto-flow: row;
  grid-auto-rows: auto;
`;

const DraftNoteTitle = styled.input`
  grid-area: note-title;
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  font-family: monospace;
  padding: 0 0 0.5em 0;
  font-size: 2em;
  max-height: 100%;
  width: 100%;
`;

const DraftNoteContent = styled.textarea`
  grid-area: note-content;
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  padding: 0;
  width: 100%;
`;

const NoValue = styled.span`
  font-style: italic;
  color: ${props => props.theme.inputErrorColor};
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  preview: boolean;
  draftNote: IDraftNote;
  handleDiscardDraftNote: MouseEventHandler<HTMLButtonElement>;
  handleTogglePreview: MouseEventHandler<HTMLButtonElement>;
  handleChangeNoteTitle: ChangeEventHandler<HTMLInputElement>;
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
          {preview ? (
            <NoteStateActions>
              <StaticNoteTitle>View Note</StaticNoteTitle>
              <Button onClick={handleTogglePreview}>Edit</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </NoteStateActions>
          ) : (
            <NoteStateActions>
              <StaticNoteTitle>Draft Note</StaticNoteTitle>
              {(draftNote.content || draftNote.title) && (
                <Button onClick={handleDiscardDraftNote}>Discard Note</Button>
              )}
              <Button onClick={handleTogglePreview}>Preview</Button>
            </NoteStateActions>
          )}
          <NoteStateResponse>
            <FormFieldErrors errors={errors} />
          </NoteStateResponse>
        </NoteStateHolder>
        {preview ? (
          <StaticNoteTitle>
            {draftNote.title || (
              <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
            )}
          </StaticNoteTitle>
        ) : (
          <DraftNoteTitle
            placeholder="Note Title"
            onChange={handleChangeNoteTitle}
            value={draftNote.title}
          />
        )}
        {preview ? (
          draftNote.content ? (
            <ReactMarkdown source={draftNote.content} />
          ) : (
            <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
          )
        ) : (
          <DraftNoteContent
            placeholder="Note Content"
            onChange={handleChangeNoteContent}
            value={draftNote.content}
          />
        )}
      </NoteViewContent>
    </NoteViewContainer>
  );
};

export default DraftNoteView;
