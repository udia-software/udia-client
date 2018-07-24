import { DateTime } from "luxon";
import React from "react";
import styled from "../AppStyles";
import FieldErrors from "../Helpers/FieldErrors";
import { HorizontalLine, MutedSpan } from "../Notes/NotesShared";

const RawItemEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const WrappingPre = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

interface IProps {
  itemId: string;
  rawItem?: Item;
  processedItemPayload?: ProcessedItemPayload;
}

const RawItemEditorView = ({
  itemId,
  rawItem,
  processedItemPayload
}: IProps) => (
  <RawItemEditorContainer>
    <span style={{ fontSize: "1.5em" }}>{itemId}</span>
    {processedItemPayload && (
      <div>
        <p>
          <strong>Processed At</strong>
          {": "}
          <span>
            {DateTime.fromMillis(
              processedItemPayload.processedAt
            ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}
          </span>
        </p>
        <FieldErrors errors={processedItemPayload.errors || []} />
      </div>
    )}
    <HorizontalLine />
    <MutedSpan>Raw Item:</MutedSpan>
    {rawItem ? (
      <WrappingPre>
        <code>{JSON.stringify(rawItem, null, 2)}</code>
      </WrappingPre>
    ) : (
      <MutedSpan>NOT FOUND</MutedSpan>
    )}
  </RawItemEditorContainer>
);

export default RawItemEditorView;
