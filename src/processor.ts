import sharp from 'sharp';
import * as fs from 'fs';
import { SYSTEM_FULL_PATH, SYSTEM_THUMB_PATH } from './constant';
import { Image } from './models/Image';
import { File } from './models/File';
import { OutputFormat } from './models/Output';
import path from 'path';

const imageProcessing = async (image: Image): Promise<OutputFormat> => {
  const { filename, height, width } = image;
  const result: OutputFormat = {
    isSuccess: false,
    error: null,
    filePath: null,
  };

  //validate input data
  if (!filename) {
    result.error = 'Please provide the image name';
    return new Promise<OutputFormat>((res, rej) => rej(result));
  }
  if (isNaN(height) || isNaN(width) || height < 0 || width < 0) {
    result.error = 'Please height and width must be a positive number';
    return new Promise((res, rej) => rej(result));
  }

  const pathInfo: path.ParsedPath = path.parse(filename);
  const file: File = {
    ext: pathInfo.ext,
    name: pathInfo.name,
  };

  //built filename with height and width
  const BUILT_FILE_NAME = `${file.name}-${height}-${width}${file.ext}`;

  //built path with file
  const BUILT_FULL_PATH = path.resolve(
    __dirname,
    `${SYSTEM_FULL_PATH}${filename}`
  );
  const BUILT_THUMB_PATH = path.resolve(
    __dirname,
    `${SYSTEM_THUMB_PATH}${BUILT_FILE_NAME}`
  );
  //checking the file was existed on system before
  //I suppose this is the caching you asked
  if (fs.existsSync(`${BUILT_THUMB_PATH}`)) {
    result.isSuccess = true;
    result.filePath = `${BUILT_THUMB_PATH}`;
    return new Promise((res) => res(result));
  } else {
    //incase it's a new file, check if it's existed in full folder
    if (fs.existsSync(`${BUILT_FULL_PATH}`)) {
      return await sharp(`${BUILT_FULL_PATH}`)
        .resize(width, height)
        .toFile(`${BUILT_THUMB_PATH}`)
        .then(() => {
          result.isSuccess = true;
          result.filePath = `${BUILT_THUMB_PATH}`;
          return result;
        })
        .catch((error: Error) => {
          console.error('Processing file error', error);
          result.error = `There was an error ${error.name} while processing the file. Please try again after a few minutes`;
          return result;
        });
    } else {
      result.error = `No image found with name ${filename}. Please upload the image first!`;
      return new Promise((res, rej) => rej(result));
    }
  }
};

export default imageProcessing;
