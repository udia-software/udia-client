import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { addRawNotes } from "../../Modules/Reducers/Notes/Actions";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  akB64?: string;
  mkB64?: string;
  noteIDs: string[];
  rawNotes: { [index: string]: Item };
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number;
      decryptedNote: DecryptedNote;
      errors?: string[];
    };
  };
}

interface IState {
  errors: string[];
  count: number;
}

class ListNotesController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "List Notes - UDIA";
    this.state = {
      errors: [],
      count: -1
    };
  }

  public async componentDidMount() {
    return this.fetchAndProcessItems();
  }

  public render() {
    const { rawNotes, noteIDs } = this.props;
    const { count } = this.state;
    return (
      <div>
        <h1>List Notes {count}</h1>
        {noteIDs.map(noteUUID => {
          return (
            <div key={noteUUID}>
              {noteUUID}
              <br />
              {new Date(rawNotes[noteUUID].createdAt).toString()}
            </div>
          );
        })}
      </div>
    );
  }

  protected fetchAndProcessItems = async () => {
    try {
      const { client, user } = this.props;
      const response = await client.query<IGetItemsResponseData>({
        query: GET_ITEMS_QUERY,
        variables: {
          params: {
            username: user.username,
            limit: 28,
            // datetime: new Date().getTime(),
            // datetime: 0,
            datetime: new Date(), // above all work! just pass in the last createdAt time returned in the array
            sort: "createdAt",
            order: "DESC"
          }
        }
      });
      const { getItems } = response.data;
      this.setState({
        count: getItems.count
      });
      this.props.dispatch(addRawNotes(getItems.items));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to get items!");
      this.setState({ errors });
    }
  };
}

const GET_ITEMS_QUERY = gql`
  query GetItemsQuery(
    $params: ItemPaginationInput
    $childrenParams: ItemPaginationInput
  ) {
    getItems(params: $params) {
      count
      items {
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
  }
`;

interface IGetItemsResponseData {
  getItems: {
    count: number;
    items: Item[];
  };
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // WithAuth wrapper ensures user is defined
  rawNotes: state.notes.rawNotes, // y error
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  noteIDs: state.notes.noteIDs
});

export default connect(mapStateToProps)(withApollo(ListNotesController));
