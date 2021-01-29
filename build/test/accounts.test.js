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
const main_1 = require("../main");
const uri = "/users/accounts";
chai_1.default.should();
describe("Accounts", () => {
    it("Show all accounts", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app)
            .get(uri)
            .set("Accept", "application/json");
        status.should.equal(200);
        body.should.have.lengthOf(main_1.listOfAccount.length);
    }));
    it("Show single account", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body: { id }, } = yield supertest_1.default(main_1.app)
            .get(uri + `/${main_1.listOfAccount[main_1.listOfAccount.length - 1].getId()}`)
            .set("Accept", "application/json");
        status.should.equal(200);
        id.should.equal(main_1.listOfAccount[main_1.listOfAccount.length - 1].getId());
    }));
    it("Show single account with wrong id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, body } = yield supertest_1.default(main_1.app)
            .get(uri + `/wrongID`)
            .set("Accept", "application/json");
        status.should.equal(404);
        body.should.have.property("error");
    }));
    it("Create new account", () => __awaiter(void 0, void 0, void 0, function* () {
        const length = main_1.listOfAccount.length;
        const name = "test";
        const { status, body } = yield supertest_1.default(main_1.app)
            .post(uri)
            .set("Accept", "application/json")
            .send({ name, budget: 1000 });
        status.should.equal(201);
        body.should.have.property("message");
        main_1.listOfAccount.should.have.lengthOf(length + 1);
        main_1.listOfAccount[main_1.listOfAccount.length - 1].getName().should.equal(name);
    }));
});
