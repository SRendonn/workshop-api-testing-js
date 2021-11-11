require('dotenv').config();
const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Github Query Params test', () => {
  it('should fetch user list with default length 30', async () => {
    const response = await agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.length).to.equal(30);
  });

  it('should fetch user list with a limit of 10', async () => {
    const response = await agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn')
      .query({
        per_page: 10
      });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.length).to.equal(10);
  });

  it('should fetch user list with a limit of 50', async () => {
    const response = await agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'SRendonn')
      .query({
        per_page: 50
      });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.body.length).to.equal(50);
  });
});
