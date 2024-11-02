import fs from 'fs';
import path, { extname } from 'path';
import moment from 'moment';

export const readFile = (fileName) => {
  return fs.readFileSync(
    path.join(__dirname, '..', 'assets', 'data', fileName),
    { encoding: 'utf8' },
  );
};

export const formatFileNameWithTimeStamp = (fileName) => {
  const name = fileName.split('.')[0];
  const fileExtName = extname(fileName);
  const timeStamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  return `${name}-${timeStamp}${fileExtName}`;
};
