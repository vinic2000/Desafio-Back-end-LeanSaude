import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransferDto } from './dto/transfer.dto';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class TransferService {
  constructor(
    private prisma: PrismaService,
    private LogsService: LogsService,
  ) {}
  async transfer(dataTransfer: TransferDto) {
    return await this.prisma.$transaction(async (tx) => {
      const { payee, payer, value } = dataTransfer;

      if (!payee) {
        throw new HttpException("Payee don't send", HttpStatus.BAD_REQUEST);
      }

      if (!payer) {
        throw new HttpException("Payer don't send", HttpStatus.BAD_REQUEST);
      }

      if (!value) {
        throw new HttpException("Value don't send", HttpStatus.BAD_REQUEST);
      }

      let payeeAccount = await tx.account.findUnique({
        where: {
          userId: payee,
        },
      });

      if (!payeeAccount) {
        await this.LogsService.create({
          payee: '',
          payer: '',
          value: value,
          action: 'transfer',
          error: "Payee account don't find",
        });

        throw new HttpException(
          "Payee account don't find",
          HttpStatus.NOT_FOUND,
        );
      }

      let payerAccount = await tx.account.findUnique({
        where: {
          userId: payer,
        },
      });

      if (!payerAccount) {
        await this.LogsService.create({
          payee: '',
          payer: '',
          value: value,
          action: 'transfer',
          error: "Payer account don't find",
        });

        throw new HttpException(
          "Payer account don't find",
          HttpStatus.NOT_FOUND,
        );
      }

      const { type_user } = await tx.user.findUnique({
        where: {
          id: payer,
        },
      });

      if (type_user === 'shopkeeper') {
        await this.LogsService.create({
          payee: '',
          payer: '',
          value: value,
          action: 'transfer',
          error: 'Shopkeeper cannot do a transfer only receive!',
        });

        throw new HttpException(
          'Shopkeeper cannot do a transfer only receive!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payerAccount.balance - value < 0) {
        await this.LogsService.create({
          payee: '',
          payer: '',
          value: value,
          action: 'transfer',
          error: 'Payer: Negative balance is not allowed.',
        });

        throw new HttpException(
          'Payer: Negative balance is not allowed.',
          HttpStatus.BAD_REQUEST,
        );
      }

      payerAccount = await tx.account.update({
        where: {
          id: payerAccount.id,
        },
        data: {
          balance: payerAccount.balance - value,
        },
      });

      payeeAccount = await tx.account.update({
        where: {
          id: payeeAccount.id,
        },
        data: {
          balance: payeeAccount.balance + value,
        },
      });

      await this.LogsService.create({
        payee: payeeAccount.id,
        payer: payerAccount.id,
        value: value,
        action: 'transfer',
        error: '',
      });

      return {
        // payer: payerAccount,
        // payee: payeeAccount,
        message: 'Successful transfer',
      };
    });
  }
}
