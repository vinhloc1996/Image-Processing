import * as fs from 'fs';
import { SYSTEM_FULL_PATH, SYSTEM_THUMB_PATH } from '../constant';
import { Image } from '../models/Image';
import { OutputFormat } from '../models/Output';
import path from 'path';
import imageProcessing from '../processor';

describe('Test the image processor', () => {
  const filename = 'sample.jpg';

  const BUILT_FULL_PATH = path.resolve(
    __dirname,
    `../${SYSTEM_FULL_PATH}${filename}`
  );

  const BUILT_THUMB_PATH = path.resolve(
    __dirname,
    `../${SYSTEM_THUMB_PATH}sample-100-100.jpg`
  );

  const BUILT_SAMPLE_PATH = path.resolve(__dirname, `../../assets/${filename}`);

  beforeAll(() => {
    if (!fs.existsSync(BUILT_FULL_PATH)) {
      fs.copyFile(BUILT_SAMPLE_PATH, BUILT_FULL_PATH, () => {
        console.log('Setup sample file successfully');
      });
    }
  });

  it('imageProcessing should return success with correct thumb path', async () => {
    const sampleImage: Image = {
      filename: filename,
      height: 100,
      width: 100,
    };

    const expectedOutput: OutputFormat = {
      error: null,
      filePath: BUILT_THUMB_PATH,
      isSuccess: true,
    };

    const result = await imageProcessing(sampleImage);
    expect(result).toEqual(expectedOutput);
  });

  it('imageProcessing should return fail when incorrect filename', async () => {
    const sampleImage: Image = {
      filename: 'sample1.jpg',
      height: 100,
      width: 100,
    };

    const expectedOutput: OutputFormat = {
      error: `No image found with name sample1.jpg. Please upload the image first!`,
      filePath: null,
      isSuccess: false,
    };

    const result = imageProcessing(sampleImage);
    await expectAsync(result).toBeRejectedWith(expectedOutput);
  });

  it('imageProcessing should return fail when no filename provided', async () => {
    const sampleImage: Image = {
      filename: '',
      height: 100,
      width: 100,
    };

    const expectedOutput: OutputFormat = {
      error: `Please provide the image name`,
      filePath: null,
      isSuccess: false,
    };

    const result = imageProcessing(sampleImage);
    await expectAsync(result).toBeRejectedWith(expectedOutput);
  });

  it('imageProcessing should return fail when negative height and width are provided', async () => {
    const sampleImage: Image = {
      filename: 'sample.jpg',
      height: -100,
      width: -100,
    };

    const expectedOutput: OutputFormat = {
      error: `Please height and width must be a positive number`,
      filePath: null,
      isSuccess: false,
    };

    const result = imageProcessing(sampleImage);
    await expectAsync(result).toBeRejectedWith(expectedOutput);
  });

  afterAll(() => {
    if (fs.existsSync(BUILT_THUMB_PATH)) {
      fs.unlink(BUILT_THUMB_PATH, () => {
        console.log('Removed file from thumb folder');
      });

      fs.unlink(BUILT_FULL_PATH, () => {
        console.log('Removed file from full folder');
      });
    }
  });
});
