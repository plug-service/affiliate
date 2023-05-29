import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export interface StepResult {
  isSuccess: boolean;
  data?: any;
  message?: string;
}

export enum ResponseStatus {
  SUCCESS = 1000,
  FAIL = 1001,
}

export class BasicResponse {
  @ApiProperty({ example: 1000 })
  status: ResponseStatus;

  @IsOptional()
  @ApiProperty({ example: 'Error message in case of request fail' })
  message?: string;

  @IsOptional()
  @ApiProperty({ example: 'Data in case of request success' })
  data?: any;
}
