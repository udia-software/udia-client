import React, { Fragment } from "react";
import styled from "../AppStyles";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  NoteMarkdownContent,
  NoteTextContent,
  ViewNoteTitle
} from "./NoteViewShared";

interface IProps {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  rawNote?: Item;
  decryptedNotePayload?: {
    decryptedAt: number;
    decryptedNote: DecryptedNote | null;
    errors?: string[];
  };
}

const DisplayNoteContainer = styled.div`
  display: grid;
  max-width: 100%;
  height: 100%;
  grid-template-areas: "note-display-view";
`;

const DisplayNoteContent = styled.div`
  grid-area: note-display-view;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0.3em;
  height: 100%;
  max-width: 100%;
`;

const NoteViewActions = styled.div`
  flex: 0 1 auto;
  margin-top: auto;
  margin-bottom: 0.5em;
  align-self: flex-end;
`;

const DisplayNoteView = ({
  loading,
  loadingText,
  errors,
  rawNote,
  decryptedNotePayload
}: IProps) => {
  const decryptedNote =
    decryptedNotePayload && decryptedNotePayload.decryptedNote;
  const noteErrors =
    (decryptedNotePayload && decryptedNotePayload.errors) || [];
  return (
    <DisplayNoteContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="note-display-view"
        loading={loading}
        loadingText={loadingText}
      />
      <DisplayNoteContent>
        <FieldErrors errors={[...errors, ...noteErrors]} />
        {decryptedNote && (
          <Fragment>
            <ViewNoteTitle>{decryptedNote.title}</ViewNoteTitle>
            {decryptedNote.noteType === "markdown" ? (
              <NoteMarkdownContent source={decryptedNote.content} />
            ) : (
              <NoteTextContent>{decryptedNote.content}</NoteTextContent>
            )}
          </Fragment>
        )}
        {rawNote && (
          <NoteViewActions>
            <hr/>
            <span>Your secrets are always encrypted.</span><br/>
            <code>{rawNote.content}</code>
          </NoteViewActions>
        )}
      </DisplayNoteContent>
    </DisplayNoteContainer>
  );
};

export default DisplayNoteView;
