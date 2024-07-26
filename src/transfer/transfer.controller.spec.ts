import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { LogsService } from 'src/logs/logs.service';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

describe('TransferController', () => {
  let controller: TransferController;

  const transferServiceMock = {
    transfer: jest.fn().mockReturnValue({ message: 'Successful transfer' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        { provide: TransferService, useValue: transferServiceMock },
        LogsService,
        PrismaService,
        JwtService,
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Route /transfer', async () => {
    const result = await controller.transfer({
      payee: randomUUID(),
      payer: randomUUID(),
      value: 1000,
    });

    expect(result).toEqual({ message: 'Successful transfer' });
  });
});
