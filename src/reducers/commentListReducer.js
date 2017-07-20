const initialState = {
  root_page_number: 0,
  root_page_size: 10,
  root_total_entries: 0,
  root_total_comments: 0,
  root_comments: [],
  child_comment_data: {}
}

function commentListReducer(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}

export default commentListReducer;
