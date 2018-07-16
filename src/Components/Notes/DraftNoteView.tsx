import React, {
  ChangeEventHandler,
  Component,
  Fragment,
  MouseEventHandler
} from "react";
import styled, { BaseTheme } from "../AppStyles";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  HorizontalLine,
  MutedSpan,
  NoteMarkdownContent,
  NoteTextContent,
  ViewNoteTitle
} from "./NotesShared";

const NoteViewContainer = styled.div`
  display: grid;
  max-width: 100%;
  height: 100%;
  grid-template-areas: "note-draft-view";
`;

const NoteViewContent = styled.div`
  grid-area: note-draft-view;
  display: flex;
  margin: 0.5em;
  max-width: 100%;
  height: 100%;
  align-items: stretch;
  flex-direction: column;
`;

const NoteStateHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const NoteStateActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  align-items: stretch;
  margin-bottom: 1em;
`;

const NoteStateTitle = styled.h1`
  flex: 1 1 0;
  padding: 0;
  margin: 0;
`;

const NoteStateButton = styled(Button)`
  flex: 1 1 0;
  font-size: 1.1em;
  height: 2em;
`;

const ToggleNoteTypeContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  @media only screen and (max-width: ${props =>
      props.theme.smScrnBrkPx - 1}px) {
    margin-top: 1em;
  }
`;

const ToggleNoteTypeLabel = styled.label.attrs<{ disabled?: boolean }>({})`
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
  width: 100%;
  font-size: 1.1em;
  padding: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.disabled ? "0.4" : "1")};
`;

const NoteStateResponse = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoteHolderContainer = styled.div`
  display: flex;
  padding: 0;
  margin: 0 0 1em 0;
  width: 100%;
  height: 100%;
`;

const NoteHolderLargeScreenLayout = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-areas: "note-holder-left note-holder-right";
`;

const NoteHolderLeftSide = styled.div`
  grid-area: note-holder-left;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const NoteHolderRightSide = styled.div`
  grid-area: note-holder-right;
  display: inline-block;
  vertical-align: top;
  margin-left: 0.4em;
`;

const NoteHolderFullWidth = styled.div`
  width: 100%;
`;

const NoteHolderTitleCell = styled.div.attrs<{ debouncing?: boolean }>({})`
  display: block;
  padding: 0;
  width: 100%;
  ${props =>
    props.debouncing
      ? `border: 1px dashed ${props.theme.purple}`
      : `border: 1px solid ${props.theme.backgroundColor}`};
`;

const NoteHolderContentCell = styled.div.attrs<{ debouncing?: boolean }>({})`
  display: block;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  ${props =>
    props.debouncing
      ? `border: 1px dashed ${props.theme.purple}`
      : `border: 1px solid ${props.theme.backgroundColor}`};
`;

const EditNoteTitle = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  font-family: monospace;
  padding: 0;
  margin: 0;
  font-size: 2em;
  height: 100%;
  width: 100%;
`;

const EditNoteContent = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
  disableDrafting: boolean;
  errors: string[];
  preview: boolean;
  draftNote: DecryptedNote;
  debouncingTitle: boolean;
  debouncedTitle: string;
  debouncingContent: boolean;
  debouncedContent: string;
  handleDiscardDraftNote: MouseEventHandler<HTMLButtonElement>;
  handleTogglePreview: MouseEventHandler<HTMLButtonElement>;
  handleToggleNoteType: ChangeEventHandler<HTMLInputElement>;
  handleChangeNoteTitle: ChangeEventHandler<HTMLTextAreaElement>;
  handleChangeNoteContent: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
}

// I guess, due to css magic, this view needs some viewport state logic for responsive DOM
interface IState {
  width: number;
}

interface IWithContentRef {
  contentRef?: HTMLTextAreaElement;
}

class DraftNoteView extends Component<IProps, IState>
  implements IWithContentRef {
  public contentRef?: HTMLTextAreaElement;
  constructor(props: IProps) {
    super(props);
    this.state = { width: window.innerWidth };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResizeEvent);
    if (this.contentRef) {
      this.contentRef.focus();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
  }

  public render() {
    const {
      loading,
      loadingText,
      disableDrafting,
      errors,
      preview,
      draftNote,
      debouncingTitle,
      debouncedTitle,
      debouncingContent,
      debouncedContent,
      handleDiscardDraftNote,
      handleTogglePreview,
      handleToggleNoteType,
      handleChangeNoteTitle,
      handleChangeNoteContent,
      handleSubmit
    } = this.props;
    const { width } = this.state;
    const { lgScrnBrkPx } = BaseTheme;
    const isLargeScreen = width >= lgScrnBrkPx;

    // tslint:disable-next-line:no-console
    // console.log(`isLargeScreen? ${isLargeScreen}`, width, lgScrnBrkPx);

    return (
      <NoteViewContainer>
        <GridTemplateLoadingOverlay
          gridAreaName="note-draft-view"
          loading={loading}
          loadingText={loadingText}
        />
        <NoteViewContent>
          <NoteStateHolder>
            <NoteStateActions>
              <NoteStateTitle>
                {preview ? "View Note" : "Draft Note"}
              </NoteStateTitle>
              {isLargeScreen && (
                <Fragment>
                  {(draftNote.title || draftNote.content) && (
                    <NoteStateButton
                      onClick={handleDiscardDraftNote}
                      disabled={disableDrafting}
                    >
                      Discard Note
                    </NoteStateButton>
                  )}
                  <NoteStateButton
                    onClick={handleSubmit}
                    disabled={disableDrafting}
                  >
                    Publish
                  </NoteStateButton>
                </Fragment>
              )}
              {!isLargeScreen &&
                (preview ? (
                  <Fragment>
                    <NoteStateButton
                      onClick={handleTogglePreview}
                      disabled={disableDrafting}
                    >
                      Edit
                    </NoteStateButton>
                    <NoteStateButton
                      onClick={handleSubmit}
                      disabled={disableDrafting}
                    >
                      Publish
                    </NoteStateButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    {(draftNote.title || draftNote.content) && (
                      <NoteStateButton
                        onClick={handleDiscardDraftNote}
                        disabled={disableDrafting}
                      >
                        Discard Note
                      </NoteStateButton>
                    )}
                    <NoteStateButton
                      onClick={handleTogglePreview}
                      disabled={disableDrafting}
                    >
                      Preview
                    </NoteStateButton>
                  </Fragment>
                ))}
            </NoteStateActions>
            {(isLargeScreen || preview) && (
              <ToggleNoteTypeContainer>
                <ToggleNoteTypeLabel disabled={disableDrafting}>
                  <input
                    type="radio"
                    name="noteType"
                    value="text"
                    checked={draftNote.noteType === "text"}
                    onChange={handleToggleNoteType}
                    disabled={disableDrafting}
                  />
                  Text
                </ToggleNoteTypeLabel>
                <ToggleNoteTypeLabel disabled={disableDrafting}>
                  <input
                    type="radio"
                    name="noteType"
                    value="markdown"
                    checked={draftNote.noteType === "markdown"}
                    onChange={handleToggleNoteType}
                    disabled={disableDrafting}
                  />
                  Markdown
                </ToggleNoteTypeLabel>
              </ToggleNoteTypeContainer>
            )}
            <NoteStateResponse>
              <FieldErrors errors={errors} />
            </NoteStateResponse>
            <HorizontalLine />
          </NoteStateHolder>
          {isLargeScreen && (
            <NoteHolderContainer>
              <NoteHolderLargeScreenLayout>
                <NoteHolderLeftSide>
                  <NoteHolderTitleCell>
                    <EditNoteTitle
                      placeholder="Note Title"
                      onChange={handleChangeNoteTitle}
                      value={draftNote.title}
                      disabled={disableDrafting}
                    />
                  </NoteHolderTitleCell>
                  <NoteHolderContentCell>
                    <EditNoteContent
                      // rows={Math.max(draftNote.content.split("\n").length, 2) + 2}
                      placeholder="Note Content"
                      onChange={handleChangeNoteContent}
                      value={draftNote.content}
                      innerRef={this.setupContentRef}
                      disabled={disableDrafting}
                    />
                  </NoteHolderContentCell>
                </NoteHolderLeftSide>
                <NoteHolderRightSide>
                  <NoteHolderTitleCell debouncing={debouncingTitle}>
                    <ViewNoteTitle>
                      {!!debouncedTitle ? (
                        debouncedTitle
                      ) : (
                        <MutedSpan>Untitled</MutedSpan>
                      )}
                    </ViewNoteTitle>
                  </NoteHolderTitleCell>
                  <NoteHolderContentCell debouncing={debouncingContent}>
                    {draftNote.content ? (
                      draftNote.noteType === "markdown" ? (
                        <NoteMarkdownContent source={debouncedContent} />
                      ) : (
                        <NoteTextContent>{debouncedContent}</NoteTextContent>
                      )
                    ) : (
                      <MutedSpan>null</MutedSpan>
                    )}
                  </NoteHolderContentCell>
                </NoteHolderRightSide>
              </NoteHolderLargeScreenLayout>
            </NoteHolderContainer>
          )}
          {!isLargeScreen && (
            <NoteHolderContainer>
              {!preview && (
                <NoteHolderFullWidth>
                  <NoteHolderTitleCell>
                    <EditNoteTitle
                      placeholder="Note Title"
                      onChange={handleChangeNoteTitle}
                      value={draftNote.title}
                      disabled={disableDrafting}
                    />
                  </NoteHolderTitleCell>
                  <NoteHolderContentCell>
                    <EditNoteContent
                      rows={
                        Math.max(draftNote.content.split("\n").length, 2) + 2
                      }
                      placeholder="Note Content"
                      onChange={handleChangeNoteContent}
                      value={draftNote.content}
                      innerRef={this.setupContentRef}
                      disabled={disableDrafting}
                    />
                  </NoteHolderContentCell>
                </NoteHolderFullWidth>
              )}
              {preview && (
                <NoteHolderFullWidth>
                  <NoteHolderTitleCell>
                    <ViewNoteTitle>
                      {!!draftNote.title ? (
                        draftNote.title
                      ) : (
                        <MutedSpan>Untitled</MutedSpan>
                      )}
                    </ViewNoteTitle>
                  </NoteHolderTitleCell>
                  <NoteHolderContentCell>
                    {draftNote.content ? (
                      draftNote.noteType === "markdown" ? (
                        <NoteMarkdownContent source={draftNote.content} />
                      ) : (
                        <NoteTextContent>{draftNote.content}</NoteTextContent>
                      )
                    ) : (
                      <MutedSpan>null</MutedSpan>
                    )}
                  </NoteHolderContentCell>
                </NoteHolderFullWidth>
              )}
            </NoteHolderContainer>
          )}
        </NoteViewContent>
      </NoteViewContainer>
    );
  }

  protected handleResizeEvent = () => {
    this.setState({ width: window.innerWidth });
  };

  protected setupContentRef = (elem: HTMLTextAreaElement) =>
    (this.contentRef = elem);
}

export default DraftNoteView;
