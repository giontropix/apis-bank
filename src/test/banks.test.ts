import chai from "chai";
import request from "supertest";
import { app, listOfBanks, readFile } from "../main";

readFile();
const uri = `/banks/`;

chai.should();

describe("BANKS", () => {
  describe("Show banks", () => {
    it("Show all banks", async () => {
      const { status, body } = await request(app).get(uri).set("Accept", "application/json");
      status.should.equal(200);
      body.should.have.lengthOf(listOfBanks.length);
    });
    it("Show single bank", async () => {
      const { status, body: {id} } = await request(app).get(uri + `${listOfBanks[0].getId()}`).set("Accept", "application/json");
      status.should.equal(200);
      id.should.equal(listOfBanks[0].getId());
    })
  });
});
