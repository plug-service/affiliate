import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { ReferralCodeService } from './referral-code.service';
import { UpdateReferralCodeDto } from './dto/update.dto';

@Controller('referral-code')
export class ReferralCodeController {
  constructor(private readonly referralCodeService: ReferralCodeService) {}

  @ApiTags('referral-code')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Get referral code by user id. Create if not exist',
  })
  @Get('get-by-user-id/:userId')
  async getByUserId(@Param('userId') userId: string) {
    const result = await this.referralCodeService.getByUserId(+userId);

    return {
      status: ResponseStatus.SUCCESS,
      data: { result },
    };
  }

  @ApiTags('referral-code')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Check if a new referral code is valid',
  })
  @Get('/check-new-referral-code/:referralCode')
  async checkNewReferralCodeValid(@Param('referralCode') referralCode: string) {
    const result = await this.referralCodeService.checkNewReferralCodeValid(
      referralCode,
    );

    return {
      status: result.isSuccess ? ResponseStatus.SUCCESS : ResponseStatus.FAIL,
      message: result.message,
    };
  }

  @ApiTags('referral-code')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'update referral code',
  })
  @Post('/update')
  async update(@Body() dto: UpdateReferralCodeDto) {
    const current = await this.referralCodeService.findById(dto.id);
    if (!current) {
      return {
        status: ResponseStatus.FAIL,
        message: 'Referral code not found',
      };
    }

    if (dto.ownerId !== current.userId) {
      return {
        status: ResponseStatus.FAIL,
        message: 'You are not owner of this referral code',
      };
    }

    if (current.code !== dto.referralCode) {
      // check if new referral code is valid
      const result = await this.referralCodeService.checkNewReferralCodeValid(
        dto.referralCode,
      );
      if (!result.isSuccess) {
        return {
          status: ResponseStatus.FAIL,
          message: result.message,
        };
      }
    }

    const result = await this.referralCodeService.update(dto);
    return {
      status: ResponseStatus.SUCCESS,
      data: { result },
    };
  }

  @ApiTags('referral-code')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'get referral code information',
  })
  @Get('/get-referral-code-information/:referralCode')
  async getReferralCodeInformation(
    @Param('referralCode') referralCode: string,
  ) {
    const result = await this.referralCodeService.getReferralCodeInformation(
      referralCode,
    );
    return {
      status: ResponseStatus.SUCCESS,
      data: result,
    };
  }
}
