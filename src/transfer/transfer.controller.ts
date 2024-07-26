import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @ApiTags('transfers')
  @UseGuards(AuthGuard)
  @Post()
  async transfer(@Body() data: TransferDto) {
    const result = await this.transferService.transfer(data);
    return result;
  }
}
