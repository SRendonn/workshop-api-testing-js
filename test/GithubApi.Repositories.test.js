require('dotenv').config();

const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUsername = 'aperdomob';

describe('GitHub GET method test', () => {
  describe('Get user information', () => {
    it('Verifies the user information', async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUsername}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body.name).equal('Alejandro Perdomo');
      expect(response.body.company).equal('Perficient Latam');
      expect(response.body.location).equal('Colombia');
    });
  });

  describe('Get repo from user', async () => {
    const repoName = 'jasmine-awesome-report';

    it('gets the jasmine-awesome-report repo', async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUsername}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);

      const selectedRepo = response.body.find((repo) => repo.name === repoName);
      expect(selectedRepo.name).equal(repoName);
      expect(selectedRepo.private).to.equal(false);
      // selectedRepo.downloads_url
    });
  });
});
