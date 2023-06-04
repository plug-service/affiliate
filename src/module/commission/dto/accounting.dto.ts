import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TransactionType {
  TOP_UP = 'TOP_UP',
}

export class Transaction {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  [key: string]: any;
}

export class AccountingDto {
  @ApiProperty()
  @IsNotEmpty()
  uId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty()
  @IsNotEmpty()
  transaction: Transaction;

  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date;
}
