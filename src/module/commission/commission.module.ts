import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralCodeModule } from '../referral-code/referral-code.module';
import { Commission, CommissionSchema } from './schemas/commission.schema';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commision.service';
import { ReferralUserModule } from '../referral-user/referral-user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Commission.name,
        useFactory: () => CommissionSchema,
      },
    ]),
    ReferralCodeModule,
    ReferralUserModule,
  ],
  providers: [CommissionService],
  controllers: [CommissionController],
  exports: [CommissionService],
})
export class CommissionModule {}
