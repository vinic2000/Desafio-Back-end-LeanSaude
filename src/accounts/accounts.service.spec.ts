import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';

import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generate } from 'gerador-validador-cpf';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;

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

  const accountMock = {
    id: randomUUID(),
    balance: 1000,
    userId: userMock[0].id,
  };

  const prismaMock = {
    account: {
      create: jest.fn().mockReturnValue(accountMock),
      findUnique: jest.fn().mockReturnValue(accountMock),
      update: jest.fn().mockReturnValue(accountMock),
    },

    user: {
      findUnique: jest.fn().mockReturnValue(userMock[0]),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be created a new account sending a user id', async () => {
    const user: User = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      id: randomUUID(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const result = await service.create({
      userId: user.id,
    });

    expect(result).toEqual(accountMock);
  });

  it("Should be return exception when don't find user in database in create function", async () => {
    try {
      const prismaMock = {
        account: {
          create: jest.fn().mockReturnValue(accountMock),
          findUnique: jest.fn().mockReturnValue(accountMock),
          update: jest.fn().mockReturnValue(accountMock),
        },

        user: {
          findUnique: jest.fn().mockReturnValue(null),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AccountsService,
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<AccountsService>(AccountsService);

      await service.create({
        userId: randomUUID(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'User cannot be found',
      );
    }
  });

  it("Should be return exception when don't send a userid to create account ", async () => {
    try {
      await service.create({ userId: null });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe('UserID is invalid');
    }
  });

  it("Should be return exception when don't find userId in table users", async () => {
    try {
      await service.create({ userId: faker.string.uuid() });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'User cannot be found',
      );
    }
  });

  it('Should be allow add balance in account', async () => {
    const result = await service.addBalance(accountMock.id, 1000);
    expect(result).toBe(accountMock);
  });

  it("Should be return exception when don't find account in database in addBalance function", async () => {
    try {
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

      const accountMock = {
        id: randomUUID(),
        balance: 1000,
        userId: userMock[0].id,
      };

      const prismaMock = {
        account: {
          create: jest.fn().mockReturnValue(accountMock),
          findUnique: jest.fn().mockReturnValue(null),
          update: jest.fn().mockReturnValue(accountMock),
        },

        user: {
          findUnique: jest.fn().mockReturnValue(userMock[0]),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AccountsService,
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<AccountsService>(AccountsService);

      await service.addBalance(accountMock.id, 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Account cannot be found',
      );
    }
  });

  it("Should be return exception when don't send a idAccount", async () => {
    try {
      await service.addBalance(null, 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        "idAccount don't send",
      );
    }
  });

  it("Should be return exception when don't find account in database", async () => {
    try {
      await service.addBalance(faker.string.uuid(), 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Account cannot be found',
      );
    }
  });

  it('Should be return exception when balance is invalid value', async () => {
    try {
      await service.addBalance(accountMock.id, 0);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Balance cannot be equals or minus that 0.',
      );
    }

    try {
      await service.addBalance(accountMock.id, -1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Balance cannot be equals or minus that 0.',
      );
    }
  });

  it('Should be allow remove balance in account', async () => {
    const result = await service.removeBalance(accountMock.id, 1000);
    expect(result).toBe(accountMock);
  });

  it("Should be return exception when don't find user in database in removeBalance function", async () => {
    try {
      const prismaMock = {
        account: {
          create: jest.fn().mockReturnValue(accountMock),
          findUnique: jest.fn().mockReturnValue(null),
          update: jest.fn().mockReturnValue(accountMock),
        },

        user: {
          findUnique: jest.fn().mockReturnValue(userMock[0]),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AccountsService,
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<AccountsService>(AccountsService);

      await service.removeBalance(accountMock.id, 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Account cannot be found',
      );
    }
  });

  it("Should be return exception when don't send a idAccount", async () => {
    try {
      await service.removeBalance(null, 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        "idAccount don't send",
      );
    }
  });

  it("Should be return exception when don't find account in database", async () => {
    try {
      await service.removeBalance(faker.string.uuid(), 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Account cannot be found',
      );
    }
  });

  it('Should be return exception when balance is invalid value', async () => {
    try {
      await service.removeBalance(accountMock.id, 0);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Balance cannot be equals or minus that 0.',
      );
    }

    try {
      await service.removeBalance(accountMock.id, -1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'Balance cannot be equals or minus that 0.',
      );
    }
  });

  it('Should be return exception when balance account to be less than 0', async () => {
    try {
      await service.removeBalance(accountMock.id, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        "User can't have negative balance.",
      );
    }
  });
});
