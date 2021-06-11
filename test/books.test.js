const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const sampleData = require('./sample.json');
chai.should();
chai.use(chaiHttp);

describe('Books query and mutation test', () => {
  describe('test getAllBooks query ', () => {
    it('should pass for valid credentials', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: '{getAllBooks{title}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.getAllBooks.should.be.a('Array');
          response.body.data.getAllBooks.should.have.lengthOf(1);
        });
      done();
    });

    it('should get 400 for invalid query', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: '{getBooks{title}}' })
        .end((error, response) => {
          response.should.have.status(400);
        });
      done();
    });

    it('should get success false for invalid token', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.books.invalidToken.token)
        .send({ query: '{getAllBooks{title}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.getAllBooks[0].title.should.have.equal('please login first');
        });
      done();
    });
  });
});
