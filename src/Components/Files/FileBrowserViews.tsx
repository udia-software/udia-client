import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEventHandler } from "react";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import styled from "../AppStyles";
import { Button } from "../Helpers/Button";
import SimpleLoader from "../Helpers/SimpleLoader";
import NoteFileEditorController from "../Notes/NoteFileEditorController";
import { MutedSpan } from "../Notes/NotesShared";

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
        ? props.theme.intermediateColor
        : props.theme.panelBackgroundColor};
  width: 100%;
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

interface IDirectoryViewProps {
  dirName: string;
  processedItems: IProcessedItemsState;
  fileStructure: { [uuid: string]: string[] };
  clickedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
  open: boolean;
}
/**
 * Folder view. Show the directory name, then the nested items/directories
 */
export const DirectoryView = ({
  dirName,
  processedItems,
  fileStructure,
  clickedItemId,
  handleClickItemEvent,
  open = false
}: IDirectoryViewProps) => {
  const dupeTitleCounter: { [title: string]: number } = {};
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
          <FileAddButton>
            <AddDirectoryIcon />
            New Folder
          </FileAddButton>
          <FileAddButton>
            <AddNoteIcon />
            New Note
          </FileAddButton>
        </ItemName>
        {open && (
          <FilesList>
            {fileStructure[dirName].map(id => {
              const pip = processedItems[id];
              if (pip) {
                switch (pip.contentType) {
                  case "note": {
                    if (pip.processedContent) {
                      const { title, noteType } = pip.processedContent;
                      const count = dupeTitleCounter[title] || 0;
                      dupeTitleCounter[title] = count + 1;
                      return (
                        <FilesItem key={id}>
                          <ItemName
                            itemClicked={clickedItemId === id}
                            onClick={handleClickItemEvent(id)}
                          >
                            <IconHolder icon="file-alt" />
                            <span>
                              {title ? title : <MutedSpan>Untitled</MutedSpan>}
                              <MutedSpan>
                                {count > 0 && `-${count}`}
                                {noteType === "text" && ".txt"}
                                {noteType === "markdown" && ".md"}
                              </MutedSpan>
                            </span>
                          </ItemName>
                        </FilesItem>
                      );
                    }
                  }
                }
              }
              return <SimpleLoader key={id} loading={true} />;
            })}
          </FilesList>
        )}
      </FilesItem>
    </FilesList>
  );
};

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
  fileStructure: IStructureState;
  clickedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
}

export const FileBrowserView = ({
  processedItems,
  fileStructure,
  clickedItemId,
  handleClickItemEvent
}: IFileBrowserViewProps) => (
  <FileBrowserContainer>
    <FileListContainer>
      {Object.keys(fileStructure).map(root => {
        return (
          <DirectoryView
            key={root}
            dirName={root}
            processedItems={processedItems}
            fileStructure={fileStructure}
            clickedItemId={clickedItemId}
            handleClickItemEvent={handleClickItemEvent}
            open={true}
          />
        );
      })}
    </FileListContainer>
    <FileContentContainer>
      <NoteFileEditorController editItemId={clickedItemId} />
    </FileContentContainer>
  </FileBrowserContainer>
);
