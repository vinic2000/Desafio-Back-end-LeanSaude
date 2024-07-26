import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransferModule } from './transfer/transfer.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AccountsModule, TransferModule, LogsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
