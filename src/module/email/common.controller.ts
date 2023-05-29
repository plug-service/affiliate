import { Controller, Get, Query } from '@nestjs/common';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PingDto } from './dto/ping.dto';

@Controller('common')
export class CommonController {
  @ApiTags('common')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiQuery({ name: 'message', type: PingDto })
  @ApiOperation({
    summary:
      'Endpoint for client to check if client config is correct and the server is alive',
  })
  @Get('ping')
  async send(@Query('message') message: string) {
    return {
      status: ResponseStatus.SUCCESS,
      data: message,
    };
  }
}
