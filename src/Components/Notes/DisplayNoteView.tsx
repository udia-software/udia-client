import { DateTime } from "luxon";
import React, { Fragment } from "react";
import styled from "../AppStyles";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import { ThemedAnchor, ThemedLink } from "../PureHelpers/ThemedLinkAnchor";
import {
  NoteMarkdownContent,
  NoteTextContent,
  NoValue,
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

const ViewActionButton = styled(Button)`
  width: auto;
  font-size: 1em;
  padding: 0.3em;
`;

const HiddenPointerAnchor = styled(ThemedAnchor)`
  color: ${props => props.theme.backgroundColor};
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
    const noteProccessType = payload.decryptedNote ? "processed" : "failed";
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
            {decryptedNote.title ? (
              <ViewNoteTitle>{decryptedNote.title}</ViewNoteTitle>
            ) : (
              <NoValue>Untitled</NoValue>
            )}
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
              {decryptedNote ? (
                <ThemedLink to={`/note/draft/${rawNote.uuid}`}>
                  <ViewActionButton>Edit Note</ViewActionButton>
                </ThemedLink>
              ) : (
                <ViewActionButton disabled={true}>ENCRYPTED</ViewActionButton>
              )}
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
              <ThemedAnchor onClick={downloadRaw(rawNote, "ENC")}>
                DL ENC_RAW
              </ThemedAnchor>
              {decryptedNote && (
                <Fragment>
                  {" • "}
                  <HiddenPointerAnchor
                    onClick={downloadRaw(decryptedNote, "DEC")}
                  >
                    DL DEC_RAW
                  </HiddenPointerAnchor>
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
