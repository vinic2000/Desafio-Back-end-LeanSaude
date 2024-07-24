import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { PrismaService } from 'src/prisma.service';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const { userId } = createAccountDto;
    if (!userId) {
      throw new HttpException('UserID is invalid', HttpStatus.NOT_FOUND);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User cannot be found', HttpStatus.NOT_FOUND);
    }

    const verifyAccount = await this.prisma.account.findUnique({
      where: {
        userId: userId,
      },
    });

    if (verifyAccount) {
      await this.logsService.create({
        action: 'create',
        error: 'user already have an account',
        payee: userId,
        payer: '',
        value: null,
      });

      throw new HttpException(
        'user already have an account',
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = await this.prisma.account.create({
      data: {
        // userId: userId,
        balance: 0,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await this.logsService.create({
      action: 'create',
      error: 'Account created',
      payee: userId,
      payer: '',
      value: null,
    });

    return account;
  }

  async addBalance(idAccount: string, balance: number) {
    if (!idAccount) {
      throw new HttpException("idAccount don't send", HttpStatus.NOT_FOUND);
    }
    const account = await this.prisma.account.findUnique({
      where: {
        id: idAccount,
      },
    });

    if (!account) {
      await this.logsService.create({
        action: 'deposit',
        error: 'Account cannot be found',
        payee: '',
        payer: '',
        value: 0,
      });

      throw new HttpException('Account cannot be found', HttpStatus.NOT_FOUND);
    }

    if (balance <= 0) {
      await this.logsService.create({
        action: 'deposit',
        error: 'Balance cannot be equals or minus that 0.',
        payee: account.userId,
        payer: '',
        value: 0,
      });

      throw new HttpException(
        'Balance cannot be equals or minus that 0.',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = account.balance + balance;

    const resultUpdate = await this.prisma.account.update({
      where: {
        id: idAccount,
      },
      data: {
        balance: result,
      },
    });

    await this.logsService.create({
      action: 'deposit',
      payee: account.userId,
      value: 0,
      error: '',
    });

    return resultUpdate;
  }

  async removeBalance(idAccount: string, balance: number) {
    const account = await this.prisma.account.findUnique({
      where: {
        id: idAccount,
      },
    });

    if (!account) {
      await this.logsService.create({
        action: 'withdrawal',
        payee: '',
        value: 0,
        error: 'Account cannot be found',
      });
      throw new HttpException('Account cannot be found', HttpStatus.NOT_FOUND);
    }

    if (balance <= 0) {
      await this.logsService.create({
        action: 'withdrawal',
        payee: account.userId,
        value: 0,
        error: 'Balance cannot be equals or minus that 0.',
      });

      throw new HttpException(
        'Balance cannot be equals or minus that 0.',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = account.balance - balance;

    if (result < 0) {
      await this.logsService.create({
        action: 'withdrawal',
        payee: account.userId,
        value: 0,
        error: "User can't have negative balance.",
      });

      throw new HttpException(
        "User can't have negative balance.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const resultUpdate = await this.prisma.account.update({
      where: {
        id: idAccount,
      },
      data: {
        balance: result,
      },
    });

    await this.logsService.create({
      action: 'withdrawing',
      payee: account.userId,
      value: balance,
      error: '',
    });

    return resultUpdate;
  }
}
