import { DateTime } from "luxon";
import React, { ChangeEventHandler, MouseEventHandler } from "react";
import styled from "../AppStyles";
import { FormInput } from "../Auth/SignViewShared";
import FieldErrors from "../PureHelpers/FieldErrors";

const SearchFormInput = styled(FormInput)`
  align-self: center;
  width: 95%;
`;

const ListNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ListNoteUnorderedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 1em;
`;

const ListNoteItem = styled.li`
  cursor: pointer;
  color: ${props => props.theme.intermediateColor};
  border: 1px solid ${props => props.theme.intermediateColor};
  border-radius: 3px;
  padding: 0.5em;
  &:hover {
    color: ${props => props.theme.primaryColor};
    border-left-color: ${props => props.theme.purple};
    border-right-color: ${props => props.theme.primaryColor};
    border-top-color: ${props => props.theme.primaryColor};
    border-bottom-color: ${props => props.theme.primaryColor};
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

const ListNoteTitle = styled.span`
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
  ${ListNoteItem}:hover & {
    text-decoration: underline;
  }
`;

const ListNoteUntitled = styled.span`
  font-style: italic;
`;

interface IProps {
  displayNotes: string[];
  rawNotes: { [index: string]: Item };
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number;
      decryptedNote: DecryptedNote | null;
      errors?: string[] | undefined;
    };
  };
  searchString: string;
  errors: string[];
  handleChangeSearchString: ChangeEventHandler<HTMLInputElement>;
  handleListNoteItemClicked: (uuid: string) => MouseEventHandler<HTMLElement>;
}

const ListNotesView = ({
  displayNotes,
  rawNotes,
  decryptedNotes,
  searchString,
  errors,
  handleChangeSearchString,
  handleListNoteItemClicked
}: IProps) => (
  <ListNotesContainer>
    <FieldErrors errors={errors} />
    <SearchFormInput
      placeholder="Search..."
      onChange={handleChangeSearchString}
      value={searchString}
    />
    <ListNoteUnorderedList>
      {displayNotes.map(uuid => {
        const { decryptedNote, errors: noteErrors = [] } = decryptedNotes[
          uuid
        ] || { decryptedNote: undefined, errors: [] };
        return (
          <ListNoteItem key={uuid} onClick={handleListNoteItemClicked(uuid)}>
            <FieldErrors errors={noteErrors} />
            {decryptedNote && decryptedNote.title ? (
              <ListNoteTitle>{decryptedNote.title}</ListNoteTitle>
            ) : (
              <ListNoteUntitled>Untitled</ListNoteUntitled>
            )}
            <br />
            <span>
              Created:{" "}
              {DateTime.fromMillis(rawNotes[uuid].createdAt).toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )}
            </span>
          </ListNoteItem>
        );
      })}
      {displayNotes.length === 0 && <li>No Items</li>}
    </ListNoteUnorderedList>
  </ListNotesContainer>
);

export default ListNotesView;
