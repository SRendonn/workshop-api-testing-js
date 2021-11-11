require('dotenv').config();
const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://github.com';
const githubUsername = 'aperdomob';

describe('Github Api Redirect test', () => {
  const expectedRedirect = 'https://github.com/aperdomob/new-redirect-test';
  it('should check for redirect with HEAD', async () => {
    try {
      await agent
        .head(`${urlBase}/${githubUsername}/redirect-test`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');
    } catch (error) {
      expect(error.response.status).to.equal(StatusCodes.MOVED_PERMANENTLY);
      expect(error.response.headers.location).to.equal(expectedRedirect);
    }
  });

  it('should check for redirect with GET', async () => {
    try {
      await agent
        .get(`${urlBase}/${githubUsername}/redirect-test`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');
    } catch (error) {
      expect(error.response.status).to.equal(StatusCodes.MOVED_PERMANENTLY);
      expect(error.response.url).to.equal(expectedRedirect);
    }
  });
});
