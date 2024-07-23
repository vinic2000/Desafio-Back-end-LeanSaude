import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

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

    const account = await this.prisma.account.create({
      data: {
        userId: user.id,
        balance: 0,
      },
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
      throw new HttpException('Account cannot be found', HttpStatus.NOT_FOUND);
    }

    if (balance <= 0) {
      throw new HttpException(
        'Balance cannot be equals or minus that 0.',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = account.balance + balance;

    return await this.prisma.account.update({
      where: {
        id: idAccount,
      },
      data: {
        balance: result,
      },
    });
  }

  async removeBalance(idAccount: string, balance: number) {
    const account = await this.prisma.account.findUnique({
      where: {
        id: idAccount,
      },
    });

    if (!account) {
      throw new HttpException('Account cannot be found', HttpStatus.NOT_FOUND);
    }

    if (balance <= 0) {
      throw new HttpException(
        'Balance cannot be equals or minus that 0.',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = account.balance - balance;

    if (result < 0) {
      throw new HttpException(
        "User can't have negative balance.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.account.update({
      where: {
        id: idAccount,
      },
      data: {
        balance: result,
      },
    });
  }
}
