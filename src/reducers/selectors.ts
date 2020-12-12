import { AppState } from './reducers';
import { ElementTypes, ElementsMap } from '../types';

export const getElements = (state: AppState, type?: ElementTypes) => type
  ? Object.values(state.elements).filter((el) => el.type === type)
  : Object.values(state.elements);

export const getElement = (state: AppState, id: string) =>
  Object.values(state.elements).filter((el) => el.id === id);

export const getSelectedElements = (state: AppState) => 
  state.selectedElements.reduce((selectedElements: ElementsMap, id: string) => {
    if (typeof state.elements[id] !== 'undefined') {
      selectedElements[id] = state.elements[id];
    }

    return selectedElements;
  }, {});

export const getSelectedElementsIds = (state: AppState) => state.selectedElements;
