import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReferralUser,
  ReferralUserStatus,
} from './schemas/referral-user.schema';
import { Model } from 'mongoose';
import { StepResult } from '../basic/basic.dto';

@Injectable()
export class ReferralUserService {
  @InjectModel(ReferralUser.name)
  private readonly referralUserModel: Model<ReferralUser>;

  /**
   * Return true when the connection between user and referral user exist and active
   * @param hostUserId
   * @param referralUserId
   * @returns
   */
  async connect(
    hostUserId: number,
    referralUserId: number,
  ): Promise<StepResult> {
    const record = await this.referralUserModel.findOne({
      uId: hostUserId,
      referralId: referralUserId,
    });

    if (!record) {
      // check if this user is has any connection
      const hasConnection = await this.referralUserModel.findOne({
        uId: referralUserId,
      });

      if (hasConnection) {
        return {
          isSuccess: false,
          message: 'User already connected to another referral user',
        };
      }

      // create new connection
      await this.referralUserModel.create({
        uId: hostUserId,
        referralId: referralUserId,
        status: ReferralUserStatus.ACTIVE,
      });
      return {
        isSuccess: true,
      };
    }

    if (record.status === ReferralUserStatus.ACTIVE) {
      return {
        isSuccess: true,
      };
    }

    // update status to active
    await this.referralUserModel.findByIdAndUpdate(record._id, {
      status: ReferralUserStatus.ACTIVE,
      updatedAt: Date.now(),
    });

    return {
      isSuccess: true,
    };
  }

  async disconnect(
    userId: number,
    referralUserId: number,
    isDelete = false,
  ): Promise<StepResult> {
    if (isDelete) {
      await this.referralUserModel.deleteOne({
        uId: userId,
        referralId: referralUserId,
      });
      return {
        isSuccess: true,
      };
    }

    const record = await this.referralUserModel.findOne({
      uId: userId,
      referralId: referralUserId,
    });

    if (record?.status === ReferralUserStatus.ACTIVE) {
      await this.referralUserModel.findByIdAndUpdate(record._id, {
        status: ReferralUserStatus.INACTIVE,
        updatedAt: Date.now(),
      });
    }
    return {
      isSuccess: true,
    };
  }

  /**
   * 1 user id -> connect with N referral user id
   * @param userId
   * @param status
   * @returns
   */
  async getReferralUserId(
    userId: number,
    status?: ReferralUserStatus,
  ): Promise<ReferralUser[]> {
    const record = await this.referralUserModel.find({
      uId: userId,
    });

    if (status) {
      return record.filter((item) => item.status === status);
    }
    return record;
  }

  async getUserIdByReferralUserId(
    referralUserId: number,
    status?: ReferralUserStatus,
  ): Promise<ReferralUser | undefined> {
    let record = await this.referralUserModel.find({
      referralId: referralUserId,
    });

    if (status) {
      record = record.filter((item) => item.status === status);
    }
    return record?.[0];
  }
}
