import express from "express";
import { body, param, validationResult } from "express-validator";
import { listOfBanks, writeToFile } from "../main";
import { Transaction } from "../Transaction";

const router = express.Router();

export const handleErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  else next();
};

router.get("/:bankId/transactions/", ({params: {bankId}, query: {creditor, debitor, generalUser, creditorBank, debitorBank, generalBank, positive, negative}}, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  if(debitor) return res.status(201).json({result : bank.getTransactions().filter(transaction => transaction.getDebitorId() === debitor)}) 
  if(creditor) return res.status(201).json({result: bank.getTransactions().filter(transaction => transaction.getCreditorId() === creditor)})
  if(!positive && !negative && generalUser) return res.status(201).json({result: bank.getTransactions().filter(transaction => transaction.getCreditorId() === generalUser || transaction.getDebitorId() === generalUser)})
  if(creditorBank) return res.status(201).json({result: bank.getTransactions().filter(transaction => transaction.getCreditorBank() === creditorBank)})
  if(debitorBank) return res.status(201).json({result: bank.getTransactions().filter(transaction => transaction.getDebitorBank() === debitorBank)}) 
  if(generalBank) return res.status(201).json({result: bank.getTransactions().filter(transaction => transaction.getDebitorBank() === debitorBank || transaction.getCreditorBank() === creditorBank)})
  if(!generalUser && positive === "true") return res.status(200).json({result: bank.getTransactions().filter(transaction => transaction.getAmount() > 0)})
  if(!generalUser && negative === "true") return res.status(200).json({result: bank.getTransactions().filter(transaction => transaction.getAmount() < 0)})
  if(generalUser && positive === "true") return res.status(200).json({result: bank.getTransactions().filter(transaction => transaction.getAmount() > 0 && transaction.getCreditorId() === generalUser)})
  if(generalUser && negative === "true") return res.status(200).json({result: bank.getTransactions().filter(transaction => transaction.getAmount() < 0 && transaction.getDebitorId() === generalUser)})
  return res.status(200).json(bank.getTransactions());
})

router.get("/:bankId/transactions/:id", ({ params: { bankId, id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === bankId.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  const transaction = bank.getTransactions().find((item) => item.getId() === id.toLowerCase());
  if (!transaction) return res.status(404).json({ error: "user not found" });
  return res.status(200).json(transaction);
});

router.post(
  "/:bankId/transactions/",
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
