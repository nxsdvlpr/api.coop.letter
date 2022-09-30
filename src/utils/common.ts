import { dirname } from 'path';
import { createWriteStream, mkdirSync } from 'fs';
import axios from 'axios';

// Get value based on env (def: letterion)
export const enval = (dev: any, prod: any): any => {
  let value = prod;
  if (process.env.APP_ENV === 'local') {
    value = dev;
  }

  return value;
};

// Run function only on dev
export const devRun = (fn): void => {
  if (process.env.APP_ENV === 'local') {
    fn();
  }
};

export const leadingZero = (num, totalLength) =>
  String(num).padStart(totalLength, '0');

export const romanize = (num) => {
  if (!+num) {
    return false;
  }
  const digits = String(+num).split('');
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
  ];
  let roman = '';
  let i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
  return Array(+digits.join('') + 1).join('M') + roman;
};

export const downloadFile = async (
  sourceUrl: string,
  filepath: string,
): Promise<any> => {
  const directory = dirname(filepath);

  mkdirSync(directory, { recursive: true });

  const writer = createWriteStream(filepath);

  return axios({
    method: 'get',
    url: sourceUrl,
    responseType: 'stream',
  }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(filepath);
        }
      });
    });
  });
};
