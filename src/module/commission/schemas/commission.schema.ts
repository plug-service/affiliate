import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '../dto/accounting.dto';

export enum CommissionStatus {
  ESTIMATE = 'ESTIMATE',
  OFFICIAL = 'OFFICIAL',
}

export enum CommissionPayment {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Schema()
export class Commission {
  @Prop({
    type: Number,
  })
  uId: number;

  @Prop({
    type: Number,
  })
  amount: number;

  @Prop({
    type: Number,
  })
  rate: number;

  @Prop({
    type: Number,
  })
  commission: number;

  @Prop({
    type: String,
  })
  txType: TransactionType;

  @Prop({
    type: Object,
  })
  tx: Record<string, any>;

  @Prop({
    type: Number,
  })
  fromUId: number;

  @Prop({
    type: String,
    default: CommissionStatus.ESTIMATE,
  })
  status: CommissionStatus;

  @Prop({
    type: String,
    default: CommissionPayment.PENDING,
  })
  paymentStatus: CommissionPayment;

  @Prop({
    type: Object,
  })
  payment: Record<string, any>;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export type CommissionDocument = HydratedDocument<Commission>;
export const CommissionSchema = SchemaFactory.createForClass(Commission);
