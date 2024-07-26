import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiProperty()
  payer?: string;

  @ApiProperty()
  payee: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  error: string;
}
