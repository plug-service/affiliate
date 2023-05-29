import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { GmailService } from './gmail.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @ApiTags('email')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Send gmail',
  })
  @Post('send')
  async send(@Body() dto: SendEmailDto) {
    const result = await this.gmailService.send(dto);

    return {
      status: ResponseStatus.SUCCESS,
      data: { result },
    };
  }

  @ApiTags('email')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Test send gmail',
  })
  @Get('test')
  async test() {
    const sample: SendEmailDto = {
      fromName: 'Ads Pro',
      fromEmail: 'support@ads-pro.site',
      toName: 'Thanh Dat',
      toEmail: 'zingfeng.9x@gmail.com',
      subject: 'Welcome to Ads Pro',
      htmlBody: '<h1>Test email</h1>',
    };

    const result = await this.gmailService.send(sample);
    return {
      status: ResponseStatus.SUCCESS,
      data: { result, sample },
    };
  }
}
