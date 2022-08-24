import * as fs from 'fs';
import { SYSTEM_FULL_PATH, SYSTEM_THUMB_PATH } from '../constant';
import path from 'path';
import { app } from '../index';
import request from 'supertest';

describe('GET request to /api/images', function () {
  const filename = 'sample.jpg';

  const BUILT_FULL_PATH = path.resolve(
    __dirname,
    `../${SYSTEM_FULL_PATH}${filename}`
  );

  const BUILT_THUMB_PATH = path.resolve(
    __dirname,
    `../${SYSTEM_THUMB_PATH}${filename}`
  );

  const BUILT_SAMPLE_PATH = path.resolve(__dirname, `../../assets/${filename}`);

  beforeAll(() => {
    if (!fs.existsSync(BUILT_FULL_PATH)) {
      fs.copyFile(BUILT_SAMPLE_PATH, BUILT_THUMB_PATH, () => {
        console.log('Setup sample file successfully');
      });
    }
  });

  it('request with no query string', async () => {
    const result = await request(app).get('/api/images');
    expect(result.text).toEqual('Please provide the image name');
    expect(result.status).toEqual(200);
  });

  it('request with full querystring', async () => {
    const result = await request(app).get(
      '/api/images?filename=sample.jpg&width=100&height=100'
    );
    expect(result.type).toEqual('image/jpeg');
    expect(result.status).toEqual(200);
  });

  it('the request with incorrect filename/no filename found in server', async () => {
    const result = await request(app).get(
      '/api/images?filename=sample1.jpg&width=100&height=100'
    );
    expect(result.text).toEqual(
      'No image found with name sample1.jpg. Please upload the image first!'
    );
    expect(result.status).toEqual(200);
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
