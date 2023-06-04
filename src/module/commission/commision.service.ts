import { Injectable } from '@nestjs/common';
import { StepResult } from '../basic/basic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Commission, CommissionStatus } from './schemas/referral-code.schema';
import { Model } from 'mongoose';
import { AccountingDto } from './dto/accounting.dto';
import { ReferralUserService } from '../referral-user/referral-user.service';
import { ReferralUserStatus } from '../referral-user/schemas/referral-user.schema';

@Injectable()
export class CommissionService {
  @InjectModel(Commission.name)
  private readonly commissionModel: Model<Commission>;

  referralUserService: ReferralUserService;
  constructor(referralUserService: ReferralUserService) {}

  async accounting(dto: AccountingDto): Promise<Commission> {
    const { transactionType, transaction, uId, createdAt } = dto;

    // check if user is a referrer
    const referrer = await this.referralUserService.getUserIdByReferralUserId(
      uId,
      ReferralUserStatus.ACTIVE,
    );

    if (!referrer) {
      return;
    }

    return await this.commissionModel.create({
      uId: dto.uId,
      amount: dto.transaction.amount,
      transactionType: dto.transactionType,
      transaction: dto.transaction,
      createdAt: dto.createdAt,
    });
  }
}
