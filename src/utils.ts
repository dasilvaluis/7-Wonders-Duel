export const keyBy = <ArrayT>(array: Array<ArrayT>, key: string) => 
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export const flattenDeep = <T>(array): Array<T> => Array.isArray(array)
  ? array.reduce((acc: Array<any>, curr) => acc.concat(flattenDeep(curr)) , [])
  : [ array ]
