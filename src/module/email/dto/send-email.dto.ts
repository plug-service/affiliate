import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  fromName: string;

  @ApiProperty()
  @IsEmail()
  fromEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  toName: string;

  @ApiProperty()
  @IsEmail()
  toEmail: string;

  @ApiProperty({
    description: 'You can use UTF-8 encoding in subject such 🤘 Hello 🤘',
  })
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  htmlBody: string;
}
