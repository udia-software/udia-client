import { DateTime } from "luxon";
import React, { ChangeEventHandler, Component, MouseEventHandler } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import styled from "../AppStyles";
import { FormInput } from "../Auth/SignViewShared";
import { Button } from "../Helpers/Button";
import FieldErrors from "../Helpers/FieldErrors";
import SimpleLoader from "../Helpers/SimpleLoader";
import DisplayNoteView from "./DisplayNoteView";
import { MutedSpan } from "./NotesShared";

const SearchFormInput = styled(FormInput)`
  align-self: center;
  width: 95%;
`;

const DraftNoteLink = styled(Link)`
  align-self: center;
  width: 97%;
`;

const DraftNoteButton = styled(Button)`
  @media only screen and (max-width: ${({ theme }) =>
      theme.smScrnBrkPx - 1}px) {
    overflow: visible;
    display: inline-block;
  }
  @media only screen and (min-width: ${({ theme }) => theme.smScrnBrkPx}px) {
    display: none;
  }
`;

const ListNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ListNotesContentContainer = styled.div`
  width: 97%;
  display: flex;
  align-items: stretch;
  align-content: stretch;
  height: 100%;
`;

const ListNoteUnorderedList = styled.ul`
  flex: 1 1 auto;
  list-style-type: none;
  margin: 0;
  padding: 1em;
`;

const ListNoteItem = styled.li.attrs<{ selected?: boolean }>({})`
  cursor: pointer;
  color: ${props => props.theme.intermediateColor};
  border: 1px solid ${props => props.theme.intermediateColor};
  border-radius: 3px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  padding: 0.5em 0 0.5em 0.5em;
  margin-right: 0.5em;
  width: 100%;
  &:hover {
    color: ${props => props.theme.primaryColor};
    border-left-color: ${props => props.theme.purple};
    border-right-color: ${props => props.theme.primaryColor};
    border-top-color: ${props => props.theme.primaryColor};
    border-bottom-color: ${props => props.theme.primaryColor};
  }
  ${props => props.selected && `border-left-color: ${props.theme.purple}`};
`;

const ListActionsItem = styled.li`
  width: 100%;
`;

const ListActionButton = styled(Button)`
  width: auto;
  padding: 0.4em;
`;

const ListNoteTitle = styled.span`
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
  ${ListNoteItem}: hover & {
    text-decoration: underline;
  }
`;

const ListNoteUntitled = styled.span`
  font-style: italic;
`;

const ListPreviewContentContainer = styled.div`
  margin-left: 0.5em;
`;

const LargeScreenContentContatiner = styled.div`
  width: 100%;
  flex: 3 1 100%;
  margin-left: 1em;
`;

interface IProps {
  isLargeScreen: boolean;
  loading: boolean;
  draftingNote: boolean;
  displayNotes: string[];
  rawNotes: { [index: string]: Item };
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number;
      decryptedNote: DecryptedNote | null;
      errors?: string[] | undefined;
    };
  };
  bypassedCacheDateMS?: number;
  searchString: string;
  clickedNoteId?: string;
  deleteNoteId?: string;
  deleteNoteConfirmation?: number;
  errors: string[];
  handleChangeSearchString: ChangeEventHandler<HTMLInputElement>;
  handleListNoteItemClicked: (uuid: string) => MouseEventHandler<HTMLElement>;
  handleReloadNotesBypassCache: MouseEventHandler<HTMLButtonElement>;
  handleClickDeleteNote: (uuid: string) => MouseEventHandler<HTMLButtonElement>;
}

const PREVIEW_CHAR_LEN = 120;

class ListNotesView extends Component<IProps> {
  public render() {
    const {
      isLargeScreen,
      loading,
      draftingNote,
      displayNotes,
      rawNotes,
      decryptedNotes,
      bypassedCacheDateMS,
      searchString,
      clickedNoteId,
      deleteNoteConfirmation,
      deleteNoteId,
      errors,
      handleChangeSearchString,
      handleListNoteItemClicked,
      handleReloadNotesBypassCache,
      handleClickDeleteNote
    } = this.props;

    const listErrors =
      errors.indexOf("Network error: Failed to fetch") > -1
        ? [
            "Are you offline? You may still browse cached notes and create drafts."
          ]
        : errors;

    return (
      <ListNotesContainer>
        <SearchFormInput
          placeholder="Search..."
          onChange={handleChangeSearchString}
          value={searchString}
        />
        <DraftNoteLink to="/note/draft">
          <DraftNoteButton disabled={loading}>
            {draftingNote ? "Continue Drafting Note" : "Draft New Note"}
          </DraftNoteButton>
        </DraftNoteLink>
        <ListNotesContentContainer>
          <ListNoteUnorderedList>
            <li>
              <FieldErrors errors={listErrors} />
              <SimpleLoader loading={loading} /> {loading && " Syncing..."}
            </li>
            {displayNotes.map(uuid => {
              const { decryptedNote, errors: noteErrors = [] } = decryptedNotes[
                uuid
              ] || { decryptedNote: undefined, errors: [] };
              return (
                <ListNoteItem
                  key={uuid}
                  onClick={handleListNoteItemClicked(uuid)}
                  selected={uuid === clickedNoteId}
                >
                  <FieldErrors errors={noteErrors} />
                  {decryptedNote &&
                    (decryptedNote.title ? (
                      <ListNoteTitle>{decryptedNote.title}</ListNoteTitle>
                    ) : (
                      <ListNoteUntitled>Untitled</ListNoteUntitled>
                    ))}
                  {!isLargeScreen ? (
                    <ListPreviewContentContainer>
                      {decryptedNote &&
                      searchString &&
                      decryptedNote.content.indexOf(searchString) > 0
                        ? "\u2026"
                        : ""}
                      <code>
                        {decryptedNote &&
                          decryptedNote.content.substring(
                            searchString &&
                            decryptedNote.content
                              .toLowerCase()
                              .indexOf(searchString.toLowerCase()) > -1
                              ? decryptedNote.content
                                  .toLowerCase()
                                  .indexOf(searchString.toLowerCase())
                              : 0,
                            PREVIEW_CHAR_LEN
                          )}
                      </code>
                      {decryptedNote &&
                      decryptedNote.content.length > PREVIEW_CHAR_LEN
                        ? "\u2026"
                        : ""}
                    </ListPreviewContentContainer>
                  ) : (
                    <br />
                  )}
                  <span>
                    Created:{" "}
                    {DateTime.fromMillis(
                      rawNotes[uuid].createdAt
                    ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                  </span>
                </ListNoteItem>
              );
            })}
            {displayNotes.length === 0 && <li>No Items</li>}
            <ListActionsItem>
              <ListActionButton
                disabled={loading}
                onClick={handleReloadNotesBypassCache}
              >
                Clear Cache &amp; Reload Notes
              </ListActionButton>
              {bypassedCacheDateMS && (
                <MutedSpan>
                  <br />
                  Reloaded{" "}
                  {DateTime.fromMillis(bypassedCacheDateMS).toLocaleString(
                    DateTime.DATETIME_MED_WITH_SECONDS
                  )}
                </MutedSpan>
              )}
            </ListActionsItem>
          </ListNoteUnorderedList>
          {clickedNoteId &&
            (isLargeScreen ? (
              <LargeScreenContentContatiner>
                <DisplayNoteView
                  loading={
                    !(
                      (decryptedNotes[clickedNoteId] &&
                        decryptedNotes[clickedNoteId].decryptedNote) ||
                      (decryptedNotes[clickedNoteId] &&
                        decryptedNotes[clickedNoteId].errors) ||
                      (rawNotes[clickedNoteId] &&
                        rawNotes[clickedNoteId].deleted)
                    )
                  }
                  errors={
                    (decryptedNotes[clickedNoteId] &&
                      decryptedNotes[clickedNoteId].errors) ||
                    []
                  }
                  decryptedNotePayload={decryptedNotes[clickedNoteId]}
                  rawNote={rawNotes[clickedNoteId]}
                  deleteNoteConfirmation={
                    deleteNoteId === clickedNoteId
                      ? deleteNoteConfirmation
                      : undefined
                  }
                  handleClickDeleteNote={handleClickDeleteNote(clickedNoteId)}
                />
              </LargeScreenContentContatiner>
            ) : (
              <Redirect to={`/note/view/${clickedNoteId}`} push={true} />
            ))}
        </ListNotesContentContainer>
      </ListNotesContainer>
    );
  }
}
export default ListNotesView;
