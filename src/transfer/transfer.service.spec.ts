import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { LogsService } from 'src/logs/logs.service';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { generate } from 'gerador-validador-cpf';
import { faker } from '@faker-js/faker';
describe('TransferService', () => {
  let service: TransferService;

  const prismaMock = {
    Account: {
      findUnique: jest.fn().mockReturnValue(null),
    },
  };

  const logsServicemock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        { provide: LogsService, useValue: logsServicemock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should be return error when don't send a payee", async () => {
    try {
      await service.transfer({
        payee: null,
        payer: randomUUID(),
        value: 0,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe("Payee don't send");
    }
  });

  it("should be return error when don't send a Payer", async () => {
    try {
      await service.transfer({
        payee: randomUUID(),
        payer: null,
        value: 0,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe("Payer don't send");
    }
  });

  it("should be return error when don't send a value", async () => {
    try {
      await service.transfer({
        payee: randomUUID(),
        payer: randomUUID(),
        value: 0,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe("Value don't send");
    }
  });

  it("should be return error when don't find payee in database", async () => {
    try {
      const usersMock: User[] = [
        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'user',
        },
      ];

      const accountMock: Account[] = [
        {
          balance: 0,
          id: randomUUID(),
          userId: usersMock[0].id,
        },
      ];

      const prismaMock = {
        account: {
          findUnique: jest.fn().mockReturnValue(null),
        },
      };

      const logsServicemock = {
        create: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TransferService,
          { provide: LogsService, useValue: logsServicemock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<TransferService>(TransferService);

      await service.transfer({
        payee: randomUUID(),
        payer: randomUUID(),
        value: 1000,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        "Payee account don't find",
      );
    }
  });

  it('should be return error when user is Shopkeeper type', async () => {
    try {
      const usersMock: User[] = [
        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'shopkeeper',
        },
      ];

      const accountMock: Account[] = [
        {
          balance: 0,
          id: randomUUID(),
          userId: usersMock[0].id,
        },
      ];

      const prismaMock = {
        account: {
          findUnique: jest.fn().mockReturnValue(accountMock[0]),
        },
        user: {
          findUnique: jest.fn().mockReturnValue(usersMock[0]),
        },
      };

      const logsServicemock = {
        create: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TransferService,
          { provide: LogsService, useValue: logsServicemock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<TransferService>(TransferService);

      await service.transfer({
        payee: randomUUID(),
        payer: randomUUID(),
        value: 1000,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'Shopkeeper cannot do a transfer only receive!',
      );
    }
  });

  it('should be return error when user is Shopkeeper type', async () => {
    try {
      const usersMock: User[] = [
        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'shopkeeper',
        },

        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'user',
        },
      ];

      const accountMock: Account[] = [
        {
          balance: 0,
          id: randomUUID(),
          userId: usersMock[0].id,
        },
      ];

      const prismaMock = {
        account: {
          findUnique: jest.fn().mockImplementation((data) => {
            const { userId } = data.where;
            return usersMock.find((u) => u.id === userId);
          }),
        },
        user: {
          findUnique: jest.fn().mockReturnValue(usersMock[0]),
        },
      };

      const logsServicemock = {
        create: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TransferService,
          { provide: LogsService, useValue: logsServicemock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<TransferService>(TransferService);

      await service.transfer({
        payee: usersMock[1].id,
        payer: usersMock[0].id,
        value: 1000,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'Shopkeeper cannot do a transfer only receive!',
      );
    }
  });

  it("should be return error when payer don't have balance enough", async () => {
    try {
      const usersMock: User[] = [
        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'shopkeeper',
        },

        {
          id: randomUUID(),
          cpf: generate({ format: true }),
          email: faker.internet.email(),
          full_name: faker.person.fullName(),
          password: faker.internet.password(),
          type_user: 'user',
        },
      ];

      const accountMock: Account[] = [
        {
          balance: 0,
          id: randomUUID(),
          userId: usersMock[0].id,
        },

        {
          balance: 10,
          id: randomUUID(),
          userId: usersMock[1].id,
        },
      ];

      const prismaMock = {
        account: {
          findUnique: jest.fn().mockImplementation((data) => {
            const { userId } = data.where;
            const account = accountMock.find((a) => a.userId === userId);
            return account;
          }),
        },
        user: {
          findUnique: jest.fn().mockReturnValue(usersMock[1]),
        },
      };

      const logsServicemock = {
        create: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TransferService,
          { provide: LogsService, useValue: logsServicemock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      }).compile();

      service = module.get<TransferService>(TransferService);

      await service.transfer({
        payee: usersMock[0].id,
        payer: usersMock[1].id,
        value: 1000,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'Payer: Negative balance is not allowed.',
      );
    }
  });

  it('Should be do transfer', async () => {
    const usersMock: User[] = [
      {
        id: randomUUID(),
        cpf: generate({ format: true }),
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        password: faker.internet.password(),
        type_user: 'shopkeeper',
      },

      {
        id: randomUUID(),
        cpf: generate({ format: true }),
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        password: faker.internet.password(),
        type_user: 'user',
      },
    ];

    const accountMock: Account[] = [
      {
        balance: 0,
        id: randomUUID(),
        userId: usersMock[0].id,
      },

      {
        balance: 2000,
        id: randomUUID(),
        userId: usersMock[1].id,
      },
    ];

    const prismaMock = {
      account: {
        findUnique: jest.fn().mockImplementation((data) => {
          const { userId } = data.where;
          const account = accountMock.find((a) => a.userId === userId);
          return account;
        }),
      },
      user: {
        findUnique: jest.fn().mockReturnValue(usersMock[1]),
      },

      $transaction: jest
        .fn()
        .mockReturnValue({ message: 'Successful transfer' }),
    };

    const logsServicemock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        { provide: LogsService, useValue: logsServicemock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);

    const result = await service.transfer({
      payer: usersMock[1].id,
      payee: usersMock[0].id,
      value: 1000,
    });

    expect(result).toEqual({ message: 'Successful transfer' });
  });
});
