import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

import { PrismaService } from '../prisma.service';
import { Account, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { generate } from 'gerador-validador-cpf';
import { JwtService } from '@nestjs/jwt';

describe('AccountsController', () => {
  let controller: AccountsController;

  const userFake: User = {
    cpf: generate({ format: true }),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    id: randomUUID(),
    password: faker.internet.password(),
    type_user: 'user',
  };

  const accountFake: Account = {
    balance: 1000,
    id: randomUUID(),
    userId: userFake.id,
  };

  const userMock: User[] = [
    {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
      id: randomUUID(),
    },
  ];

  const accountMockArray: Account[] = [
    {
      id: randomUUID(),
      balance: 1000,
      userId: userMock[0].id,
    },
    {
      id: randomUUID(),
      balance: 1000,
      userId: userMock[0].id,
    },
    {
      id: randomUUID(),
      balance: 1000,
      userId: userMock[0].id,
    },
  ];

  const serviceMock = {
    create: jest.fn().mockReturnValue(accountFake),
    addBalance: jest.fn().mockReturnValue({
      balance: 2000,
      id: accountFake.id,
      userId: userFake.id,
    }),
    removeBalance: jest.fn().mockReturnValue({
      balance: 0,
      id: accountFake.id,
      userId: userFake.id,
    }),
    all: jest.fn().mockReturnValue(accountMockArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: AccountsService, useValue: serviceMock },
        PrismaService,
        JwtService,
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Route post /account', async () => {
    const result = await controller.create({
      userId: userFake.id,
    });

    expect(result).toEqual(accountFake);
  });

  it('Route Patch /add/:idConta', async () => {
    const result = await controller.addBalance(accountFake.id, {
      userId: userFake.id,
      balance: 1000,
    });

    expect(result).toEqual({
      balance: 2000,
      id: accountFake.id,
      userId: userFake.id,
    });
  });

  it('Route Patch /remove/:idConta', async () => {
    const result = await controller.removeBalance(accountFake.id, {
      userId: userFake.id,
      balance: 1000,
    });

    expect(result).toEqual({
      balance: 0,
      id: accountFake.id,
      userId: userFake.id,
    });
  });

  it('Route Get /', async () => {
    const result = await controller.all();
    expect(result).toEqual(accountMockArray);
  });
});
