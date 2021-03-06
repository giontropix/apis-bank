import express from "express";
import { body, param, validationResult } from "express-validator";
import { listOfBanks, writeToFile } from "../main";
import { Transaction } from "../Transaction";

const router = express.Router({mergeParams: true});

export const handleErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  else next();
};

router.get("/", ({params: {bankId}, query: {user, otherBank, show, offset, limit}}, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  let transactions = bank.getTransactions();
  if(show === "credit") transactions = bank.getTransactions().filter(transaction => transaction.getAmount() > 0)
  if(show === "debit") transactions = bank.getTransactions().filter(transaction => transaction.getAmount() < 0)
  if(otherBank) bank.getTransactions().filter(transaction => transaction.getDebitorBank() === otherBank || transaction.getCreditorBank() === otherBank)
  if(otherBank && show === "credit") transactions = bank.getTransactions().filter(transaction => transaction.getCreditorBank() === otherBank)
  if(otherBank && show === "debit") transactions = bank.getTransactions().filter(transaction => transaction.getDebitorBank() === otherBank)
  if(user) transactions = bank.getTransactions().filter(transaction => transaction.getCreditorId() === user || transaction.getDebitorId() === user)
  if(user && show === "debit") transactions = transactions.filter(transaction => transaction.getDebitorId() === user && transaction.getAmount() < 0)
  if(user && show === "credit") transactions = bank.getTransactions().filter(transaction => transaction.getCreditorId() === user && transaction.getAmount() > 0)
  if(offset && limit) transactions = bank.getTransactions().slice(Number(offset), Number(offset) + Number(limit));
  return res.status(200).json(transactions);
})

router.get("/:id", ({ params: { bankId, id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const transaction = bank.getTransactions().find((item) => item.getId() === id.toLowerCase());
  if (!transaction) return res.status(404).json({ error: "transaction not found" });
  return res.status(200).json(transaction);
});

router.delete("/:id", ({params : {bankId, id}}, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const transactionIndex = bank.getTransactions().findIndex((item) => item.getId() === id.toLowerCase());
  if (transactionIndex === -1) return res.status(404).json({ error: "transaction not found" });
  bank.getTransactions().splice(transactionIndex, 1);
  writeToFile()
  return res.status(201).json({message: "transaction removed"});
})

router.post(
  "/",
  param("bankId").toLowerCase(),
  body("debitor_id").exists().notEmpty().isString().toLowerCase(),
  body("creditor_id").exists().notEmpty().isString().toLowerCase(),
  body("creditor_bank_id").exists().notEmpty().isString().toLowerCase(),
  body("description").exists().notEmpty().isString().toLowerCase(),
  body("amount").exists().notEmpty().isFloat({min: 1}),
  handleErrors, ({params: { bankId }, body: { creditor_id, creditor_bank_id, debitor_id, description, amount }},res) => {

    const debitorBank = listOfBanks.find((bank) => bank.getId() === bankId);
    if (!debitorBank) return res.status(404).json({ error: "debitor's bank not found" });

    const creditorBank = listOfBanks.find((bank) => bank.getId() === creditor_bank_id);
    if (!creditorBank) return res.status(404).json({ error: "creditor's bank not found" });

    const debitorAccount = debitorBank.getAccounts().find((item) => item.getId() === debitor_id);
    if(!debitorAccount) return res.status(404).json({error: "debitor's account not found"});

    const creditorAccount = creditorBank.getAccounts().find((item) => item.getId() === creditor_id);
    if(!creditorAccount) return res.status(404).json({error: "creditor's account not found"});

    const commission = debitorBank.getId() === creditorBank.getId() ? 0 : 1;

    if ((debitorAccount.getBalance() - amount) - commission < 0) return res.status(401).json({ error: "Insufficient money" });

    debitorAccount.setBalance((debitorAccount.getBalance() - amount) - commission);
    creditorAccount.setBalance(creditorAccount.getBalance() + amount);
    
    debitorBank.setBalance(debitorBank.getBalance() + commission);

    debitorBank.setAccountsPlafond(debitorBank.getAccountsPlafond() - amount);
    creditorBank.setAccountsPlafond(creditorBank.getAccountsPlafond() + amount);

    debitorBank.getTransactions().push(new Transaction(
            "t" + (debitorBank.getTransactions().length + 1).toString(),
            debitorBank.getId(),
            debitorAccount.getId(),
            creditorBank.getId(),
            creditorAccount.getId(),
            description,
            - (amount + commission),
            commission
          )
    );

    creditorBank.getTransactions().push(new Transaction(
            "t" + debitorBank.getTransactions().length.toString(),
            debitorBank.getId(),
            debitorAccount.getId(),
            creditorBank.getId(),
            creditorAccount.getId(),
            description,
            amount
          )
    );
    writeToFile();
    return res.status(201).json({transaction: debitorBank.getTransactions()[debitorBank.getTransactions().length - 1]});
  }
);

export { router as transactions };
