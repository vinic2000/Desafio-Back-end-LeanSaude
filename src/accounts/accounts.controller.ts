import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountsService.create(createAccountDto);
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  async all() {
    return await this.accountsService.all();
  }
}
