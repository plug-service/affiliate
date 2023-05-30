import { Module } from '@nestjs/common';
import { ReferralCodeController } from './referral-code.controller';
import { ReferralCodeService } from './referral-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferralCode,
  ReferralCodeSchema,
} from './schemas/referral-code.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ReferralCode.name,
        useFactory: () => ReferralCodeSchema,
      },
    ]),
  ],
  providers: [ReferralCodeService],
  controllers: [ReferralCodeController],
  exports: [ReferralCodeService],
})
export class ReferralCodeModule {}
