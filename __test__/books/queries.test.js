const { app, serverInstance } = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const { MongoDBAdapter } = require('../../config/dbConfig');
const { getMaxListeners } = require('../../src/utility/logger');

afterAll((done) => {
  serverInstance.close();
  let db = new MongoDBAdapter(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  db.disconnect();
  done();
});

test('fetch all users', (done) => {
  request
    .post('/BookStore')
    .send({
      query: '{ getUser {id, firstName} }',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) console.log(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.getUser.length).toEqual(3);
      done();
    });
});
