import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountsService.create(createAccountDto);
  }

  @Patch('/add/:idConta')
  async addBalance(
    @Param('idConta') idConta: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountsService.addBalance(
      idConta,
      updateAccountDto.balance,
    );
  }

  @Patch('/remove/:idConta')
  async removeBalance(
    @Param('idConta') idConta: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountsService.removeBalance(
      idConta,
      updateAccountDto.balance,
    );
  }
}
