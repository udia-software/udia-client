export const nodeActions = {
  SET_FORM_CONTENT: "SET_FORM_CONTENT",
  SET_FORM_TITLE: "SET_FORM_TITLE",

  setFormContent: content => ({
    type: nodeActions.SET_FORM_CONTENT,
    payload: content
  }),
  setFormTitle: title => ({
    type: nodeActions.SET_FORM_TITLE,
    payload: title
  })
};
