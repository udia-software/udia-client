import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEventHandler } from "react";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import styled from "../AppStyles";
import SimpleLoader from "../Helpers/SimpleLoader";
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

const ItemOptionDots = styled(FontAwesomeIcon)`
  align-self: flex-end;
  margin-left: auto;
  margin-right: 1em;
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
          {/* <ItemOptionDots icon="ellipsis-v" /> */}
        </ItemName>
        {open && (
          <FilesList>
            {fileStructure[dirName].map(uuid => {
              if (uuid === "_persist") {
                return null;
              }
              const pip = processedItems[uuid];
              if (pip) {
                switch (pip.contentType) {
                  case "note": {
                    if (pip.processedContent) {
                      const { title, noteType } = pip.processedContent;
                      const count = dupeTitleCounter[title] || 0;
                      dupeTitleCounter[title] = count + 1;
                      return (
                        <FilesItem key={title + `-${count}`}>
                          <ItemName
                            itemClicked={clickedItemId === uuid}
                            onClick={handleClickItemEvent(uuid)}
                          >
                            <IconHolder icon="file-alt" />
                            {title ? title : <MutedSpan>Untitled</MutedSpan>}
                            <MutedSpan>
                              {count > 0 && `-${count}`}
                              {noteType === "text" && ".txt"}
                              {noteType === "markdown" && ".md"}
                            </MutedSpan>
                            <ItemOptionDots icon="ellipsis-v" />
                          </ItemName>
                        </FilesItem>
                      );
                    }
                  }
                }
              }
              return <SimpleLoader key={uuid} loading={true} />;
            })}
          </FilesList>
        )}
      </FilesItem>
    </FilesList>
  );
};

interface IFileBrowserViewProps {
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  fileStructure: { [uuid: string]: string[] };
  clickedItemId?: string;
  handleClickItemEvent: (id: string) => MouseEventHandler<HTMLElement>;
}

export const FileBrowserView = ({
  processedItems,
  fileStructure,
  clickedItemId,
  handleClickItemEvent
}: IFileBrowserViewProps) => (
  <div>
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
  </div>
);
