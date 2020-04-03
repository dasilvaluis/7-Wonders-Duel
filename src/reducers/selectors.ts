import { AppState } from './reducers';
import { ElementTypes, ElementsMap } from '../types';

export const getElements = (state: AppState, type?: ElementTypes) =>
  type ? Object.values(state.elements).filter((el) => el.type === type) : Object.values(state.elements);

export const getElementOfType = (state: AppState, type: ElementTypes) => {
  const elements = getElements(state, type);

  return elements.length > 0 ? elements[0] : null;
};

export const getElement = (state: AppState, id: string) =>
  Object.values(state.elements).filter((el) => el.id === id);
