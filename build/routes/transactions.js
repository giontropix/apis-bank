"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = exports.handleErrors = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const main_1 = require("../main");
const Transaction_1 = require("../Transaction");
const router = express_1.default.Router();
exports.transactions = router;
const handleErrors = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    else
        next();
};
exports.handleErrors = handleErrors;
router.get("/transactions/", (_, res) => {
    res.status(200).json(main_1.listOfTransactions);
});
router.get("/transactions/:id", ({ params: { id } }, res) => {
    const transaction = main_1.listOfTransactions.find((item) => item.getId() === id);
    if (transaction)
        return res.status(200).json(transaction);
    return res.status(404).json({ error: "user not found" });
});
router.post("/transactions/", express_validator_1.body("idCredit").exists().notEmpty().isString(), express_validator_1.body("idDebit").exists().notEmpty().isString(), express_validator_1.body("amount").exists().notEmpty().isNumeric(), exports.handleErrors, ({ body: { idCredit, idDebit, amount } }, res) => {
    const creditAccount = main_1.listOfAccount.find((item) => item.getId() === idCredit);
    const debitAccount = main_1.listOfAccount.find((item) => item.getId() === idDebit);
    if (creditAccount && debitAccount) {
        if (debitAccount.getBudget() - amount < 0)
            return res.status(401).json({ error: "Insufficient money" });
        creditAccount.setBudget(creditAccount.getBudget() + amount);
        debitAccount.setBudget(debitAccount.getBudget() - amount);
        main_1.listOfTransactions.push(new Transaction_1.Transaction("T" + main_1.listOfTransactions.length.toString(), creditAccount.getName(), debitAccount.getName(), amount));
        return res.status(201).json({
            transaction: main_1.listOfTransactions[main_1.listOfTransactions.length - 1].toJson(),
            creditAccount,
            debitAccount,
        });
    }
    return res.status(404).json({ error: "users not found" });
});
