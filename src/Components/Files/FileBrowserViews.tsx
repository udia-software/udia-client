import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEventHandler } from "react";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import SimpleLoader from "../Helpers/SimpleLoader";
import NoteFileEditorController from "../Notes/NoteFileEditorController";
import { MutedSpan } from "../Notes/NotesShared";
import RawItemEditorController from "./RawItemEditorController";

const FilesList = styled.ul`
  list-style-type: none;
  padding-left: 1em;
  margin: 0;
`;

const FilesItem = styled.li`
  margin: 0.3em 0 0.3em 0;
`;

const ItemName = styled.span.attrs<{ itemClicked?: boolean }>({})`
  display: flex;
  align-items: stretch;
  align-content: stretch;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    border-bottom: 2px solid ${props => props.theme.purple};
  }
  border-bottom: 2px dotted
    ${props =>
      props.itemClicked
        ? props.theme.purple
        : props.theme.panelBackgroundColor};
  width: 100%;
`;

const ItemNameText = styled.span`
  width: 100%;
  word-wrap: break-word;
`;

const IconHolder = styled(FontAwesomeIcon)`
  margin: 0 0.4em 0 0;
  ${ItemName}:hover & {
    color: ${props => props.theme.purple};
  }
`;

const AddDirectoryIcon = () => (
  <span className="fa-layers fa-fw">
    <FontAwesomeIcon icon="folder" />
    <FontAwesomeIcon
      icon="plus"
      transform="shrink-8 down-2 right-4"
      color="green"
    />
  </span>
);

const AddNoteIcon = () => (
  <span className="fa-layers fa-fw">
    <FontAwesomeIcon icon="file" />
    <FontAwesomeIcon
      icon="plus"
      transform="shrink-8 down-4 right-2"
      color="green"
    />
  </span>
);

const FileAddButton = styled(Button)`
  align-self: flex-end;
  width: auto;
  padding: 0.1em;
  margin: 0 0 0 auto;
`;

/**
 * Helper function to generate a unique tile for each note (appends number for duplicate title)
 */
function genDupTitleCountMap(
  fileStructure: { [uuid: string]: string[] },
  dirName: string,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState
) {
  const dupeTitleCounter: {
    [title: string]: number;
  } = {};
  const idToCountMap: {
    [uuid: string]: number;
  } = {};
  [...fileStructure[dirName]].reverse().forEach(id => {
    if (processedItems[id]) {
      const pip = processedItems[id];
      switch (pip.contentType) {
        case "note":
          if (pip.processedContent) {
            const { title } = pip.processedContent;
            const count = dupeTitleCounter[title] || 0;
            idToCountMap[id] = count;
            dupeTitleCounter[title] = count + 1;
          }
      }
    } else if (draftItems[id]) {
      const dip = draftItems[id];
      switch (dip.contentType) {
        case "note":
          let { title } = dip.draftContent;
          let count = dupeTitleCounter[title] || 0;
          if (dip.uuid) {
            // editing existing item
            const ogItem = processedItems[dip.uuid];
            if (ogItem && ogItem.contentType === "note") {
              const { title: ogTitle } = ogItem.processedContent;
              title = ogTitle;
              count = dupeTitleCounter[title] - 1 || 0;
            }
          } else {
            // new item
            dupeTitleCounter[title] = count + 1;
          }
          idToCountMap[id] = count;
      }
    }
  });
  return idToCountMap;
}

interface INoteItemViewProps {
  itemClicked: boolean;
  title: string;
  count: number;
  type: string;
  isDraft?: boolean;
  isRaw?: boolean;
  handleClickItemEvent: MouseEventHandler<HTMLElement>;
}

const renderFileTypeExtension = (noteType: string) => {
  switch (noteType) {
    case "markdown":
      return ".md";
    case "text":
      return ".txt";
    case "note":
      return ".note";
    default:
      return noteType;
  }
};

const NoteItemView = ({
  itemClicked,
  title,
  count,
  type,
  isDraft,
  isRaw,
  handleClickItemEvent
}: INoteItemViewProps) => (
  <FilesItem>
    <ItemName itemClicked={itemClicked} onClick={handleClickItemEvent}>
      <IconHolder icon="file-alt" />
      <ItemNameText>
        {title ? (
          isRaw ? (
            <MutedSpan>{title}</MutedSpan>
          ) : (
            title
          )
        ) : (
          <MutedSpan>Untitled</MutedSpan>
        )}
        <MutedSpan>
          {count > 0 && `-${count}`}
          {renderFileTypeExtension(type)}
          {isRaw && ".raw"}
          {isDraft && "~"}
        </MutedSpan>
      </ItemNameText>
    </ItemName>
  </FilesItem>
);

interface IDirectoryViewProps {
  dirName: string;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  rawItems: IRawItemsState;
  fileStructure: { [uuid: string]: string[] };
  clickedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote: (id: string) => MouseEventHandler<HTMLElement>;
  open: boolean;
}

/**
 * Folder view. Show the directory name, then the nested items/directories
 */
export const DirectoryView = ({
  dirName,
  processedItems,
  draftItems,
  rawItems,
  fileStructure,
  clickedItemId,
  handleClickItemEvent,
  handleClickNewNote,
  open = false
}: IDirectoryViewProps) => {
  const idToCountMap: {
    [uuid: string]: number;
  } = genDupTitleCountMap(fileStructure, dirName, processedItems, draftItems);
  return (
    <FilesList>
      <FilesItem>
        <ItemName>
          {open ? (
            <IconHolder icon="folder-open" />
          ) : (
            <IconHolder icon="folder" />
          )}
          {dirName}
          {null && (
            <FileAddButton>
              <AddDirectoryIcon />
              New Folder
            </FileAddButton>
          )}
          <FileAddButton onClick={handleClickNewNote(dirName)}>
            <AddNoteIcon />
            New Note
          </FileAddButton>
        </ItemName>
        {open && (
          <FilesList>
            {fileStructure[dirName].map(id => {
              if (processedItems[id]) {
                const pip = processedItems[id];
                switch (pip.contentType) {
                  case "note": {
                    if (pip.processedContent) {
                      const { title, noteType } = pip.processedContent;
                      const count = idToCountMap[id];
                      // check if selected draft for item
                      const itemClicked =
                        clickedItemId === id ||
                        !!(
                          clickedItemId &&
                          draftItems[clickedItemId] &&
                          draftItems[clickedItemId].uuid &&
                          draftItems[clickedItemId].uuid === id
                        );
                      return (
                        <NoteItemView
                          key={id}
                          itemClicked={itemClicked}
                          title={title}
                          count={count}
                          type={noteType}
                          handleClickItemEvent={handleClickItemEvent(id)}
                        />
                      );
                    }
                  }
                }
              }
              if (draftItems[id]) {
                const dip = draftItems[id];
                switch (dip.contentType) {
                  case "note": {
                    let { title, noteType } = dip.draftContent;
                    const count = idToCountMap[id];
                    if (dip.uuid) {
                      // if editing, inherit values from the parent
                      const ogItem = processedItems[dip.uuid];
                      if (ogItem && ogItem.contentType === "note") {
                        const {
                          title: ogTitle,
                          noteType: ogNoteType
                        } = ogItem.processedContent;
                        title = ogTitle;
                        noteType = ogNoteType;
                      }
                    }
                    const itemClicked =
                      clickedItemId === id || clickedItemId === dip.uuid;
                    return (
                      <NoteItemView
                        key={id}
                        itemClicked={itemClicked}
                        title={title}
                        count={count}
                        type={noteType}
                        isDraft={true}
                        handleClickItemEvent={handleClickItemEvent(id)}
                      />
                    );
                  }
                }
              }
              if (rawItems[id]) {
                const ri = rawItems[id];
                return (
                  <NoteItemView
                    key={id}
                    itemClicked={clickedItemId === id}
                    title={ri.uuid}
                    count={0}
                    type={ri.contentType || "deleted"}
                    isRaw={true}
                    handleClickItemEvent={handleClickItemEvent(id)}
                  />
                );
              }
              // catch all error state
              return <SimpleLoader key={id} loading={true} />;
            })}
          </FilesList>
        )}
      </FilesItem>
    </FilesList>
  );
};

const determineContentViewer = (
  id: string | undefined,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState,
  rawItems: IRawItemsState
) => {
  if (id) {
    if (id in processedItems) {
      const pip = processedItems[id];
      switch (pip.contentType) {
        case "note":
          return <NoteFileEditorController editItemId={id} />;
        case "directory":
          return <span>TODO: DIR</span>;
        case null:
          return <RawItemEditorController itemId={id} />;
      }
    }
    if (id in draftItems) {
      const dip = draftItems[id];
      switch (dip.contentType) {
        case "note":
          return <NoteFileEditorController editItemId={id} />;
        case "directory":
          return <span>TODO: DIR</span>;
      }
    }
    if (id in rawItems) {
      return <RawItemEditorController itemId={id} />;
    }
  }
  return <NoteFileEditorController />;
};

// File Browser View

const FileBrowserContainer = styled.div`
  width: 99%;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 18em 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "file-list file-content";
  grid-column-gap: 1em;
`;

const FileListContainer = styled.div`
  grid-area: file-list;
`;
const FileContentContainer = styled.div`
  grid-area: file-content;
`;

interface IFileBrowserViewProps {
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  fileStructure: IStructureState;
  selectedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote: (id: string) => MouseEventHandler<HTMLElement>;
}

export const FileBrowserView = ({
  processedItems,
  draftItems,
  rawItems,
  fileStructure,
  selectedItemId,
  handleClickItemEvent,
  handleClickNewNote
}: IFileBrowserViewProps) => (
  <FileBrowserContainer>
    <FileListContainer>
      {Object.keys(fileStructure).map(root => {
        return (
          <DirectoryView
            key={root}
            dirName={root}
            processedItems={processedItems}
            draftItems={draftItems}
            rawItems={rawItems}
            fileStructure={fileStructure}
            clickedItemId={selectedItemId}
            handleClickItemEvent={handleClickItemEvent}
            handleClickNewNote={handleClickNewNote}
            open={true}
          />
        );
      })}
    </FileListContainer>
    <FileContentContainer>
      {determineContentViewer(
        selectedItemId,
        processedItems,
        draftItems,
        rawItems
      )}
    </FileContentContainer>
  </FileBrowserContainer>
);
