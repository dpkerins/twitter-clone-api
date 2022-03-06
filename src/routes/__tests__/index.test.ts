import app from "../../app";
const request = require('supertest');

test("getting peeps", (done) => {
  request(app)
    .get("/")
    .expect("This is a different message.")
    .expect(200, done);
});

test("getting peeps", done  => {
  request(app)
    .get("/tweets/")
    .expect(200, done);
});

// test("adding peeps", done => {
//   request(app)
//     .post("/tweets/")
//     .send({userId: 1, content: "This is content!"})
//     .set('Accept', 'application/json')
//     .expect(200,
//       { authorId: 1, content: "This is content!" },
//       done);
// });

test("adding peeps", async () => {
  const response = await request(app)
    .get('/tweets/')
  const peeps = response.body;
  expect(peeps[peeps.length - 1].content).toEqual("This is content!");
});