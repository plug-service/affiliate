import { ApiProperty } from '@nestjs/swagger';

export class PingDto {
  @ApiProperty({ default: 'hello world', required: false })
  message: string;
}
