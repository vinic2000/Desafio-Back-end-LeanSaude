import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { PrismaService } from '../prisma.service';
import { LogsService } from 'src/logs/logs.service';

@Module({
  controllers: [TransferController],
  providers: [TransferService, PrismaService, LogsService],
})
export class TransferModule {}
