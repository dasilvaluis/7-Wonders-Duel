
import { v4 as uuidv4 } from 'uuid';
import { ElementTypes } from './types';

export const keyBy = <ArrayT>(array: Array<ArrayT>, key: string) => 
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export const flattenDeep = <T>(array): Array<T> => Array.isArray(array)
  ? array.reduce((acc: Array<any>, curr) => acc.concat(flattenDeep(curr)) , [])
  : [ array ]

export const createElement = (card, type: ElementTypes) => ({
  type,
  id: uuidv4(),
  name: card.name,
  x: 0,
  y: 0,
  faceDown: false,
  imageFile: card.file || '',
  imageFileBackface:''
});
