import React, {
  ChangeEventHandler,
  Component,
  Fragment,
  MouseEventHandler
} from "react";
import styled, { BaseTheme } from "../AppStyles";
import { Button } from "../Auth/SignViewShared";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import { NoteMarkdownContent, NoteTextContent, ViewNoteTitle } from "./NoteViewShared";

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
  min-height: 2em;
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

const ToggleNoteTypeLabel = styled.label`
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
  width: 100%;
  font-size: 1.1em;
  padding-bottom: 0.5em;
  text-align: center;
`;

const NoteStateResponse = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoteHolderContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;

const NoteHolderLeftSide = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 50%;
`;
const NoteHolderRightSide = styled.div`
  display: inline-block;
  vertical-align: top;
  width: calc(50% - 0.4em);
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
  width: 100%;
  height: 100%;
`;

const NoValue = styled.span`
  font-style: italic;
  color: ${props => props.theme.inputErrorColor};
`;

const HorizontalLine = styled.hr`
  width: 100%;
`;

interface IProps {
  loading: boolean;
  loadingText?: string;
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

class DraftNoteView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { width: window.innerWidth };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResizeEvent);
  }

  public render() {
    const {
      loading,
      loadingText,
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
                    <NoteStateButton onClick={handleDiscardDraftNote}>
                      Discard Note
                    </NoteStateButton>
                  )}
                  <NoteStateButton onClick={handleSubmit}>
                    Submit
                  </NoteStateButton>
                </Fragment>
              )}
              {!isLargeScreen &&
                (preview ? (
                  <Fragment>
                    <NoteStateButton onClick={handleTogglePreview}>
                      Edit
                    </NoteStateButton>
                    <NoteStateButton onClick={handleSubmit}>
                      Submit
                    </NoteStateButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    {(draftNote.title || draftNote.content) && (
                      <NoteStateButton onClick={handleDiscardDraftNote}>
                        Discard Note
                      </NoteStateButton>
                    )}
                    <NoteStateButton onClick={handleTogglePreview}>
                      Preview
                    </NoteStateButton>
                  </Fragment>
                ))}
            </NoteStateActions>
            {(isLargeScreen || preview) && (
              <ToggleNoteTypeContainer>
                <ToggleNoteTypeLabel>
                  <input
                    type="radio"
                    name="noteType"
                    value="text"
                    checked={draftNote.noteType === "text"}
                    onChange={handleToggleNoteType}
                  />
                  Text
                </ToggleNoteTypeLabel>
                <ToggleNoteTypeLabel>
                  <input
                    type="radio"
                    name="noteType"
                    value="markdown"
                    checked={draftNote.noteType === "markdown"}
                    onChange={handleToggleNoteType}
                  />
                  Markdown
                </ToggleNoteTypeLabel>
              </ToggleNoteTypeContainer>
            )}
            <NoteStateResponse>
              <FormFieldErrors errors={errors} />
            </NoteStateResponse>
            <HorizontalLine />
          </NoteStateHolder>
          {isLargeScreen && (
            <NoteHolderContainer>
              <NoteHolderLeftSide>
                <NoteHolderTitleCell>
                  <EditNoteTitle
                    placeholder="Note Title"
                    onChange={handleChangeNoteTitle}
                    value={draftNote.title}
                  />
                </NoteHolderTitleCell>
                <NoteHolderContentCell>
                  <EditNoteContent
                    rows={Math.max(draftNote.content.split("\n").length, 2) + 2}
                    placeholder="Note Content"
                    onChange={handleChangeNoteContent}
                    value={draftNote.content}
                  />
                </NoteHolderContentCell>
              </NoteHolderLeftSide>
              <NoteHolderRightSide>
                <NoteHolderTitleCell debouncing={debouncingTitle}>
                  <ViewNoteTitle>
                    {!!debouncedTitle ? (
                      debouncedTitle
                    ) : (
                      <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
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
                    <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
                  )}
                </NoteHolderContentCell>
              </NoteHolderRightSide>
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
                        <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
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
                      <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
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

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
  }

  protected handleResizeEvent = () => {
    this.setState({ width: window.innerWidth });
  };
}

export default DraftNoteView;
