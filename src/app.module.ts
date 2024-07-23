import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UserModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
