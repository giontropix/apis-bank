"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(id, debitName, creditName, amount) {
        this.id = id;
        this.debitName = debitName;
        this.creditName = creditName;
        this.amount = amount;
        this.getId = () => this.id;
        this.toJson = () => ({
            id: this.id,
            debitor_name: this.debitName,
            creditor_name: this.creditName,
            amount: `${this.amount}€`,
        });
    }
}
exports.Transaction = Transaction;
