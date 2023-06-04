import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { CommissionService } from './commision.service';
import { AccountingDto } from './dto/accounting.dto';

@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @ApiTags('commission')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary:
      'Accounting commission when transaction is done. (Payment success)',
  })
  @Post('accounting')
  async accounting(@Body() dto: AccountingDto) {
    const result = await this.commissionService.accounting(dto);

    return {
      status: ResponseStatus.SUCCESS,
      data: { result },
    };
  }

  @ApiTags('commission')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Get commission by user id',
  })
  @Get('commission/:userId')
  async getMyCommission(@Param('userId') userId: string) {
    const commissions = await this.commissionService.getCommissionByUserId(
      +userId,
    );

    return {
      status: ResponseStatus.SUCCESS,
      data: commissions,
    };
  }
}
