import { use } from "chai";
import express from "express";
import { body, validationResult } from "express-validator";
import { listOfBanks, writeToFile } from "../main";
import { Transaction } from "../Transaction";

const router = express.Router();

export const handleErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  else next();
};

router.get("/:bankId/transactions/", ({ params: { bankId } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  return res.status(200).json(bank.getListOfTransactions());
});

router.get("/:bankId/transactions/:id", ({ params: { bankId, id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const transaction = bank.getListOfTransactions().find((item) => item.getId() === id);
  if (!transaction) return res.status(404).json({ error: "user not found" });
  return res.status(200).json(transaction);
});

router.get("/:bankId/transactions/", ({params: {bankId}, query: {creditor, debitor, user, creditorBank, debitorBank, generalBank}}, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  if(debitor) return bank.getListOfTransactions().filter(transaction => transaction.getDebitorId() === debitor);
  if(creditor) return bank.getListOfTransactions().filter(transaction => transaction.getCreditorId() === creditor);
  if(user) return bank.getListOfTransactions().filter(transaction => transaction.getCreditorId() === user || transaction.getDebitorId() === user)
  if(creditorBank) return bank.getListOfTransactions().filter(transaction => transaction.getCreditorBank() === creditorBank);
  if(debitorBank) return bank.getListOfTransactions().filter(transaction => transaction.getDebitorBank() === debitorBank);
  if(generalBank) return bank.getListOfTransactions().filter(transaction => transaction.getDebitorBank() === debitorBank || transaction.getCreditorBank() === creditorBank);
})

router.post(
  "/:bankId/transactions/",
  body("creditor_id").exists().notEmpty().isString(),
  body("debitor_id").exists().notEmpty().isString(),
  body("amount").exists().notEmpty().isNumeric(),
  handleErrors, ({params: { bankId }, body: { creditor_id, creditor_bank_id, debitor_id, amount }},res) => {

    const debitorBank = listOfBanks.find((bank) => bank.getId() === bankId);
    if (!debitorBank) return res.status(404).json({ error: "debitor's bank not found" });

    const creditorBank = listOfBanks.find((bank) => bank.getId() === creditor_bank_id);
    if (!creditorBank) return res.status(404).json({ error: "creditor's bank not found" });

    const debitorAccount = debitorBank.getListOfAccounts().find((item) => item.getId() === debitor_id);
    if(!debitorAccount) return res.status(404).json({error: "debitor's account not found"});

    const creditorAccount = creditorBank.getListOfAccounts().find((item) => item.getId() === creditor_id);
    if(!creditorAccount) return res.status(404).json({error: "creditor's account not found"});

    const commission = debitorBank.getId() === creditorBank.getId() ? 0 : 1;

    if ((debitorAccount.getBalance() - amount) - commission < 0) return res.status(401).json({ error: "Insufficient money" });

    debitorAccount.setBalance((debitorAccount.getBalance() - amount) - commission);
    creditorAccount.setBalance(creditorAccount.getBalance() + amount);
    
    debitorBank.setBalance(debitorBank.getBalance() + commission);

    debitorBank.setAccountsPlafond(debitorBank.getAccountsPlafond() - amount);
    creditorBank.setAccountsPlafond(creditorBank.getAccountsPlafond() + amount);

    debitorBank.getListOfTransactions().push(new Transaction(
            "T" + (debitorBank.getListOfTransactions().length + 1).toString(),
            debitorBank.getId(),
            debitorAccount.getId(),
            creditorBank.getId(),
            creditorAccount.getId(),
            - (amount + commission),
            commission
          )
    );

    creditorBank.getListOfTransactions().push(new Transaction(
            "T" + debitorBank.getListOfTransactions().length.toString(),
            debitorBank.getId(),
            debitorAccount.getId(),
            creditorBank.getId(),
            creditorAccount.getId(),
            amount
          )
    );
    writeToFile();
    return res.status(201).json({transaction: debitorBank.getListOfTransactions()[debitorBank.getListOfTransactions().length - 1]});
  }
);

export { router as transactions };
