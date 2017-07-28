import {
  SET_PRESENCE_STATE,
  HANDLE_PRESENCE_DIFF,
  CLEAR_PRESENCE_STATE
} from "./constants";

const initialState = {
  presence: {}
};

function presenceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRESENCE_STATE:
      return {
        ...state,
        presence: action.data
      };
    case HANDLE_PRESENCE_DIFF:
      // barf, what uggo code
      const { leaves, joins } = action.data;
      let presence = { ...state.presence };

      // handle all users that joined the page
      const usersJoined = Object.keys(joins);
      for (let user_i = 0; user_i < usersJoined.length; user_i++) {
        let username = usersJoined[user_i];
        if (username in presence) {
          for (let meta_i = 0; meta_i < joins[username].metas.length; meta_i++) {
            let meta = joins[username].metas[meta_i];
            presence[username].metas.push(meta);
          }
        } else {
          presence[username] = joins[username];
        }
      }

      // handle all users the left the page
      const usersLeft = Object.keys(leaves);
      for (let user_i = 0; user_i < usersLeft.length; user_i++) {
        let username = usersLeft[user_i];
        if (username in presence) {
          for (let meta in leaves[username].metas) {
            const { phx_ref } = meta;
            for (
              let meta_i = 0;
              meta_i < presence[username].metas.length;
              meta_i++
            ) {
              const { p_phx_ref } = presence[username].metas[meta_i];
              if (phx_ref === p_phx_ref) {
                presence[username].metas.splice(meta_i, 1);
                break;
              }
            }
          }
          if (presence[username].metas.length === 0) {
            delete presence[username];
          }
        }
      }

      // return the state
      return {
        ...state,
        presence
      };
    case CLEAR_PRESENCE_STATE:
      return initialState;
    default:
      return state;
  }
}

export default presenceReducer;
