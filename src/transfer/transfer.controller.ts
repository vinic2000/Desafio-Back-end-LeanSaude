import { Controller, Post, Body } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(@Body() data: TransferDto) {
    const result = await this.transferService.transfer(data);
    return result;
  }
}
