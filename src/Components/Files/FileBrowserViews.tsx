import React from "react";
import { MutedSpan } from "../Notes/NotesShared";

interface IDirectoryViewProps {
  dirName: string;
  nestedItems: ProcessedItemPayload[];
  open: boolean;
}
/**
 * Folder view. Show the directory name, then the nested items/directories
 */
export const DirectoryView = ({
  dirName,
  nestedItems,
  open = false
}: IDirectoryViewProps) => {
  const dupeTitleCounter: { [title: string]: number } = {};
  return (
    <ul>
      <li>
        {dirName}
        {open && (
          <ul>
            {nestedItems.map(pip => {
              if (pip) {
                if (pip.processedContent) {
                  const { title, noteType } = pip.processedContent;
                  const count = dupeTitleCounter[title] || 0;
                  dupeTitleCounter[title] = count + 1;
                  return (
                    <li key={title + `-${count}`}>
                      {title ? title : <MutedSpan>Untitled</MutedSpan>}
                      <MutedSpan>
                        {count > 0 && `-${count}`}
                        {noteType === "text" && ".txt"}
                        {noteType === "markdown" && ".md"}
                      </MutedSpan>
                    </li>
                  );
                }
              }
              return null;
            })}
          </ul>
        )}
      </li>
    </ul>
  );
};
