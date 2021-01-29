"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const supertest_1 = __importDefault(require("supertest"));
const Transaction_1 = require("../Transaction");
const main_1 = require("../main");
const uri = "/transactions";
chai_1.default.should();
describe("Transactions", () => {
    before(() => main_1.listOfTransactions.push(new Transaction_1.Transaction("testID", "testCredit", "testDebit", 1000)));
    after(() => main_1.listOfTransactions.length = 0);
    it("Show all transaction", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).get(uri).set("Accept", "application/json");
        status.should.equal(200);
        body.should.have.lengthOf(main_1.listOfTransactions.length);
    }));
    it("Show single transaction", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body: { id } } = yield supertest_1.default(main_1.app).get(uri + `/${main_1.listOfTransactions[main_1.listOfTransactions.length - 1].getId()}`).set("Accept", "application/json");
        status.should.equal(200);
        id.should.equal(main_1.listOfTransactions[main_1.listOfTransactions.length - 1].getId());
    }));
    it("Show single transaction with wrong id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).get(uri + `/wrongID`).set("Accept", "application/json");
        status.should.equal(404);
        body.should.have.property("error");
    }));
    it("Do a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).post(uri).set("Accept", "application/json").send({ name: "testIDTransactionDid", idCredit: "A0", idDebit: "A1", amount: 100 });
        status.should.equal(201);
        body.should.have.property("transaction");
    }));
    it("Do a transaction with credit wrong id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).post(uri).set("Accept", "application/json").send({ name: "testIDTransactionDid", idCredit: "wrong", idDebit: "A1", amount: 100 });
        status.should.equal(404);
        body.should.have.property("error");
    }));
    it("Do a transaction with debit wrong id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).post(uri).set("Accept", "application/json").send({ name: "testIDTransactionDid", idCredit: "A0", idDebit: "wrong", amount: 100 });
        status.should.equal(404);
        body.should.have.property("error");
    }));
    it("Do a transaction without sufficient money", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app).post(uri).set("Accept", "application/json").send({ name: "testIDTransactionDid", idCredit: "A0", idDebit: "A1", amount: 1000000 });
        status.should.equal(401);
        body.should.have.property("error");
    }));
});
