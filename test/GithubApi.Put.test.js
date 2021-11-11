require('dotenv').config();
const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUsername = 'aperdomob';

describe('GitHub PUT method test', () => {
  it('should follow aperdomob user', async () => {
    const response = await agent
      .put(`${urlBase}/user/following/${githubUsername}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn')
      .set('Content-Length', '0');

    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });

  it('should check aperdomob is in following list', async () => {
    const response = await agent
      .get('https://api.github.com/user/following')
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.some((user) => user.login === 'aperdomob')).to.equal(
      true
    );
  });

  it('should check idempotency of PUT method', async () => {
    const idemRes = await agent
      .put(`${urlBase}/user/following/${githubUsername}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn')
      .set('Content-Length', '0');

    expect(idemRes.status).to.equal(StatusCodes.NO_CONTENT);

    const response = await agent
      .get('https://api.github.com/user/following')
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.some((user) => user.login === 'aperdomob')).to.equal(
      true
    );
  });
});
