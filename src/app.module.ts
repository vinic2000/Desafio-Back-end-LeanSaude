import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UserModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
