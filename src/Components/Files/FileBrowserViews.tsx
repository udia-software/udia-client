import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import MutedSpan from "../Helpers/MutedSpan";
import SimpleLoader from "../Helpers/SimpleLoader";
import { determineContentViewer } from "./ItemFileShared";

const FilesList = styled.ul`
  list-style-type: none;
  padding-left: 0.3em;
  margin: 0;
`;

const FilesItem = styled.li`
  margin-top: 0.2em;
  padding-left: 0.2em;
  border-left: 1px solid ${props => props.theme.backgroundColor};
  &:hover {
    border-left: 1px solid ${props => props.theme.purple};
  }
`;

const ItemContainer = styled.div`
  width: 100%;
  cursor: pointer;
`;

const ItemName = styled.span.attrs<{ itemClicked?: boolean }>({})`
  display: flex;
  align-items: stretch;
  align-content: stretch;
  border-bottom: 2px dotted
    ${props =>
      props.itemClicked
        ? props.theme.purple
        : props.theme.panelBackgroundColor};
  ${ItemContainer}:hover & {
    text-decoration: underline;
  }
  width: 100%;
`;

const ItemNameText = styled.span`
  width: 100%;
  word-wrap: break-word;
`;

const IconHolder = styled(FontAwesomeIcon)`
  margin: 0 0.4em 0 0;
  ${ItemContainer}:hover & {
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
const genDupTitleCountMap = (
  fileStructure: { [uuid: string]: string[] },
  dirName: string,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState
) => {
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
};

const renderFileTypeExtension = (noteType: string) => {
  switch (noteType) {
    case "markdown":
      return ".md";
    case "text":
      return ".txt";
    case "note":
      return ".note";
    default:
      return `.${noteType}`;
  }
};

const generateNotePreview = (
  content: string,
  processOption?: string | boolean
) => {
  if (!processOption) {
    return undefined;
  }
  const ellip = `\u2026`;
  const maxPreviewLen = 100;
  if (processOption === true) {
    return `${content.substring(0, maxPreviewLen)}${
      content.length > maxPreviewLen ? ellip : ""
    }`;
  } else {
    const sIdx = Math.max(
      content.toLowerCase().indexOf(processOption.toLowerCase()),
      0
    );
    const eIdx = Math.min(sIdx + maxPreviewLen, content.length);
    return `${sIdx > 0 ? ellip : ""}${content.substring(sIdx, eIdx)}${
      sIdx + maxPreviewLen < content.length ? ellip : ""
    }`;
  }
};

interface INoteItemViewProps {
  itemClicked: boolean;
  title: string;
  count: number;
  type: string;
  preview?: string;
  isDraft?: boolean;
  isRaw?: boolean;
  handleClickItemEvent: MouseEventHandler<HTMLElement>;
}

const NoteItemView = ({
  itemClicked,
  title,
  count,
  type,
  preview,
  isDraft,
  isRaw,
  handleClickItemEvent
}: INoteItemViewProps) => (
  <FilesItem>
    <ItemContainer onClick={handleClickItemEvent}>
      <ItemName itemClicked={itemClicked}>
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
      {preview && <MutedSpan>{preview}</MutedSpan>}
    </ItemContainer>
  </FilesItem>
);

interface IDirectoryViewProps {
  dirName: string;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  rawItems: IRawItemsState;
  fileStructure: { [uuid: string]: string[] };
  searchValue?: string;
  selectedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote?: (id: string) => MouseEventHandler<HTMLElement>;
  open: boolean;
  isSmallScreen?: boolean;
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
  searchValue,
  selectedItemId,
  handleClickItemEvent,
  handleClickNewNote,
  open = false,
  isSmallScreen
}: IDirectoryViewProps) => {
  const idToCountMap: {
    [uuid: string]: number;
  } = genDupTitleCountMap(fileStructure, dirName, processedItems, draftItems);
  return (
    <FilesList>
      <FilesItem>
        <ItemName>
          {searchValue ? (
            <IconHolder icon="search" />
          ) : open ? (
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
          {handleClickNewNote && (
            <FileAddButton onClick={handleClickNewNote(dirName)}>
              <AddNoteIcon />
              New Note
            </FileAddButton>
          )}
        </ItemName>
        {open && (
          <FilesList>
            {fileStructure[dirName].map(id => {
              if (processedItems[id]) {
                const pip = processedItems[id];
                switch (pip.contentType) {
                  case "note": {
                    if (pip.processedContent) {
                      const { title, noteType, content } = pip.processedContent;
                      const itemClicked =
                        selectedItemId === id ||
                        !!(
                          selectedItemId &&
                          draftItems[selectedItemId] &&
                          draftItems[selectedItemId].uuid &&
                          draftItems[selectedItemId].uuid === id
                        );
                      return (
                        <NoteItemView
                          key={id}
                          itemClicked={itemClicked}
                          title={title}
                          count={idToCountMap[id]}
                          type={noteType}
                          handleClickItemEvent={handleClickItemEvent(id)}
                          preview={generateNotePreview(
                            content,
                            searchValue || isSmallScreen
                          )}
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
                    const { title, noteType, content } = dip.draftContent;
                    const itemClicked =
                      selectedItemId === id || selectedItemId === dip.uuid;
                    return (
                      <NoteItemView
                        key={id}
                        itemClicked={itemClicked}
                        title={title}
                        count={idToCountMap[id]}
                        type={noteType}
                        isDraft={true}
                        handleClickItemEvent={handleClickItemEvent(id)}
                        preview={generateNotePreview(
                          content,
                          searchValue || isSmallScreen
                        )}
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
                    itemClicked={selectedItemId === id}
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
            {fileStructure[dirName].length === 0 && (
              <li>
                <MutedSpan>No Files</MutedSpan>
              </li>
            )}
          </FilesList>
        )}
      </FilesItem>
    </FilesList>
  );
};

// File Browser View

const FileBrowserContainer = styled.div.attrs<{ smScrnTemplateArea: string }>(
  {}
)`
  width: 100%;
  height: 100%;
  max-width: 100vw;
  display: grid;
  @media only screen and (max-width: ${props =>
    props.theme.smScrnBrkPx - 1}px) {
    justify-items: stretch;
    grid-template-areas: "${props => props.smScrnTemplateArea}";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  @media only screen and (min-width: ${props => props.theme.smScrnBrkPx}px) {
    grid-template-columns: 18em 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "file-list file-content";
    grid-column-gap: 1em;
  }
`;

const FileListContainer = styled.div`
  grid-area: file-list;
  display: flex;
  flex-direction: column;
`;
const FileContentContainer = styled.div`
  grid-area: file-content;
`;

const FileSearchInput = styled.input`
  width: 95%;
  align-self: center;
  padding: 0.2em;
  font-size: 1.2em;
  background: ${props => props.theme.inputBaseBackgroundColor};
  border: 1px solid ${props => props.theme.inverseColor};
  color: #000000;
  border-radius: 3px;
  :focus {
    outline: 1px solid ${props => props.theme.purple};
    border: 1px solid ${props => props.theme.purple};
  }
`;

interface IFileBrowserViewProps {
  urlParamId?: string;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  fileStructure: IStructureState;
  searchValue: string;
  searchResults: string[];
  isSmallScreen?: boolean;
  selectedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote: (id: string) => MouseEventHandler<HTMLElement>;
  handleChangeSearchValue: ChangeEventHandler<HTMLInputElement>;
}

export const FileBrowserView = ({
  urlParamId,
  processedItems,
  draftItems,
  rawItems,
  fileStructure,
  searchValue,
  searchResults,
  selectedItemId,
  isSmallScreen,
  handleClickItemEvent,
  handleClickNewNote,
  handleChangeSearchValue
}: IFileBrowserViewProps) => (
  <FileBrowserContainer
    smScrnTemplateArea={!!urlParamId ? "file-content" : "file-list"}
  >
    {((isSmallScreen && !urlParamId) || !isSmallScreen) && (
      <FileListContainer>
        <FileSearchInput
          id="search-input"
          placeholder="Search..."
          value={searchValue}
          onChange={handleChangeSearchValue}
        />
        {searchValue ? (
          <DirectoryView
            dirName="Search Results"
            processedItems={processedItems}
            draftItems={draftItems}
            rawItems={rawItems}
            fileStructure={{ ["Search Results"]: searchResults }}
            selectedItemId={selectedItemId}
            handleClickItemEvent={handleClickItemEvent}
            open={true}
            searchValue={searchValue}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          Object.keys(fileStructure).map(root => {
            return (
              <DirectoryView
                key={root}
                dirName={root}
                processedItems={processedItems}
                draftItems={draftItems}
                rawItems={rawItems}
                fileStructure={fileStructure}
                selectedItemId={selectedItemId}
                handleClickItemEvent={handleClickItemEvent}
                handleClickNewNote={handleClickNewNote}
                isSmallScreen={isSmallScreen}
                open={true}
              />
            );
          })
        )}
      </FileListContainer>
    )}
    {((isSmallScreen && !!urlParamId) || !isSmallScreen) && (
      <FileContentContainer>
        {determineContentViewer(
          selectedItemId,
          processedItems,
          draftItems,
          rawItems
        )}
      </FileContentContainer>
    )}
  </FileBrowserContainer>
);
