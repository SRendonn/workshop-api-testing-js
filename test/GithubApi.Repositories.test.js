require('dotenv').config();
const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const crypto = require('crypto');

const urlBase = 'https://api.github.com';
const githubUsername = 'aperdomob';
const repoName = 'jasmine-awesome-report';

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
    let selectedRepo;

    it('gets the jasmine-awesome-report repo', async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUsername}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      selectedRepo = response.body.find((repo) => repo.name === repoName);
      expect(selectedRepo.name).equal(repoName);
      expect(selectedRepo.private).to.equal(false);
    });

    describe('Check downloaded repo', () => {
      const repoMD5 = 'df39e5cda0f48ae13a5c5fe432d2aefa';
      it('downloads zip file and checks its MD5', async () => {
        const response = await agent
          .get(
            selectedRepo.archive_url.replace(
              '{archive_format}{/ref}',
              'zipball'
            )
          )
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn');

        expect(response.status).to.equal(statusCode.StatusCodes.OK);
        expect(
          crypto.createHash('MD5').update(response.body).digest('hex')
        ).to.equal(repoMD5);
      });

      it('Check README', async () => {
        const readmeSHA = '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484';
        const readmeMD5 = '97ee7616a991aa6535f24053957596b1';
        const response = await agent
          .get(selectedRepo.contents_url.replace('{+path}', 'README.md'))
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn');
        const readmeFile = await agent.get(response.body.download_url);
        expect(response.status).to.equal(statusCode.StatusCodes.OK);
        expect(response.body.name).to.equal('README.md');
        expect(response.body.path).to.equal('README.md');
        expect(response.body.sha).to.equal(readmeSHA);
        expect(
          crypto.createHash('MD5').update(readmeFile.text).digest('hex')
        ).to.equal(readmeMD5);
      });
    });
  });
});
