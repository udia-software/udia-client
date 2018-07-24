import { DateTime } from "luxon";
import React, { Fragment, MouseEventHandler } from "react";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import FieldErrors from "../Helpers/FieldErrors";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import { ThemedAnchor, ThemedLink } from "../Helpers/ThemedLinkAnchor";
import {
  MutedSpan,
  NoteMarkdownContent,
  NoteTextContent,
  ViewNoteLinkTitle,
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
  deleteNoteConfirmation?: number;
  handleClickDeleteNote: MouseEventHandler<HTMLButtonElement>;
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
  decryptedNotePayload: payload,
  deleteNoteConfirmation,
  handleClickDeleteNote
}: IProps) => {
  const decryptedNote = payload && payload.decryptedNote;
  const protocolVersion =
    rawNote &&
    (rawNote.deleted
      ? "DELETED"
      : rawNote.content
        ? rawNote.content.split(":")[0] || "ERR"
        : "ERR");
  let decryptProccessString = "";
  let noteProccessTime = "";
  if (payload) {
    noteProccessTime = DateTime.fromMillis(payload.decryptedAt).toLocaleString(
      DateTime.DATETIME_MED_WITH_SECONDS
    );
    const noteProccessType = payload.decryptedNote ? "processed" : "failed";
    decryptProccessString = `client ${noteProccessType} on: `;
  }

  return (
    <DisplayNoteContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="note-display-view"
        loading={loading}
        loadingText={loadingText}
      />
      <DisplayNoteContent>
        <FieldErrors errors={payload && payload.errors || errors} />
        {decryptedNote && (
          <Fragment>
            <ViewNoteLinkTitle
              to={rawNote ? `/note/view/${rawNote.uuid}` : `/note/list`}
            >
              <ViewNoteTitle>
                {decryptedNote.title ? (
                  <span>{decryptedNote.title}</span>
                ) : (
                  <MutedSpan>Untitled</MutedSpan>
                )}
              </ViewNoteTitle>
            </ViewNoteLinkTitle>
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
              <ViewActionButton
                disabled={rawNote.deleted || (deleteNoteConfirmation || -1) > 0}
                onClick={handleClickDeleteNote}
              >
                {rawNote.deleted
                  ? "DELETED"
                  : deleteNoteConfirmation === undefined
                    ? "Delete Note"
                    : deleteNoteConfirmation > 0
                      ? `CONFIRM? (WAIT ${deleteNoteConfirmation}s)`
                      : "CONFIRM DELETE"}
              </ViewActionButton>{" "}
              {!rawNote.deleted &&
                (decryptedNote ? (
                  <ThemedLink to={`/note/draft/${rawNote.uuid}`}>
                    <ViewActionButton>Edit Note</ViewActionButton>
                  </ThemedLink>
                ) : (
                  <ViewActionButton disabled={true}>ENCRYPTED</ViewActionButton>
                ))}
            </NoteViewActions>
            <hr />
            {decryptProccessString && (
              <span>
                {decryptProccessString}{" "}
                <MutedSpan>{noteProccessTime}</MutedSpan>
                {" • "}
              </span>
            )}
            note last updated:{" "}
            <MutedSpan>
              {DateTime.fromMillis(rawNote.updatedAt).toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )}
            </MutedSpan>
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
