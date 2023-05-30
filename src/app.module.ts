import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralCodeModule } from './module/refferal-code/refferal-code.module';

function loadModules(): Array<any> {
  const importModule = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ReferralCodeModule,
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
