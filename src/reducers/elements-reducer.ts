import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Coordinates, ElementsMap, GameElement } from '../types';
import { keyBy, moveElementBackward, reverse } from '../utils/utils';

const initialState: ElementsMap = {};

const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    setElements: (_state, action: PayloadAction<GameElement[]>) => {
      return keyBy(action.payload, 'id');
    },
    addElements: (state, action: PayloadAction<GameElement[]>) => {
      return { ...state, ...keyBy(action.payload, 'id') };
    },
    setElementPosition: (state, action: PayloadAction<{ id: string; position: Coordinates }>) => {
      const { id, position } = action.payload;
      if (state[id]) {
        state[id].x = position.x;
        state[id].y = position.y;
      }
    },
    moveElement: (state, action: PayloadAction<{ id: string; delta: Coordinates }>) => {
      const { id, delta } = action.payload;
      if (state[id]) {
        state[id].x += delta.x;
        state[id].y += delta.y;
      }
    },
    flipElement: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state[id]) {
        state[id].faceDown = !state[id].faceDown;
      }
    },
    bringElement: (state, action: PayloadAction<{ id: string; direction: string }>) => {
      const { id, direction } = action.payload;
      if (state[id]) {
        const stateValues = Object.values(state);
        const sameTypeElements = stateValues.filter((el) => el.type === state[id].type);
        const differentTypeElements = stateValues.filter((el) => el.type !== state[id].type);
        let shiftedState = [...stateValues];

        switch (direction) {
          case 'forward':
          case 'backward': {
            const shiftedTypeElements =
              direction === 'forward'
                ? reverse(moveElementBackward(reverse(sameTypeElements), (el) => el.id === id))
                : moveElementBackward(sameTypeElements, (el) => el.id === id);

            shiftedState = [...differentTypeElements, ...shiftedTypeElements];
            break;
          }
          case 'front':
          case 'back': {
            const differentIdElements = sameTypeElements.filter((el) => el.id !== id);

            const shiftedTypeElements =
              direction === 'front'
                ? [...differentIdElements, state[id]]
                : [state[id], ...differentIdElements];

            shiftedState = [...differentTypeElements, ...shiftedTypeElements];
            break;
          }
        }

        return keyBy(shiftedState, 'id');
      }
    },
  },
});

export const elementsActions = elementsSlice.actions;

export default elementsSlice.reducer;
