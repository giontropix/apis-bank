import chai from "chai";
import request from "supertest";
import { app, listOfBanks, readFile, writeToFile } from "../main";

readFile();
const uri = `/banks/${listOfBanks[0].getId()}/accounts/`;

chai.should();

describe("ACCOUNTS", () => {
  describe("Show accounts", () => {
    it("Show all accounts", async () => {
      const { status, body } = await request(app)
        .get(uri)
        .set("Accept", "application/json");
      status.should.equal(200);
      body.should.have.lengthOf(listOfBanks[0].getAccounts().length);
    });
  
    it("Show single account", async () => {
      const { status, body: { id } } = await request(app)
        .get(uri + `${listOfBanks[0].getAccounts()[0].getId()}`)
        .set("Accept", "application/json");
      status.should.equal(200);
      id.should.equal(`${listOfBanks[0].getAccounts()[0].getId()}`);
    });
  
    it("Show single account with wrong id", async () => {
      const { status, body } = await request(app)
        .get(uri + `wrongID`)
        .set("Accept", "application/json");
      status.should.equal(404);
      body.should.have.property("error");
    });
  })
  
  describe("Create accounts", () => {
    after(() => listOfBanks[0].getAccounts().pop());
    after(() => writeToFile());

    it("Create new account", async () => {
      const length = listOfBanks[0].getAccounts().length;
      const name = "test";
      const { status, body } = await request(app).post(uri).set("Accept", "application/json").send({name, balance: 1000.00 });
      status.should.equal(201);
      body.should.have.property("message");
      listOfBanks[0].getAccounts().should.have.lengthOf(length + 1);
      listOfBanks[0].getAccounts()[listOfBanks[0].getAccounts().length - 1].getName().should.equal(name);
    });
  })
});
