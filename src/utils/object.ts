export const prefixKey = (
  param: string | Record<string, any>,
  prefix: string,
): unknown => {
  if (typeof param === 'string') {
    return `${prefix}${param[0].toUpperCase()}${param.slice(1)}`;
  } else if (typeof param === 'object') {
    const res = {};
    for (const key of Object.keys(param)) {
      const fieldname = `${prefix}${key[0].toUpperCase()}${key.slice(1)}`;
      res[fieldname] = param[key];
    }
    return res;
  }
};
