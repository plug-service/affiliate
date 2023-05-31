import { Module } from '@nestjs/common';
import { ReferralUserController } from './referral-user.controller';
import { ReferralUserService } from './referral-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferralUser,
  ReferralUserSchema,
} from './schemas/referral-user.schema';
import { ReferralCodeModule } from '../referral-code/referral-code.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ReferralUser.name,
        useFactory: () => ReferralUserSchema,
      },
    ]),
    ReferralCodeModule,
  ],
  providers: [ReferralUserService],
  controllers: [ReferralUserController],
  exports: [ReferralUserService],
})
export class ReferralUserModule {}
