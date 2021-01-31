import { Account } from "./Account";
import { Transaction } from "./Transaction";
export class Bank {
  constructor(
    private id: string,
    private name: string,
    private balance: number = 0,
    private accountsPlafond: number = 0,
    private listOfAccounts: Account[] = [],
    private listOfTransactions: Transaction[] = []
  ) {}

  public getName = (): string => this.name;
  public getId = (): string => this.id;
  public getBalance = (): number => this.balance;
  public getListOfAccounts = (): Account[] => this.listOfAccounts;
  public getListOfTransactions = (): Transaction[] => this.listOfTransactions;
  public setBalance = (value: number): number => this.balance = value;
  public setAccountsPlafond = (value: number): number => this.accountsPlafond = value;
  public getAccountsPlafond = () => this.accountsPlafond;
}
