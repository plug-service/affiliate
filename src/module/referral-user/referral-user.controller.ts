import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { ReferralUserService } from './referral-user.service';
import { ConnectReferralUserDto } from './dto/connect.dto';
import { ReferralCodeService } from '../referral-code/referral-code.service';
import { DisconnectReferralUserDto } from './dto/disconnect.dto';

@Controller('referral-user')
export class ReferralUserController {
  constructor(
    private readonly referralUserService: ReferralUserService,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  @ApiTags('referral-user')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Connect referral user to user by referral code',
  })
  @Post('/connect')
  async connect(@Body() dto: ConnectReferralUserDto) {
    const referral = await this.referralCodeService.getReferralCodeInformation(
      dto.referralCode,
    );

    if (!referral) {
      return {
        status: ResponseStatus.FAIL,
        message: 'Referral code not found',
      };
    }

    if (referral.userId === dto.referralUserId) {
      return {
        status: ResponseStatus.FAIL,
        message: 'Cannot connect to yourself',
      };
    }

    const result = await this.referralUserService.connect(
      referral.userId,
      dto.referralUserId,
    );

    return {
      status: result ? ResponseStatus.SUCCESS : ResponseStatus.FAIL,
      message: result?.message,
      data: {
        hostUserId: referral.userId,
        referralUserId: dto.referralUserId,
      },
    };
  }

  @ApiTags('referral-user')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'Disconnect referral user to user',
  })
  @Post('/disconnect')
  async disconnect(@Body() dto: DisconnectReferralUserDto) {
    const result = await this.referralUserService.disconnect(
      dto.userId,
      dto.referralUserId,
      dto.isDelete,
    );

    return {
      status: result.isSuccess ? ResponseStatus.SUCCESS : ResponseStatus.FAIL,
    };
  }

  @ApiTags('referral-user')
  @ApiResponse({
    status: 200,
    type: BasicResponse,
  })
  @ApiOperation({
    summary: 'get referral user information if exist and active',
  })
  @Get('/list-referral-user/:userId')
  async getListReferralUser(@Param('userId') userId: string) {
    const result = await this.referralUserService.getReferralUserId(+userId);

    return {
      status: ResponseStatus.SUCCESS,
      data: result,
    };
  }
}
