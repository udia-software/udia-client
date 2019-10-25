import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  RefObject
} from "react";
import styled from "../AppStyles";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import {
  DiscardDraftButton,
  EditItemTitle,
  EditorActions,
  SaveDraftButton
} from "./ItemFileShared";

interface IProps {
  loading: boolean;
  loadingText?: string;
  titleValue: string;
  hasDraft: boolean;
  isEditing: boolean;
  handleDraftChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleDraftFocus: FocusEventHandler<HTMLTextAreaElement>;
  handleDiscardDraft: MouseEventHandler<HTMLButtonElement>;
  handleSaveDraft: MouseEventHandler<HTMLButtonElement>;
  handleDeleteDirectory: MouseEventHandler<HTMLButtonElement>;
  dirNameRef: RefObject<HTMLTextAreaElement>;
}

const DirectoryEditorLoadingGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas: "dir-editor";
`;

const DirectoryEditorContainer = styled.div`
  grid-area: dir-editor;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const DirectoryEditableArea = styled.div`
  height: 100%;
`;

const DirectoryItemEditorView = ({
  loading,
  loadingText,
  titleValue,
  hasDraft,
  isEditing,
  handleDraftChange,
  handleDraftFocus,
  handleDiscardDraft,
  handleSaveDraft,
  handleDeleteDirectory,
  dirNameRef
}: IProps) => (
  <DirectoryEditorLoadingGrid>
    <GridTemplateLoadingOverlay
      gridAreaName="dir-editor"
      loading={loading}
      loadingText={loadingText}
    />
    <DirectoryEditorContainer>
      <DirectoryEditableArea>
        <h1>Drafting Directory</h1>
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
      </DirectoryEditableArea>
      <EditorActions>
        {hasDraft && (
          <DiscardDraftButton onClick={handleDiscardDraft}>
            <FontAwesomeIcon icon="trash" />
            {" Discard Changes"}
          </DiscardDraftButton>
        )}
        {hasDraft && (
          <SaveDraftButton onClick={handleSaveDraft}>
            <FontAwesomeIcon icon="save" />
            {" Save Directory"}
          </SaveDraftButton>
        )}
        {!hasDraft &&
          isEditing && (
            <DiscardDraftButton onClick={handleDeleteDirectory}>
              <FontAwesomeIcon icon="trash" />
              {" Delete Directory"}
            </DiscardDraftButton>
          )}
      </EditorActions>
    </DirectoryEditorContainer>
  </DirectoryEditorLoadingGrid>
);

export default DirectoryItemEditorView;
