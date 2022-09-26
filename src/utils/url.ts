export const removeDoubleSlash = (string: string): string => {
  return string.replace(/(https?:\/\/)|(\/)+/g, '$1$2');
};
