export class Transaction {
    constructor(
        private id: string,
        private debitorBank: string,
        private debitorId: string,
        private creditorBank: string,
        private creditorId: string,
        private description: string,
        private amount: number,
        private commission: number = 0
    ) {}

    public getId = () => this.id;
    public getDebitorId = () => this.debitorId;
    public getCreditorId = () => this.creditorId;
    public getDebitorBank = () => this.debitorBank;
    public getCreditorBank = () => this.creditorBank;
    public getAmount = () => this.amount;
}
