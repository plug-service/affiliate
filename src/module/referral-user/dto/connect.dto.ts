import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ConnectReferralUserDto {
  @ApiProperty()
  @IsNotEmpty()
  referralUserId: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  referralCode: string;
}
