import React, { ChangeEventHandler, Fragment, MouseEventHandler } from "react";
import ReactMarkdown from "react-markdown";
import { IDraftNote } from "../../Modules/Reducers/Notes/Reducer";
import styled from "../AppStyles";
import { Button } from "../Auth/SignViewShared";

const NoteViewContainer = styled.div`
  display: grid;
  grid-template-rows: 3em auto 1fr;
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
  grid-auto-columns: 1fr 1fr;
  grid-auto-flow: column;
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
  color: ${props => props.theme.intermediateColor};
`;

interface IProps {
  preview: boolean;
  draftNote: IDraftNote;
  handleTogglePreview: MouseEventHandler<HTMLButtonElement>;
  handleChangeNoteTitle: ChangeEventHandler<HTMLInputElement>;
  handleChangeNoteContent: ChangeEventHandler<HTMLTextAreaElement>;
}

const DraftNoteView = ({
  preview,
  draftNote,
  handleTogglePreview,
  handleChangeNoteTitle,
  handleChangeNoteContent
}: IProps) => {
  return (
    <NoteViewContainer>
      <NoteStateHolder>
        {preview ? (
          <Fragment>
            <Button onClick={handleTogglePreview}>Edit</Button>
            <Button>Submit</Button>
          </Fragment>
        ) : (
          <Fragment>
            <StaticNoteTitle>Draft Note</StaticNoteTitle>
            <Button onClick={handleTogglePreview}>Preview</Button>
          </Fragment>
        )}
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
    </NoteViewContainer>
  );
};

export default DraftNoteView;
