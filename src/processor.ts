import sharp, { OutputInfo } from 'sharp';
import * as fs from 'fs';
import { SYSTEM_FULL_PATH, SYSTEM_THUMB_PATH } from './constant';
import { Image } from './models/Image';
import { OutputFormat } from './models/Output';

const imageProcessing = (image: Image): OutputFormat => {
  const { filename, height, width } = image;
  const result: OutputFormat = {
    isSuccess: false,
    error: null,
    filePath: null,
  };

  //validate input data
  if (filename) {
    result.error = 'Please provide the image name';
    console.log(result)
    return result;
  }
  if (isNaN(height) || isNaN(width) || height < 0 || width < 0) {
    result.error = 'Please height and width must be a positive number';
    console.log(result)
    return result;
  }

  //checking the file was existed on system before
  if (fs.existsSync(`${SYSTEM_THUMB_PATH}${filename}`)) {
    result.isSuccess = true;
    result.filePath = `${SYSTEM_THUMB_PATH}${filename}`;
  } else {
    //incase it's a new file, check if it's existed in full folder
    if (fs.existsSync(`${SYSTEM_FULL_PATH}${filename}`)) {
      sharp(`${SYSTEM_FULL_PATH}${filename}`)
        .resize(width, height)
        .toFile(`${SYSTEM_THUMB_PATH}${filename}`)
        .then((info: OutputInfo) => {
          result.isSuccess = true;
          result.filePath = `${SYSTEM_THUMB_PATH}${filename}`;
        })
        .catch((error: Error) => {
          console.error('Processing file error', error);
          result.error = `There was an error ${error.name} while processing the file. Please try again after a few minutes`;
        });
    } else {
      result.error = `No image found with name ${filename}. Please upload the image first!`;
    }
  }
  console.log(result)
  return result;
};

export default imageProcessing;
