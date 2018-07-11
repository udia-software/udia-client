import React, { Fragment } from "react";
import styled from "../AppStyles";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
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
  return (
    <DisplayNoteContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="note-display-view"
        loading={loading}
        loadingText={loadingText}
      />
      <DisplayNoteContent>
        <FormFieldErrors errors={errors} />
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
        {rawNote && <code>{rawNote.content}</code>}
      </DisplayNoteContent>
    </DisplayNoteContainer>
  );
};

export default DisplayNoteView;
