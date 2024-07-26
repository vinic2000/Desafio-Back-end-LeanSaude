import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  value: number;

  @ApiProperty()
  payer: string;

  @ApiProperty()
  payee: string;
}
