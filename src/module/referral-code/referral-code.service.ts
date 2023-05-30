import { Injectable } from '@nestjs/common';
import { StepResult } from '../basic/basic.dto';
import { UpdateReferralCodeDto } from './dto/update.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReferralCode,
  ReferralCodeStatus,
} from './schemas/referral-code.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReferralCodeService {
  @InjectModel(ReferralCode.name)
  private readonly referralCodeModel: Model<ReferralCode>;

  async getByUserId(userId: number): Promise<ReferralCode> {
    const record = await this.referralCodeModel.findOne({
      userId: userId,
      status: ReferralCodeStatus.ACTIVE,
    });

    if (record) {
      return record;
    }

    const newReferralCode = await this.generateReferralCode();
    const defaultRate = process.env.DEFAULT_REFERRAL_CODE_RATE || 0.1;

    return await this.referralCodeModel.create({
      userId,
      code: newReferralCode,
      extras: {
        rate: +defaultRate,
      },
      status: ReferralCodeStatus.ACTIVE,
    });
  }

  async checkNewReferralCodeValid(referralCode: string): Promise<StepResult> {
    referralCode = referralCode.toUpperCase();

    const minLength = process.env.MIN_LENGTH_REFERRAL_CODE || 3;
    const maxLength = process.env.MAX_LENGTH_REFERRAL_CODE || 15;

    if (referralCode.length < +minLength || referralCode.length > +maxLength) {
      return {
        isSuccess: false,
        message: 'Referral code length must be between 3 and 15',
      };
    }

    // Check if referral code contain special characters
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(referralCode)) {
      return {
        isSuccess: false,
        message: 'Referral code must not contain special characters',
      };
    }

    const isExistReferralCode = await this.isExistReferralCode(referralCode);

    if (isExistReferralCode) {
      return {
        isSuccess: false,
        message: 'Referral code is exist',
      };
    }

    return {
      isSuccess: true,
    };
  }

  /**
   * Check if referral code is exist, including status is active or not
   */
  async isExistReferralCode(referralCode: string): Promise<boolean> {
    const record = await this.referralCodeModel.findOne({
      code: referralCode.toUpperCase(),
    });

    return !!record;
  }

  async findById(id: string): Promise<ReferralCode> {
    return await this.referralCodeModel.findById(id);
  }

  async update(dto: UpdateReferralCodeDto) {
    const referralCode = dto.referralCode.toUpperCase();

    console.log(dto.id, dto.status, referralCode);
    await this.referralCodeModel.findByIdAndUpdate(dto.id, {
      code: referralCode,
      status: dto.status,
      updatedAt: new Date(),
    });
  }

  async generateReferralCode(): Promise<string> {
    const referralCodeLength = 5;
    let referralCode = this.generateRandomString(referralCodeLength);

    let maxLoop = 100;
    while (await this.isExistReferralCode(referralCode)) {
      referralCode = this.generateRandomString(referralCodeLength);

      maxLoop--;
      if (maxLoop === 0) {
        throw new Error('Cannot generate referral code');
      }
    }

    return referralCode;
  }

  async getReferralCodeInformation(
    referralCode: string,
  ): Promise<ReferralCode> {
    return await this.referralCodeModel.findOne({
      code: referralCode.toUpperCase(),
      status: ReferralCodeStatus.ACTIVE,
    });
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.toUpperCase();
  }
}
