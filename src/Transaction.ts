export class Transaction {
  constructor(
    private id: string,
    private debitorBank: string,
    private debitorName: string,
    private creditorBank: string,
    private creditorName: string,
    private amount: number,
    private commission: number
  ) {}

  public getId = () => this.id;
  public toJson = () => ({
    id: this.id,
    debit_bank: this.debitorBank,
    debitor_name: this.debitorName,
    credit_bank: this.creditorBank,
    creditor_name: this.creditorName,
    amount: `${this.amount}€`,
    commission: `${this.commission}€`,
  });
}
