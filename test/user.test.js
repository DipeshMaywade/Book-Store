const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const sampleData = require('./sample.json');

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
          response.body.data.getUser.should.be.a('Array');
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

  describe('test loginUser mutation', () => {
    it('should return success message true for valid login data', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{loginUser(email:"dipeshmaywade@gmail.com" password:"Deep@123"){success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.loginUser.success.should.have.equal('true');
        });
      done();
    });

    it('should get 200 response for valid query', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{loginUser(email:"dipeshmaywade@gmail.com" password:"Deep@123"){success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
        });
      done();
    });

    it('should get 400 response for invalid query', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{oginUser(email:"dipeshmaywad@gmail.com" password:"Deep@123"){success message }}' })
        .end((error, response) => {
          response.should.have.status(400);
        });
      done();
    });

    it('should get false success for invalid email', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{loginUser(email:"ipeshmaywade@gmail.com" password:"Deep@123"){success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.loginUser.message.should.have.equal('incorrect email, user not Found');
          response.body.data.loginUser.success.should.have.equal('false');
        });
      done();
    });

    it('should get false success for invalid password', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{loginUser(email:"dipeshmaywade@gmail.com" password:"Heep@123"){success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.loginUser.message.should.have.equal('incorrect password.');
          response.body.data.loginUser.success.should.have.equal('false');
        });
      done();
    });
  });

  describe('test forgotPassword mutation ', () => {
    it('should get success true for valid email for forgotPassword', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{ forgotPassword(email:"dipeshmaywade@gmail.com"){ success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.forgotPassword.success.should.have.equal('true');
        });
      done();
    });

    it('should get success false invalid email address for forgotPassword', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .send({ query: 'mutation{ forgotPassword(email:"ipeshmaywade@gmail.com"){ success message }}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.forgotPassword.success.should.have.equal('false');
        });
      done();
    });
  });

  describe('test resetPassword mutation ', () => {
    it('should get success true for valid token for resetPassword', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.user.validToken.token)
        .send({ query: 'mutation{resetPassword(newPassword:"Deep@123" confirmPassword:"Deep@123"){success message}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.resetPassword.success.should.have.equal('true');
          response.body.data.resetPassword.message.should.have.equal('password updated.');
        });
      done();
    });

    it('should get success false invalid token for resetPassword', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.user.invalidToken.token)
        .send({ query: 'mutation{resetPassword(newPassword:"Deep@123" confirmPassword:"Deep@123"){success message}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.resetPassword.success.should.have.equal('false');
          response.body.data.resetPassword.message.should.have.equal('invalid token');
        });
      done();
    });

    it('should get success false if new and confirm password does not matched', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.user.validToken.token)
        .send({ query: 'mutation{resetPassword(newPassword:"Deep@123" confirmPassword:"eep@123"){success message}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.resetPassword.success.should.have.equal('false');
          response.body.data.resetPassword.message.should.have.equal('password does not matched or invalid formate');
        });
      done();
    });

    it('should get success false if validation failed', (done) => {
      chai
        .request(server)
        .post('/BookStore')
        .set('authorization', sampleData.user.validToken.token)
        .send({ query: 'mutation{resetPassword(newPassword:"Deep123" confirmPassword:"Deep123"){success message}}' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('Object');
          response.body.data.resetPassword.success.should.have.equal('false');
          response.body.data.resetPassword.message.should.have.equal('password does not matched or invalid formate');
        });
      done();
    });
  });
});
