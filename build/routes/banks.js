"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.banks = void 0;
const express_1 = __importDefault(require("express"));
const main_1 = require("../main");
const express_validator_1 = require("express-validator");
const transactions_1 = require("./transactions");
const Bank_1 = require("../Bank");
const router = express_1.default.Router();
exports.banks = router;
router.get("/", (req, res) => {
    if (main_1.listOfBanks.length > 0)
        return res.status(200).json(main_1.listOfBanks);
    return res.status(400).json({ error: "List of banks is empty" });
});
router.get("/:id", ({ params: { id } }, res) => {
    if (main_1.listOfBanks.length === 0)
        return res.status(400).json({ error: "List of banks is empty" });
    const bank = main_1.listOfBanks.find((bank) => bank.getId() == id);
    if (!bank)
        return res.status(404).json({ error: "bank not found" });
    return res.status(200).json(bank);
});
router.post("/", express_validator_1.body("name").exists().notEmpty(), express_validator_1.body("id").exists().notEmpty(), express_validator_1.body("budget").exists().notEmpty().isNumeric(), transactions_1.handleErrors, ({ body: { name, id, budget } }, res) => {
    const bank = main_1.listOfBanks.find((bank) => bank.getId() === id);
    if (bank)
        return res.status(403).json({ error: "Bank already exists" });
    main_1.listOfBanks.push(new Bank_1.Bank(name, id, budget));
    res.status(201).json({ message: `${name} was added!` });
});
