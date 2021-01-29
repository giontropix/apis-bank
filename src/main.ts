import express from "express";
import bodyParser from "body-parser";
import { Account } from "./Account";
import { Bank } from "./Bank";
import { transactions } from "./routes/transactions";
import { accounts } from "./routes/accounts";
import { banks } from "./routes/banks";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => console.log("Server started"));

const user1 = new Account("pippo", "Pippo", 0);
const user2 = new Account("pluto", "Pluto", 0);
const user3 = new Account("saro", "Saro", 100);
const bank1 = new Bank("ing", "Ing Direct");
const bank2 = new Bank("fin", "Fineco");
bank1.getListOfAccounts().push(user1);
bank1.getListOfAccounts().push(user2);
bank2.getListOfAccounts().push(user3);
export let listOfBanks: Bank[] = [bank1, bank2];

const updateBalance = () => {
  const bool = listOfBanks.map(bank => {
      if(bank.getListOfAccounts().length > 0) {
      const count = bank.getListOfAccounts().map(account => account.getBalance()).reduce((acc, curr) => acc + curr)
      return bank.getBalance() === count ? true : bank.setBalance(count)
      }
  })
  return bool;
}
const timer = () => setInterval(() => console.log(updateBalance()), 3600)
timer();

app.use("/banks", banks);
app.use("/banks/", accounts);
app.use("/finances/banks", transactions);
