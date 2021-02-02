import chai from "chai";
import request from "supertest";
import { Transaction } from "../Transaction";
import { app, listOfBanks, readFile, writeToFile } from "../main";

readFile();
const uri = `/finances/banks/${listOfBanks[0].getId()}/transactions/`;
chai.should();

describe("TRANSACTIONS", () => {
  describe("Show transactions", () => {
  
  before(() => listOfBanks[0].getTransactions().push(
      new Transaction("testid", "debitorBankTest", "debitorNameTest", "creditorBankTest", "creditorNameTest", "descriptionTest", 1000)
      )
  );
  before(() => listOfBanks[1].getTransactions().push(
    new Transaction("testid", "debitorBankTest", "debitorNameTest", "creditorBankTest", "creditorNameTest", "descriptionTest", -1000)
    )
  );
  before(() => writeToFile());

  after(() => listOfBanks[0].getTransactions().pop());
  after(() => listOfBanks[1].getTransactions().pop());
  after(() => writeToFile());
  
  it("Show all transaction", async () => {
    const { status, body } = await request(app).get(uri).set("Accept", "application/json");
    status.should.equal(200);
    body.should.have.lengthOf(listOfBanks[0].getTransactions().length);
  });

  it("Show single transaction", async () => {
    const { status, body: { id } } = await request(app).get(uri + `testid`).set("Accept", "application/json");
    status.should.equal(200);
    id.should.equal(listOfBanks[0].getTransactions()[listOfBanks[0].getTransactions().length - 1].getId());
  });

  it("Show single transaction with wrong id", async () => {
    const { status, body } = await request(app).get(uri + `wrongID`).set("Accept", "application/json");
    status.should.equal(404);
    body.should.have.property("error");
  });
  })
  
  describe("Create transactions", () => {

    after(() => listOfBanks[0].getTransactions().pop());
    after(() => listOfBanks[1].getTransactions().pop());
    after(() => writeToFile());

    it("Do a transaction", async () => {
      const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({
        debitor_id: "pippo",
        creditor_id: "saro",
        creditor_bank_id: "fin",
        description: "test",
        amount: 1
    });
      status.should.equal(201);
      body.should.have.property("transaction");
    });
  
    it("Do a transaction with credit wrong id", async () => {
      const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({
        debitor_id: "pippo",
        creditor_id: "wrong",
        creditor_bank_id: "fin",
        description: "test",
        amount: 1
    });
      status.should.equal(404);
      body.should.have.property("error");
    });
  
    it("Do a transaction with debit wrong id", async () => {
      const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({
        debitor_id: "wrong",
        creditor_id: "saro",
        creditor_bank_id: "fin",
        description: "test",
        amount: 1
    });
      status.should.equal(404);
      body.should.have.property("error");
    });
  
    it("Do a transaction without sufficient money", async () => {
      const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({
        debitor_id: "pippo",
        creditor_id: "saro",
        creditor_bank_id: "fin",
        description: "test",
        amount: 100000000
    });
      status.should.equal(401);
      body.should.have.property("error");
    });
  })
});
