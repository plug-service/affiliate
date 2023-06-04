import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralCodeModule } from './module/referral-code/referral-code.module';
import { ReferralUserModule } from './module/referral-user/referral-user.module';
import { CommissionModule } from './module/commission/commission.module';

function loadModules(): Array<any> {
  const importModule = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ReferralCodeModule,
    ReferralUserModule,
    CommissionModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`,
    ),
  ];

  return importModule;
}
@Module({
  imports: loadModules(),
})
export class AppModule {}
