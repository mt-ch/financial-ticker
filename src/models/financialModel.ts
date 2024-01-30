export class FinancialModel {
  public name: string;
  public companyName: string;
  public price: number;
  public change: number;
  public chgPercentage: string;
  public marketCap: string;
  public isDelta: boolean;

  constructor(name: string, companyName: string, price: number, change: number, chgPercentage: string, marketCap: string, isDelta: boolean = false) {
    this.name = name;
    this.companyName = companyName;
    this.price = price;
    this.change = change;
    this.chgPercentage = chgPercentage;
    this.marketCap = marketCap;
    this.isDelta = isDelta;
  }
}
