import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { Account } from "./Account";
import { Bank } from "./Bank";
import { transactions } from "./routes/transactions";
import { accounts } from "./routes/accounts";
import { banks } from "./routes/banks";
import { Transaction } from "./Transaction";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => console.log("Server started"));

const path: string = "src/resources/banks.json";

export let listOfBanks: Bank[] = [];

export const readFileMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
  readFile();
  if(next) next();
}

export const readFile = () => {
  try {
    const data = fs.readFileSync(path, "utf8");
    listOfBanks = JSON.parse(data).map((bank: any) => {
      if(bank) return new Bank(bank.id, bank.name, bank.balance, bank.accountsPlafond, bank.accounts.map((account: any) => {
         if (account) return new Account(account.id, account.name, account.balance)}), bank.transactions.map((transaction: any) => {
           if (transaction) return new Transaction(transaction.id, transaction.debitorBank, transaction.debitorId, transaction.creditorBank, transaction.creditorId, transaction.description, transaction.amount, transaction.commission)}))
          });
  } catch(err) {
    if (err) return console.error(err)
  }
}

export const writeToFile = () => {
  try {
    fs.writeFileSync(path, JSON.stringify(listOfBanks, null, 2))
  } catch (err) {
    console.error(err);
  }
}

const updateBalance = () => {
  readFile()
  const bool = listOfBanks.map(bank => {
      if(bank.getAccounts().length > 0) {
        const count = bank.getAccounts().map(account => account.getBalance()).reduce((acc, curr) => acc + curr)
        return bank.getAccountsPlafond() === count ? true : bank.setAccountsPlafond(count)
      }
  })
  writeToFile()
  return bool;
}

const timer = () => setInterval(() => { console.log(updateBalance()); writeToFile();}, 3600);

timer();

app.use("/banks", readFileMiddleware, banks);
