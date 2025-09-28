import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    snippets: {},
  },
  reducers: {
    saveSnippet: (state, { payload }) => {
      const { userId, problemNumber, language, code } = payload;
      if (!userId) return; 
      state.snippets[userId] = state.snippets[userId] || {};
      
      state.snippets[userId][problemNumber] =
        state.snippets[userId][problemNumber] || {};
      state.snippets[userId][problemNumber][language] = {
        code,
        savedAt: Date.now(),
      };
    },
  },
});

export const { saveSnippet } = editorSlice.actions;
export default editorSlice.reducer;
