require('dotenv').config();
const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUsername = 'SRendonn';

describe('Github Api Issue test', () => {
  describe('From logged in user', () => {
    it('should verify they have at least one public repo', async () => {
      const response = await agent
        .get(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn');

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.public_repos).to.be.greaterThanOrEqual(1);
    });

    describe('Uses selected repo to create an issue', () => {
      const repoName = 'workshop-api-testing-js';
      let selectedRepo;
      it('should check repo exists', async () => {
        const response = await agent
          .get(`${urlBase}/user/repos`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn');

        expect(response.status).to.equal(StatusCodes.OK);
        selectedRepo = response.body.find((repo) => repo.name === repoName);
        expect(selectedRepo).to.not.equal(undefined);
      });

      it('should create an issue', async () => {
        const title = `API Test@${new Date().toISOString()}`;
        const response = await agent
          .post(
            `https://api.github.com/repos/${githubUsername}/${repoName}/issues`
          )
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn')
          .send({
            title
          });

        expect(response.status).to.equal(StatusCodes.CREATED);
        expect(response.body.title).to.equal(title);
        expect(response.body.description).to.equal(null);
        describe('then change the issue body', () => {
          const issueNumber = response.body.number;
          it('should change the issue body, the title remains the same', async () => {
            const body = `This body was set @ ${new Date().toUTCString()}`;
            const patchRes = await agent
              .patch(
                `${urlBase}/repos/${githubUsername}/${repoName}/issues/${issueNumber}`
              )
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'SRendonn')
              .send({
                body
              });
            expect(patchRes.status).to.equal(StatusCodes.OK);
            expect(patchRes.body.title).to.equal(title);
            expect(patchRes.body.body).to.equal(body);
          });
        });
      });
    });
  });
});
