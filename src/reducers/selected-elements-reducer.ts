import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

const selectedElementsSlice = createSlice({
  name: 'selectedElements',
  initialState,
  reducers: {
    selectElement: (state, action: PayloadAction<{ id: string; selected: boolean }>) => {
      const filtered = state.filter((el) => el !== action.payload.id);
      return action.payload.selected ? [...filtered, action.payload.id] : filtered;
    },
    unselectElements: () => {
      return initialState;
    },
  },
});

export const selectedElementsActions = selectedElementsSlice.actions;

export default selectedElementsSlice.reducer;
