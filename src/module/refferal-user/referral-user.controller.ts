import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicResponse, ResponseStatus } from '../basic/basic.dto';
import { ReferralUserService } from './referral-user.service';
import { ConnectReferralUserDto } from './dto/connect.dto';
import { ReferralCodeService } from '../refferal-code/referral-code.service';
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

    const result = await this.referralUserService.connect(
      referral.userId,
      dto.referralUserId,
    );

    return {
      status: result ? ResponseStatus.SUCCESS : ResponseStatus.FAIL,
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
  @Post('/disconnect')
  async disconnect(@Body() dto: DisconnectReferralUserDto) {
    const result = await this.referralUserService.disconnect(
      dto.userId,
      dto.referralUserId,
    );

    return {
      status: result ? ResponseStatus.SUCCESS : ResponseStatus.FAIL,
    };
  }
}
