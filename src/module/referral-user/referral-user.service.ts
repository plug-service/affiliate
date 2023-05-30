import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReferralUser,
  ReferralUserStatus,
} from './schemas/referral-user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReferralUserService {
  @InjectModel(ReferralUser.name)
  private readonly referralUserModel: Model<ReferralUser>;

  async connect(userId: number, referralUserId: number): Promise<boolean> {
    const record = await this.referralUserModel.findOne({
      userId,
      referralId: referralUserId,
    });

    if (!record) {
      // create new connection
      await this.referralUserModel.create({
        uId: userId,
        referralId: referralUserId,
        status: ReferralUserStatus.ACTIVE,
      });
      return true;
    }

    if (record.status === ReferralUserStatus.ACTIVE) {
      return true;
    }

    // update status to active
    await this.referralUserModel.findByIdAndUpdate(record._id, {
      status: ReferralUserStatus.ACTIVE,
      updatedAt: Date.now(),
    });
    return true;
  }

  async disconnect(userId: number, referralUserId: number): Promise<boolean> {
    const record = await this.referralUserModel.findOne({
      userId,
      referralId: referralUserId,
    });

    if (record?.status === ReferralUserStatus.ACTIVE) {
      await this.referralUserModel.findByIdAndUpdate(record._id, {
        status: ReferralUserStatus.INACTIVE,
        updatedAt: Date.now(),
      });
    }
    return true;
  }

  async getReferralUserId(
    userId: number,
    status?: ReferralUserStatus,
  ): Promise<ReferralUser[]> {
    const record = await this.referralUserModel.find({
      userId,
    });

    if (status) {
      return record.filter((item) => item.status === status);
    }
    return record;
  }
}
