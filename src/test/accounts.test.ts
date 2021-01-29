import chai from "chai";
import request from "supertest";
import { app, listOfAccount } from "../main";
const uri = "/users/accounts";

chai.should();

describe("Accounts", () => {
  it("Show all accounts", async () => {
    const { status, body } = await request(app)
      .get(uri)
      .set("Accept", "application/json");
    status.should.equal(200);
    body.should.have.lengthOf(listOfAccount.length);
  });
  it("Show single account", async () => {
    const {
      status,
      body: { id },
    } = await request(app)
      .get(uri + `/${listOfAccount[listOfAccount.length - 1].getId()}`)
      .set("Accept", "application/json");
    status.should.equal(200);
    id.should.equal(listOfAccount[listOfAccount.length - 1].getId());
  });
  it("Show single account with wrong id", async () => {
    const { status, body } = await request(app)
      .get(uri + `/wrongID`)
      .set("Accept", "application/json");
    status.should.equal(404);
    body.should.have.property("error");
  });
  it("Create new account", async () => {
    const length = listOfAccount.length;
    const name = "test";
    const { status, body } = await request(app)
      .post(uri)
      .set("Accept", "application/json")
      .send({ name, budget: 1000 });
    status.should.equal(201);
    body.should.have.property("message");
    listOfAccount.should.have.lengthOf(length + 1);
    listOfAccount[listOfAccount.length - 1].getName().should.equal(name);
  });
});
