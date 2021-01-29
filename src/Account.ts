export class Account {
  constructor(
    private id: string,
    private name: string,
    private balance: number
  ) {}
  public getId = (): string => this.id;
  public getName = (): string => this.name;
  public getBalance = (): number => this.balance;
  public setBalance = (value: number): number => (this.balance = value);
  public toJson = () => ({
    id: this.id,
    name: this.name,
    budget: `${this.balance}€`,
  });
}
