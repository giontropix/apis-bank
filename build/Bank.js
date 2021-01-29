"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = void 0;
class Bank {
    constructor(name, id, budget, listOfAccount = []) {
        this.name = name;
        this.id = id;
        this.budget = budget;
        this.listOfAccount = listOfAccount;
        this.getName = () => this.name;
        this.getId = () => this.id;
        this.getBudget = () => this.budget;
        this.getListOfAccounts = () => this.listOfAccount;
    }
}
exports.Bank = Bank;
