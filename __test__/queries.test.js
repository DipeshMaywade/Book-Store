const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);

test("fetch users", (done) => {

  request
    .post("/BookStore")
    .send({
      query: "{ getUser {id, firstName} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) console.log(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.getUser.length).toEqual(3);
      done();
    });
});