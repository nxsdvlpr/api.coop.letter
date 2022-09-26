export const mergeArrayByKey = (arr1 = [], arr2 = [], key = 'id') => {
  let res = [];
  res = arr1.map((obj) => {
    const index = arr2.findIndex((el) => el[key] == obj[key]);
    return {
      ...obj,
      ...arr2[index],
    };
  });
  return res;
};

export const parseIdsToInt = (obj, fields = []) => {
  if (obj instanceof Array) {
    obj.map((el) => parseIdsToInt(el, fields));
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      parseIdsToInt(obj[key], fields);
      if (obj[key] instanceof Array) {
        parseIdsToInt(obj[key], fields);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        parseIdsToInt(obj[key], fields);
      } else {
        if (fields.includes(key)) {
          obj[key] = +obj[key];
        }
      }
    }
  }
};
