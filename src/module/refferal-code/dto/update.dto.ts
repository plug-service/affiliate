import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ReferralCodeStatus } from '../schemas/referral-code.schema';

export class UpdateReferralCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  referralCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReferralCodeStatus)
  status: string;

  @ApiProperty({
    type: Number,
    description: 'Owner user id',
  })
  @IsNotEmpty()
  ownerId: number;
}
