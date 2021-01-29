import express from "express";
import { Account } from "../Account";
import { listOfBanks } from "../main";
import { body } from "express-validator";
import { handleErrors } from "./transactions";

const router = express.Router();

router.get("/:bankId/accounts/", ({ params: { bankId } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (bank) return res.status(200).json(bank.getListOfAccounts());
  return res.status(404).json({ error: "bank not found" });
});

router.get("/:bankId/accounts/:id", ({ params: { bankId, id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const account = bank.getListOfAccounts().find((item) => item.getId() === id);
  if (!account) return res.status(404).json({ error: "user not found" });
  return res.status(200).json(account.toJson());
});

router.post("/:bankId/accounts/", body("name").exists().notEmpty().not().isNumeric(), body("amount").exists().isFloat(), handleErrors,({ params: { bankId }, body: { name, amount } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  bank.getListOfAccounts().push(new Account(`A${bank.getListOfAccounts().length.toString()}`, name, amount));
  bank.setAccountsPlafond(bank.getAccountsPlafond() + amount);
  return res.status(201).json({message: `Welcome ${name}, your ID is A${(bank.getListOfAccounts().length - 1).toString()} and your total amount is ${amount}€`});
  }
);

export { router as accounts };
