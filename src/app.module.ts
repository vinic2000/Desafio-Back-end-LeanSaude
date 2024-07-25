import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransferModule } from './transfer/transfer.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [UserModule, AccountsModule, TransferModule, LogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
