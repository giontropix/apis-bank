"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounts = void 0;
const express_1 = __importDefault(require("express"));
const Account_1 = require("../Account");
const main_1 = require("../main");
const express_validator_1 = require("express-validator");
const transactions_1 = require("./transactions");
const router = express_1.default.Router();
exports.accounts = router;
router.get(":bankId/accounts/", ({ params: { bankId } }, res) => {
    const bank = main_1.listOfBanks.find((bank) => bank.getId() === bankId);
    if (bank)
        return res.status(200).json(bank.getListOfAccounts());
    return res.status(404).json({ error: "bank not found" });
});
router.get(":bankId/accounts/:id", ({ params: { bankId, id } }, res) => {
    const bank = main_1.listOfBanks.find((bank) => bank.getId() === bankId);
    if (bank) {
        const account = main_1.listOfAccount.find((item) => item.getId() === id);
        if (account)
            return res.status(200).json(account.toJson());
        return res.status(404).json({ error: "user not found" });
    }
    return res.status(404).json({ error: "bank not found" });
});
router.post(":bankId/accounts/", express_validator_1.body("name").exists().notEmpty().not().isNumeric(), express_validator_1.body("budget").exists().notEmpty().isNumeric(), transactions_1.handleErrors, ({ params: { bankId }, body: { name, budget } }, res) => {
    const bank = main_1.listOfBanks.find((bank) => bank.getId() === bankId);
    if (bank) {
        main_1.listOfAccount.push(new Account_1.Account(`A${main_1.listOfAccount.length.toString()}`, name, budget));
        return res.status(201).json({
            message: `Welcome ${name}, your ID is A${(main_1.listOfAccount.length - 1).toString()} and your total amount is ${budget}€`,
        });
    }
    return res.status(404).json({ error: "bank not found" });
});
