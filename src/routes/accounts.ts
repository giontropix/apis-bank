import express from "express";
import { Account } from "../Account";
import { listOfBanks, writeToFile } from "../main";
import { body, param } from "express-validator";
import { handleErrors } from "./transactions";

const router = express.Router({mergeParams: true});

router.get("/", ({ params: { bankId }, query: {offset, limit} }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  if(offset && limit) return res.status(200).json(bank.getAccounts().slice(Number(offset), Number(offset) + Number(limit)))
  return res.status(200).json(bank.getAccounts());
});

router.get("/:id", ({ params: { bankId, id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const account = bank.getAccounts().find((item) => item.getId() === id.toLowerCase());
  if (!account) return res.status(404).json({ error: "account not found" });
  return res.status(200).json(account);
});

router.delete("/:id", ({params : {bankId, id}}, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const accountIndex = bank.getAccounts().findIndex((item) => item.getId() === id.toLowerCase());
  if (accountIndex === -1) return res.status(404).json({ error: "account not found" });
  bank.getAccounts().splice(accountIndex, 1);
  writeToFile();
  return res.status(201).json({message: "account removed"});
})

router.post("/", param("bankId").toLowerCase(), body("name").exists().notEmpty().not().isNumeric(), body("balance").exists().isFloat(), handleErrors,({ params: { bankId }, body: { name, balance } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  bank.getAccounts().push(new Account(`a${(bank.getAccounts().length + 1).toString()}`, name, balance));
  bank.setAccountsPlafond(bank.getAccountsPlafond() + balance);
  writeToFile();
  return res.status(201).json({message: `Welcome ${name}, your ID is a${(bank.getAccounts().length - 1).toString()} and your total balance is ${balance}€`});
  }
);

export { router as accounts };
