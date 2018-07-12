import { DateTime } from "luxon";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "../AppStyles";
import { PointerAnchor } from "../Auth/SignViewShared";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  NoteMarkdownContent,
  NoteTextContent,
  ViewNoteTitle
} from "./NotesShared";

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

const NoteViewMeta = styled.div`
  flex: 0 1 auto;
  margin-top: auto;
  margin-bottom: 0.5em;
  align-self: flex-end;
  width: 100%;
`;

const NoteViewActions = styled.div`
  width: 100%;
  text-align: right;
`;

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

const DisplayNoteView = ({
  loading,
  loadingText,
  errors,
  rawNote,
  decryptedNotePayload: payload
}: IProps) => {
  const decryptedNote = payload && payload.decryptedNote;
  const noteErrors = (payload && payload.errors) || [];
  const protocolVersion = (rawNote && rawNote.content.split(":")[0]) || "ERR";
  let decryptProccessString = "";
  if (payload) {
    const noteProccessTime = DateTime.fromMillis(
      payload.decryptedAt
    ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    const noteProccessType = payload.decryptedNote ? "decrypted" : "failed";
    decryptProccessString = ` • ${noteProccessType} on: ${noteProccessTime}`;
  }

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
          <NoteViewMeta>
            <NoteViewActions>
              <Link to={`/note/draft/${rawNote.uuid}`}>Edit Note</Link>
            </NoteViewActions>
            <hr />
            last updated:{" "}
            {DateTime.fromMillis(rawNote.updatedAt).toLocaleString(
              DateTime.DATETIME_MED_WITH_SECONDS
            )}
            {decryptProccessString}
            <br />
            <code>
              ENC PROTO VER: {protocolVersion} {" • "}
              <PointerAnchor onClick={downloadRaw(rawNote, "ENC")}>
                ENC_RAW
              </PointerAnchor>
              {decryptedNote && (
                <Fragment>
                  {" • "}
                  <PointerAnchor onClick={downloadRaw(decryptedNote, "DEC")}>
                    DEC_RAW
                  </PointerAnchor>
                </Fragment>
              )}
            </code>
          </NoteViewMeta>
        )}
      </DisplayNoteContent>
    </DisplayNoteContainer>
  );
};

export default DisplayNoteView;
