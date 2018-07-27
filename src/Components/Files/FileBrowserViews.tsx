import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
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

const FileItemContainer = styled.li`
  margin-top: 0.2em;
  padding-left: 0.2em;
  border-left: 1px solid ${props => props.theme.backgroundColor};
  &:hover {
    border-left: 1px solid ${props => props.theme.purple};
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
`;

const ItemName = styled.div.attrs<{ itemClicked?: boolean }>({})`
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

const DirectoryNameText = styled.span`
  width: auto;
  word-wrap: break-word;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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

const FileAddButtonContainer = styled.div`
  display: inline;
  align-self: flex-end;
  width: auto;
  margin-left: auto;
  text-align: right;
`;

const FileAddButton = styled(Button)`
  width: auto;
  padding: 0.1em;
  margin: 0;
  font-size: 1em;
  @media only screen and (max-width: ${props =>
      props.theme.smScrnBrkPx - 1}px) {
    font-size: 1.4em;
    margin-right: 0.2em;
  }
`;

/**
 * Helper function to generate a unique tile for each note (appends number for duplicate title/name)
 */
const genDupTitleCountMap = (
  fileStructure: { [uuid: string]: string[] },
  structureKey: string,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState
) => {
  const dupeTitleCounter: {
    [title: string]: number;
  } = {};
  const idToCountMap: {
    [uuid: string]: number;
  } = {};
  [...(fileStructure[structureKey] || [])].reverse().forEach(id => {
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

const renderFileTypeExtension = (fileType: string) => {
  switch (fileType) {
    case "markdown":
      return ".md";
    case "text":
      return ".txt";
    case "note":
      return ".note";
    case "directory":
      return "";
    default:
      return `.${fileType}`;
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

interface IFileViewProps {
  itemClicked: boolean;
  title: string;
  count: number;
  type: string;
  isRaw: boolean;
  preview?: string;
  isDraft?: boolean;
  createdAtString?: string;
  handleClickItemEvent?: MouseEventHandler<HTMLElement>;
}

const FileView = ({
  itemClicked,
  title,
  count,
  type,
  preview,
  isDraft,
  isRaw,
  createdAtString,
  handleClickItemEvent
}: IFileViewProps) => (
  <FileItemContainer>
    <ItemContainer onClick={handleClickItemEvent}>
      <ItemName itemClicked={itemClicked}>
        {type === "directory" ? (
          <IconHolder icon="folder" />
        ) : (
          <IconHolder icon="file-alt" />
        )}
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
      {createdAtString && <MutedSpan>Created on: {createdAtString}</MutedSpan>}
    </ItemContainer>
  </FileItemContainer>
);

interface IDirectoryViewProps {
  dirName: string;
  structureKey: string;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  rawItems: IRawItemsState;
  fileStructure: { [uuid: string]: string[] };
  closedFolder: { [structureId: string]: boolean };
  searchValue?: string;
  selectedItemId?: string;
  createdAtString?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote?: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewDirectory?: (id: string) => MouseEventHandler<HTMLElement>;
  open: boolean;
  isSmallScreen?: boolean;
}

/**
 * Folder view. Show the directory name, then the nested items/directories
 */
export const DirectoryView = ({
  dirName,
  structureKey,
  processedItems,
  draftItems,
  rawItems,
  fileStructure,
  closedFolder,
  searchValue,
  selectedItemId,
  createdAtString,
  handleClickItemEvent,
  handleClickNewNote,
  handleClickNewDirectory,
  open = false,
  isSmallScreen
}: IDirectoryViewProps): JSX.Element => {
  const idToCountMap: {
    [uuid: string]: number;
  } = genDupTitleCountMap(
    fileStructure,
    structureKey,
    processedItems,
    draftItems
  );
  return (
    <FilesList>
      <FileItemContainer>
        <ItemName>
          <DirectoryNameText onClick={handleClickItemEvent(structureKey)}>
            {searchValue ? (
              <IconHolder icon="search" />
            ) : open ? (
              <IconHolder icon="folder-open" />
            ) : (
              <IconHolder icon="folder" />
            )}
            {dirName}
          </DirectoryNameText>
          <FileAddButtonContainer>
            {handleClickNewDirectory && (
              <FileAddButton onClick={handleClickNewDirectory(structureKey)}>
                <AddDirectoryIcon />
              </FileAddButton>
            )}
            {handleClickNewNote && (
              <FileAddButton onClick={handleClickNewNote(structureKey)}>
                <AddNoteIcon />
              </FileAddButton>
            )}
          </FileAddButtonContainer>
        </ItemName>
        {createdAtString && (
          <MutedSpan>Created on: {createdAtString}</MutedSpan>
        )}
        {open && (
          <FilesList>
            {(fileStructure[structureKey] || []).map(id => {
              let fileProps: IFileViewProps | null = null;
              const count = idToCountMap[id];
              // check if item has been processed
              if (processedItems[id]) {
                const pip = processedItems[id];
                const itemClicked =
                  selectedItemId === id ||
                  !!(
                    selectedItemId &&
                    draftItems[selectedItemId] &&
                    draftItems[selectedItemId].uuid &&
                    draftItems[selectedItemId].uuid === id
                  );
                switch (pip.contentType) {
                  case "note": {
                    const { title, noteType, content } = pip.processedContent;
                    fileProps = {
                      itemClicked,
                      title,
                      count,
                      type: noteType,
                      isRaw: false,
                      preview: generateNotePreview(
                        content,
                        searchValue || isSmallScreen
                      )
                    };
                    break;
                  }
                  case "directory": {
                    // return the directory view?
                    const { dirName: title } = pip.processedContent;
                    return (
                      <DirectoryView
                        key={id}
                        dirName={title}
                        structureKey={id}
                        processedItems={processedItems}
                        draftItems={draftItems}
                        rawItems={rawItems}
                        closedFolder={closedFolder}
                        fileStructure={fileStructure}
                        selectedItemId={selectedItemId}
                        createdAtString={DateTime.fromMillis(
                          rawItems[id] && rawItems[id].createdAt
                        ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                        handleClickItemEvent={handleClickItemEvent}
                        handleClickNewNote={handleClickNewNote}
                        handleClickNewDirectory={handleClickNewDirectory}
                        open={!closedFolder[id]}
                        isSmallScreen={isSmallScreen}
                      />
                    );
                  }
                }
              }
              // fallthough, check if item has draft
              if (!fileProps && draftItems[id]) {
                const dip = draftItems[id];
                switch (dip.contentType) {
                  case "note": {
                    const { title, noteType, content } = dip.draftContent;
                    const itemClicked =
                      selectedItemId === id || selectedItemId === dip.uuid;
                    fileProps = {
                      itemClicked,
                      title,
                      count,
                      type: noteType,
                      isRaw: false,
                      isDraft: true,
                      preview: generateNotePreview(
                        content,
                        searchValue || isSmallScreen
                      ),
                      createdAtString: DateTime.fromMillis(
                        parseInt(id, 10)
                      ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                    };
                    break;
                  }
                  case "directory": {
                    const { dirName: title } = dip.draftContent;
                    const itemClicked = selectedItemId === id;
                    fileProps = {
                      itemClicked,
                      title,
                      count,
                      type: "directory",
                      isRaw: false,
                      isDraft: true
                    };
                  }
                }
              }
              // extend (or catch), add raw item values (like createdAtString)
              if (rawItems[id]) {
                const ri = rawItems[id];
                fileProps = {
                  itemClicked: selectedItemId === id,
                  title: ri.uuid,
                  count: 0,
                  type: ri.contentType || "deleted",
                  isRaw: true,
                  createdAtString: DateTime.fromMillis(
                    ri.createdAt
                  ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
                  ...fileProps
                };
              }
              if (fileProps) {
                return (
                  <FileView
                    key={id}
                    handleClickItemEvent={handleClickItemEvent(id)}
                    {...fileProps}
                  />
                );
              }
              // catch all error state
              return <SimpleLoader key={id} loading={true} />;
            })}
            {(fileStructure[structureKey] || []).length === 0 && (
              <li>
                <MutedSpan>No Files</MutedSpan>
              </li>
            )}
          </FilesList>
        )}
      </FileItemContainer>
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
  rootDirName: string;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  closedFolder: { [structureId: string]: boolean };
  fileStructure: IStructureState;
  searchValue: string;
  searchResults: string[];
  loading: boolean;
  isSmallScreen?: boolean;
  selectedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewNote: (id: string) => MouseEventHandler<HTMLElement>;
  handleClickNewDirectory: (id: string) => MouseEventHandler<HTMLElement>;
  handleChangeSearchValue: ChangeEventHandler<HTMLInputElement>;
}

export const FileBrowserView = ({
  loading,
  urlParamId,
  rootDirName,
  processedItems,
  draftItems,
  rawItems,
  closedFolder,
  fileStructure,
  searchValue,
  searchResults,
  selectedItemId,
  isSmallScreen,
  handleClickItemEvent,
  handleClickNewNote,
  handleClickNewDirectory,
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
            structureKey="search"
            processedItems={processedItems}
            draftItems={draftItems}
            rawItems={rawItems}
            closedFolder={closedFolder}
            fileStructure={{ search: searchResults }}
            selectedItemId={selectedItemId}
            handleClickItemEvent={handleClickItemEvent}
            open={true}
            searchValue={searchValue}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          <DirectoryView
            key={rootDirName}
            dirName={rootDirName}
            structureKey={rootDirName}
            processedItems={processedItems}
            draftItems={draftItems}
            rawItems={rawItems}
            closedFolder={closedFolder}
            fileStructure={fileStructure}
            selectedItemId={selectedItemId}
            handleClickItemEvent={handleClickItemEvent}
            handleClickNewNote={handleClickNewNote}
            handleClickNewDirectory={handleClickNewDirectory}
            isSmallScreen={isSmallScreen}
            open={!closedFolder[rootDirName]}
          />
        )}
        <SimpleLoader loading={loading} />
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
