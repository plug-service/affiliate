import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ReferralCodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema()
export class ReferralCode {
  @Prop()
  code: string;

  @Prop({
    default: ReferralCodeStatus.ACTIVE,
  })
  status: ReferralCodeStatus;

  @Prop()
  userId: number;

  @Prop()
  extras: {
    rate: number;
    productId?: string;
  };

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

export type ReferralCodeDocument = HydratedDocument<ReferralCode>;
export const ReferralCodeSchema = SchemaFactory.createForClass(ReferralCode);
