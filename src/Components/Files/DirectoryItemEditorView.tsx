import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  RefObject
} from "react";
import { Button } from "../Helpers/Button";
import { EditItemTitle } from "./ItemFileShared";

interface IProps {
  loading: boolean;
  loadingText?: string;
  titleValue: string;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleDraftFocus: FocusEventHandler<HTMLTextAreaElement>;
  handleSaveDraft: MouseEventHandler<HTMLButtonElement>;
  dirNameRef: RefObject<HTMLTextAreaElement>;
}

const DirectoryItemEditorView = ({
  titleValue,
  handleDraftChange,
  handleDraftFocus,
  handleSaveDraft,
  dirNameRef
}: IProps) => (
  <div>
    <h1>Create Directory</h1>
    <EditItemTitle
      id="edit-dir-title"
      key="edit-dir-title"
      rows={1}
      name="dirName"
      innerRef={dirNameRef}
      value={titleValue}
      placeholder="Untitled"
      onChange={handleDraftChange}
      onFocus={handleDraftFocus}
    />
    <Button onClick={handleSaveDraft}>Save Directory</Button>
  </div>
);

export default DirectoryItemEditorView;
