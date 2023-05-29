import { Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { GmailController } from './gmail.controller';
import { CommonController } from './common.controller';

@Module({
  providers: [GmailService],
  controllers: [CommonController, GmailController],
  exports: [GmailService],
})
export class EmailModule {}
