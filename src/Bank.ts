import { Account } from "./Account";
import { Transaction } from "./Transaction";
export class Bank {
    constructor(
        private id: string,
        private name: string,
        private balance: number = 0,
        private accountsPlafond: number = 0,
        private accounts: Account[] = [],
        private transactions: Transaction[] = []
    ) {}

    public getId = (): string => this.id;
    public getBalance = (): number => this.balance;
    public getAccounts = (): Account[] => this.accounts;
    public getTransactions = (): Transaction[] => this.transactions;
    public setBalance = (value: number): number => (this.balance = value);
    public setAccountsPlafond = (value: number): number => (this.accountsPlafond = value);
    public getAccountsPlafond = () => this.accountsPlafond;
}
