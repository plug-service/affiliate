import { Module } from '@nestjs/common';
import { ReferralCodeController } from './referral-code.controller';
import { ReferralCodeService } from './referral-code.service';

@Module({
  providers: [ReferralCodeService],
  controllers: [ReferralCodeController],
  exports: [ReferralCodeService],
})
export class ReferralCodeModule {}
