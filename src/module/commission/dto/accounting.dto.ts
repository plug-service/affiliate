export enum TransactionType {
  TOP_UP = 'TOP_UP',
}

export class AccountingDto {
  uId: number;
  transactionType: TransactionType;
  transaction: Record<string, any>;
  createdAt: Date;
}
