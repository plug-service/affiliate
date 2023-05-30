import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DisconnectReferralUserDto {
  @ApiProperty()
  @IsNotEmpty()
  referralUserId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
