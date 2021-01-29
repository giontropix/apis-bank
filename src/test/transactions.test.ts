import chai from "chai";
import request from "supertest";
import { Transaction } from "../Transaction";
import { app, listOfTransactions } from "../main";

const uri = "/transactions";
chai.should();

describe("Transactions", () => {
  before(() =>
    listOfTransactions.push(
      new Transaction("testID", "testCredit", "testDebit", 1000)
    )
  );
  after(()=> listOfTransactions.length = 0);
  
  it("Show all transaction", async () => {
    const { status, body } = await request(app).get(uri).set("Accept", "application/json");
    status.should.equal(200);
    body.should.have.lengthOf(listOfTransactions.length);
  });
  it("Show single transaction", async () => {
    const { status, body: { id } } = await request(app).get(uri + `/${listOfTransactions[listOfTransactions.length - 1].getId()}`).set("Accept", "application/json");
    status.should.equal(200);
    id.should.equal(listOfTransactions[listOfTransactions.length - 1].getId());
  });
  it("Show single transaction with wrong id", async () => {
    const { status, body } = await request(app).get(uri + `/wrongID`).set("Accept", "application/json");
    status.should.equal(404);
    body.should.have.property("error");
  });
  it("Do a transaction", async () => {
    const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({name: "testIDTransactionDid", idCredit:"A0", idDebit: "A1", amount:100});
    status.should.equal(201);
    body.should.have.property("transaction");
  });
  it("Do a transaction with credit wrong id", async () => {
    const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({name: "testIDTransactionDid", idCredit:"wrong", idDebit: "A1", amount:100});
    status.should.equal(404);
    body.should.have.property("error");
  });
  it("Do a transaction with debit wrong id", async () => {
    const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({name: "testIDTransactionDid", idCredit:"A0", idDebit: "wrong", amount:100});
    status.should.equal(404);
    body.should.have.property("error");
  });
  it("Do a transaction without sufficient money", async () => {
    const {status, body} = await request(app).post(uri).set("Accept", "application/json").send({name: "testIDTransactionDid", idCredit:"A0", idDebit: "A1", amount:1000000});
    status.should.equal(401);
    body.should.have.property("error");
  });
});
