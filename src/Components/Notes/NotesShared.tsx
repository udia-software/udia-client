import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import styled from "../AppStyles";

export const ViewNoteTitle = styled.h1`
  padding: 0;
  margin: 0;
`;

export const NoteMarkdownContent = styled(ReactMarkdown)`
  flex: 10 1 100%;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: ${props => props.theme.panelBackgroundColor};
  }
  a {
    cursor: pointer;
    transition: color 0.1s ease;
    text-decoration: none;
    color: ${props => props.theme.intermediateColor};
    &:hover {
      color: ${props => props.theme.primaryColor};
    }
  }
`;

export const NoteTextContent = styled.div`
  flex: 10 1 100%;
  margin-top: 1em;
  white-space: pre-wrap;
`;

export const NoValue = styled.span`
  font-style: italic;
  color: ${props => props.theme.intermediateColor};
`;

/**
 * Utility function for fetching a note from the API and decrypting it.
 */
export const fetchAndProcessNote = async (
  cryptoManager: CryptoManager | null,
  client: ApolloClient<NormalizedCacheObject>,
  rawNotes: { [index: string]: Item },
  uuid: string,
  user: FullUser,
  akB64?: string,
  mkB64?: string,
  setLoadingText: (loadingText: string) => void = () => undefined
) => {
  // check for CryptoManager
  if (!cryptoManager) {
    throw new Error("Browser does not support WebCrypto!");
  }

  let rawNote: Item = rawNotes[uuid];
  // item does not exist in the redux rawNotes object. Fetch it.
  if (!rawNote) {
    setLoadingText("Fetching note from the server...");
    const response = await client.query<IGetItemResponseData>({
      query: GET_ITEM_QUERY,
      variables: { id: uuid }
    });
    const { getItem } = response.data;
    if (!getItem) {
      throw new Error("Item does not exist!");
    }
    if (getItem.user.uuid !== user.uuid) {
      throw new Error("Cannot decrypt or view unowned secret notes!");
    }
    rawNote = getItem;
  }

  setLoadingText("Decrypting note...");
  if (!akB64 || !mkB64) {
    throw new Error("Encryption secrets not set! Please re-authenticate.");
  }
  const decryptedNote = await cryptoManager.decryptNoteFromItem(
    rawNote,
    user.encSecretKey,
    akB64,
    mkB64,
    setLoadingText
  );
  return { rawNote, decryptedNote };
};

const GET_ITEM_QUERY = gql`
  query GetItemQuery($id: ID!, $childrenParams: ItemPaginationInput) {
    getItem(id: $id) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children(params: $childrenParams) {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
interface IGetItemResponseData {
  getItem: Item;
}
