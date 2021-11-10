const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const expect = chai.expect;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York',
    };

    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/get');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.header['content-type']).to.eql('application/json');
  });

  it('Consume PATCH Service', async () => {
    const query = {
      name: 'Sebastian',
      age: '21',
      city: 'Medellin',
    };

    const response = await agent
      .patch('https://httpbin.org/patch')
      .query(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume PUT Service', async () => {
    const response = await agent.put('https://httpbin.org/anything');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.method).to.eql('PUT');
  });

  it('Consume DELETE Service', async () => {
    const param = 1;
    const response = await agent.delete(
      `https://httpbin.org/anything/${param}`
    );

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.method).to.eql('DELETE');
  });
});
