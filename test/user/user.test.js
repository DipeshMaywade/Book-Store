const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const sample = require('./samples');

chai.should();
chai.use(chaiHttp);

describe('user query and mutation test', () => {
  describe('test getUser query ', () => {
    it('should pass if length of get user is 3', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: '{getUser{firstName lastName role id }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.getUser.should.have.lengthOf(3);
        });
      done();
    });
  });
});
