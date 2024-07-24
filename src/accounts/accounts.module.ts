import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../prisma.service';
import { LogsService } from 'src/logs/logs.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, LogsService],
})
export class AccountsModule {}
