import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { PrismaService } from '../prisma.service';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { log } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('LogsController', () => {
  let controller: LogsController;

  const logMock: log[] = [
    {
      id: randomUUID(),
      action: faker.string.alpha(6),
      error: faker.string.alpha(10),
      payee: faker.string.uuid(),
      payer: faker.string.uuid(),
      value: 0,
      date: new Date(),
    },
    {
      id: randomUUID(),
      action: faker.string.alpha(6),
      error: faker.string.alpha(10),
      payee: faker.string.uuid(),
      payer: faker.string.uuid(),
      value: 0,
      date: new Date(),
    },
  ];

  const prismaMock = {
    log: {
      create: jest.fn().mockReturnValue(logMock[0]),
      findMany: jest.fn().mockReturnValue(logMock),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        LogsService,
        { provide: PrismaService, useValue: prismaMock },
        JwtService,
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Route findAll - list all row log table', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(logMock);
  });
});
