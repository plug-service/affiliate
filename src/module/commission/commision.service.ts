import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccountingDto,
  Transaction,
  TransactionType,
} from './dto/accounting.dto';
import { ReferralUserService } from '../referral-user/referral-user.service';
import { ReferralUserStatus } from '../referral-user/schemas/referral-user.schema';
import { ReferralCodeService } from '../referral-code/referral-code.service';
import { Commission } from './schemas/commission.schema';

@Injectable()
export class CommissionService {
  @InjectModel(Commission.name)
  private readonly commissionModel: Model<Commission>;

  constructor(
    private readonly referralUserService: ReferralUserService,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  async accounting(dto: AccountingDto): Promise<Commission | undefined> {
    const { transactionType, transaction, uId, createdAt } = dto;

    const transactionExist = await this.checkIfTransactionExist(
      transactionType,
      transaction,
    );

    if (transactionExist) {
      // transaction already exist and commission already calculated
      return;
    }

    // check if user is a referrer
    const referrer = await this.referralUserService.getUserIdByReferralUserId(
      uId,
      ReferralUserStatus.ACTIVE,
    );

    if (!referrer) {
      return;
    }

    const referralId = referrer.uId;
    const referralCode = await this.referralCodeService.getByUserId(referralId);

    const commission = await this.calculateCommission(
      transactionType,
      transaction,
      referralCode.extras.rate,
    );

    return await this.commissionModel.create({
      uId: referralId,
      amount: transaction.amount,
      rate: referralCode.extras.rate,
      commission: commission,
      txType: dto.transactionType,
      tx: dto.transaction,
      fromUId: uId,
      createdAt: createdAt,
    });
  }

  private async calculateCommission(
    transactionType: TransactionType,
    transaction: Transaction,
    rate: number,
  ): Promise<number> {
    if (transactionType === TransactionType.TOP_UP) {
      return transaction.amount * rate;
    }

    return transaction.amount * rate;
  }

  async getCommissionByUserId(userId: number): Promise<Commission[]> {
    return await this.commissionModel.find({ uId: userId });
  }

  async checkIfTransactionExist(
    transactionType: TransactionType,
    transaction: Transaction,
  ): Promise<boolean> {
    const txId = transaction.id;

    const transactionExist = await this.commissionModel.findOne({
      txType: transactionType,
      'tx.id': txId,
    });

    return !!transactionExist;
  }
}
