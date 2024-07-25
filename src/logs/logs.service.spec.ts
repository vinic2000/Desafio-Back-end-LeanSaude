import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { PrismaService } from '../prisma.service';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { log } from '@prisma/client';

describe('LogsService', () => {
  let service: LogsService;

  // const userMock: User[] = [
  //   {
  //     cpf: generate({ format: true }),
  //     email: faker.internet.email(),
  //     full_name: faker.person.fullName(),
  //     password: faker.internet.password(),
  //     type_user: 'user',
  //     id: randomUUID(),
  //   },
  // ];

  // const accountMock = {
  //   id: randomUUID(),
  //   balance: 1000,
  //   userId: userMock[0].id,
  // };

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
      providers: [
        LogsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create log in database', async () => {
    const logs = {
      action: faker.string.alpha(6),
      error: faker.string.alpha(10),
      payee: faker.string.uuid(),
      payer: faker.string.uuid(),
      value: 0,
    };

    const result = await service.create(logs);

    expect(result).toEqual(logMock[0]);
  });

  it('Should be return all row log table', async () => {
    const result = await service.findAll();

    expect(result).toEqual(logMock);
  });
});
