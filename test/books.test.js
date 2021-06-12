const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const sampleData = require('./sample.json');
chai.should();
chai.use(chaiHttp);

describe('Books query and mutation test', () => {
  describe('test getAllBooks query ', () => {
    it('should pass for valid credentials for getAllBooks', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: '{getAllBooks{title}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.getAllBooks.should.be.a('Array');
          response.body.data.getAllBooks.should.have.lengthOf(2);
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

  describe('test addBook mutation ', () => {
    it('should pass for valid credentials for addBook', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.addBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.addBook.success.should.have.equal('true');
        });
      done();
    });

    it('should get login error for invalid token', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.invalidToken.token)
        .send({ query: sampleData.books.addBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.addBook.success.should.have.equal('false');
          response.body.data.addBook.message.should.have.equal('please log in first');
        });
      done();
    });

    it('should get login error if user login from user id', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.userValidToken.token)
        .send({ query: sampleData.books.addBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.addBook.success.should.have.equal('false');
          response.body.data.addBook.message.should.have.equal('only admin has ability to update book details please login as an admin');
        });
      done();
    });

    it('should response success false if validation failed', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.addBook.inValidData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.addBook.success.should.have.equal('false');
          response.body.data.addBook.message.should.have.equal('Validation failed');
        });
      done();
    });

    it('should get 400 response for invalid query', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.addBook.inValidQuery })
        .end((error, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });

  describe('test updateBook mutation ', () => {
    it('should pass for valid credentials for updateBook', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.updateBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.updateBook.success.should.have.equal('true');
        });
      done();
    });

    it('should get 400 response for invalid credentials for updateBook', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.updateBook.invalidQuery })
        .end((error, response) => {
          response.should.have.status(400);
        });
      done();
    });

    it('should get login error for invalid token', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.invalidToken.token)
        .send({ query: sampleData.books.updateBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.updateBook.success.should.have.equal('false');
          response.body.data.updateBook.message.should.have.equal('please log in first');
        });
      done();
    });

    it('should response success false if validation failed', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.validToken.token)
        .send({ query: sampleData.books.updateBook.invalidData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.updateBook.success.should.have.equal('false');
          response.body.data.updateBook.message.should.have.equal('Validation failed');
        });
      done();
    });

    it('should get login error if user login from user id', (done) => {
      chai
        .request(server)
        .post('/BookStore/')
        .set('authorization', sampleData.books.userValidToken.token)
        .send({ query: sampleData.books.updateBook.validData })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.updateBook.success.should.have.equal('false');
          response.body.data.updateBook.message.should.have.equal('only admin has ability to update book details please login as an admin');
        });
      done();
    });
  });
});
