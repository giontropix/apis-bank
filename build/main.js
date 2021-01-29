"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOfTransactions = exports.listOfAccount = exports.listOfBanks = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Account_1 = require("./Account");
const Bank_1 = require("./Bank");
const transactions_1 = require("./routes/transactions");
const accounts_1 = require("./routes/accounts");
const banks_1 = require("./routes/banks");
exports.app = express_1.default();
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.listen(3000);
exports.listOfBanks = [
    new Bank_1.Bank("testid", "testname", 1000)
];
exports.listOfAccount = [
    new Account_1.Account("A0", "Pippo", 1000),
    new Account_1.Account("A1", "Tano", 1000),
];
exports.listOfTransactions = [];
exports.app.use("/users/", accounts_1.accounts);
exports.app.use("/", transactions_1.transactions);
exports.app.use("/banks/", banks_1.banks);
console.log("Server started");
