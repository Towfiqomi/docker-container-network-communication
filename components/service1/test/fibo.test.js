/*  eslint linebreak-style: ["error", "windows"]  */
/* eslint-env es6 */
/*  eslint max-len: ["error", { "code": 280 }]*/


process.env.NODE_ENV = 'test';

const chai = require('chai');
const {expect} = chai;
const supertest = require('supertest');

const server = supertest.agent('http://localhost:8001');

describe('Checking the JSON returned finonacci series', () => {
  it('checking the returned value of fibo series when the payload value is zero', async () => {
    const res = await server
        .post('/fibo')
        .send({number: 0});
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.keys(['fibo']);
    expect(res.body.fibo).to.be.an('array');
    expect(res.body.fibo).to.have.deep.members([0]);
  });

  it('checking the returned value of fibo series when the payload value is one', async () => {
    const res = await server
        .post('/fibo')
        .send({number: 1});
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.keys(['fibo']);
    expect(res.body.fibo).to.be.an('array');
    expect(res.body.fibo).to.have.deep.members([0, 1]);
  });


  it('checking the returned value of fibo series when the payload value is five', async () => {
    const res = await server
        .post('/fibo')
        .send({number: 5});
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.keys(['fibo']);
    expect(res.body.fibo).to.be.an('array');
    expect(res.body.fibo).to.have.deep.members([0, 1, 1, 2, 3]);
  });

  it('checking the returned value of fibo series when the payload value is string', async () => {
    const res = await server
        .post('/fibo')
        .send({number: 'omi'});
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.keys(['error']);
    expect(res.body.error).to.equal('Error: not a number');
  });

  it('checking the returned value of fibo series when the payload value is a negative number', async () => {
    const res = await server
        .post('/fibo')
        .send({number: -5});
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.keys(['error']);
    expect(res.body.error).to.equal('Error: negative number');
  });
});
