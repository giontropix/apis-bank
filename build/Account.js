"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(id, name, budget) {
        this.id = id;
        this.name = name;
        this.budget = budget;
        this.getId = () => this.id;
        this.getName = () => this.name;
        this.getBudget = () => this.budget;
        this.setBudget = (value) => (this.budget = value);
        this.toJson = () => ({
            id: this.id,
            name: this.name,
            budget: `${this.budget}€`,
        });
    }
}
exports.Account = Account;
