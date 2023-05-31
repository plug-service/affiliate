import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ReferralUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema()
export class ReferralUser {
  @Prop({
    type: Number,
  })
  uId: number;

  @Prop({
    type: Number,
  })
  referralId: number;

  @Prop({
    type: String,
    default: ReferralUserStatus.ACTIVE,
  })
  status: ReferralUserStatus;

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

export type ReferralUserDocument = HydratedDocument<ReferralUser>;
export const ReferralUserSchema = SchemaFactory.createForClass(ReferralUser);
