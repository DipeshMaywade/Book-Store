const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.should();
chai.use(chaiHttp);

describe('user query and mutation test', () => {
  describe('test getUser query ', () => {
    it('should pass if length of get user is 2', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: '{getUser{firstName lastName role id }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.getUser.should.have.lengthOf(2);
        });
      done();
    });

    it('should get 400 response for invalid query', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: '{getUser{firstName astName role id }}' })
        .end((error, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });

  describe('test addUser mutation', () => {
    it('Should get success ture for valid data', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({
          query:
            'mutation{addUser(firstName:"Dipesh" lastName:"Maywade" email:"dipesh111@gmail.com" password:"Deep@123" role:Admin){ success message } }',
        })
        .end((error, response) => {
          if (error) done(error);
          response.should.have.status(200);
          response.body.data.addUser.message.should.have.equal('new user added successfully...!!');
        });
      done();
    });

    it('Should get success false for invalid name', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({
          query:
            'mutation{addUser(firstName:"rohit" lastName:"Maywade" email:"rohit111@gmail.com" password:"Deep@123" role:Admin){ success message } }',
        })
        .end((error, response) => {
          if (error) done(error);
          response.should.have.status(200);
          response.body.data.addUser.success.should.have.equal('false');
        });
      done();
    });

    it('Should get success false for duplicate email address', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({
          query:
            'mutation{addUser(firstName:"Rahul" lastName:"Maywade" email:"dipeshmaywade@gmail.com" password:"Deep@123" role:Admin){ success message } }',
        })
        .end((error, response) => {
          if (error) done(error);
          response.should.have.status(200);
          response.body.data.addUser.success.should.have.equal('false');
        });
      done();
    });

    it('Should get 400 response for invalid query', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({
          query:
            'mutation{addUser(irstName:"Rahul" lastName:"Maywade" email:"dipeshmaywade@gmail.com" password:"Deep@123" role:Admin){ success message } }',
        })
        .end((error, response) => {
          if (error) done(error);
          response.should.have.status(400);
        });
      done();
    });
  });
});
