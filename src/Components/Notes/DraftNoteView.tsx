import React, {
  ChangeEventHandler,
  Component,
  Fragment,
  MouseEventHandler
} from "react";
import ReactMarkdown from "react-markdown";
import { IDraftNote } from "../../Modules/Reducers/Notes/Reducer";
import styled, { BaseTheme } from "../AppStyles";
import { Button } from "../Auth/SignViewShared";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";

const NoteViewContainer = styled.div`
  display: grid;
  margin: 1em;
  max-width: 100%;
  height: 100%;
  grid-template-areas: "note-draft-view";
`;

const NoteViewContent = styled.div`
  grid-area: note-draft-view;
  display: grid;
  grid-auto-rows: auto auto 1fr;
  grid-auto-columns: auto;
  grid-auto-flow: row;
  margin: 1em;
  max-width: 100%;
  @media only screen and (min-width: ${props => props.theme.lgScrnBrkPx}px) {
    grid-template-areas:
      "state-holder state-holder"
      "note-editor-title note-preview-title"
      "note-editor-content note-preview-content";
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
  }
  @media only screen and (max-width: ${props =>
      props.theme.lgScrnBrkPx - 1}px) {
    grid-template-areas:
      "state-holder"
      "note-title"
      "note-content";
    grid-template-columns: auto;
  }
`;

const NoteStateHolder = styled.div`
  grid-area: state-holder;
  display: grid;
  grid-template-areas:
    "note-actions"
    "toggle-note-type"
    "note-response";
`;

const NoteStateActions = styled.div`
  display: grid;
  grid-area: note-actions;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

const ToggleNoteTypeContainer = styled.div`
  grid-area: toggle-note-type;
  display: grid;
  grid-auto-flow: column;
`;

const ToggleNoteTypeLabel = styled.label`
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
`;

const NoteStateResponse = styled.div`
  display: grid;
  grid-area: note-response;
  grid-auto-flow: row;
  grid-auto-rows: auto;
`;

const EditNoteTitle = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  font-family: monospace;
  padding: 0 0 0.5em 0;
  font-size: 2em;
  max-height: 100%;
  width: 100%;
`;

const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0.2em 0;
`;

const EditNoteContent = styled.textarea`
  background: transparent;
  border: none;
  color: ${props => props.theme.primaryColor};
  padding: 0;
  width: 100%;
`;

const NoteMarkdownContent = styled(ReactMarkdown)``;

const NoteTextContent = styled.div`
  white-space pre-line;
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
  draftNote: IDraftNote;
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
    console.log(`isLargeScreen? ${isLargeScreen}`, width, lgScrnBrkPx);

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
              <ViewNoteTitle>
                {preview ? "View Note" : "Draft Note"}
              </ViewNoteTitle>
              {isLargeScreen && (
                <Fragment>
                  {(draftNote.content || draftNote.title) && (
                    <Button onClick={handleDiscardDraftNote}>
                      Discard Note
                    </Button>
                  )}
                  <Button onClick={handleSubmit}>Submit</Button>
                </Fragment>
              )}
              {!isLargeScreen &&
                (preview ? (
                  <Fragment>
                    <Button onClick={handleTogglePreview}>Edit</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    {(draftNote.content || draftNote.title) && (
                      <Button onClick={handleDiscardDraftNote}>
                        Discard Note
                      </Button>
                    )}
                    <Button onClick={handleTogglePreview}>Preview</Button>
                  </Fragment>
                ))}
            </NoteStateActions>
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
            <NoteStateResponse>
              <FormFieldErrors errors={errors} />
            </NoteStateResponse>
            <HorizontalLine />
          </NoteStateHolder>
          {(isLargeScreen || !preview) && (
            <EditNoteTitle
              placeholder="Note Title"
              onChange={handleChangeNoteTitle}
              value={draftNote.title}
            />
          )}
          {(isLargeScreen || preview) && (
            <ViewNoteTitle>
              {!!draftNote.title ? (
                draftNote.title
              ) : (
                <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
              )}
            </ViewNoteTitle>
          )}
          {(isLargeScreen || !preview) && (
            <EditNoteContent
              placeholder="Note Content"
              onChange={handleChangeNoteContent}
              value={draftNote.content}
            />
          )}
          {(isLargeScreen || preview) &&
            (draftNote.content ? (
              draftNote.noteType === "markdown" ? (
                <NoteMarkdownContent source={draftNote.content} />
              ) : (
                <NoteTextContent>{draftNote.content}</NoteTextContent>
              )
            ) : (
              <NoValue style={{ fontStyle: "italic" }}>null</NoValue>
            ))}
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
