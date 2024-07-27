import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransferModule } from './transfer/transfer.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UserModule,
    AccountsModule,
    TransferModule,
    LogsModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
