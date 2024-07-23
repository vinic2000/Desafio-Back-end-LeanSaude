import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { generate } from 'gerador-validador-cpf';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

const fakeUsers: User[] = [
  {
    cpf: generate({ format: true }),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    password: faker.internet.password(),
    type_user: 'user',
    id: randomUUID(),
  },
  {
    cpf: generate({ format: true }),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    password: faker.internet.password(),
    type_user: 'user',
    id: randomUUID(),
  },
];

const prismaMock = {
  user: {
    create: jest.fn((data) => data),
    findMany: jest.fn().mockReturnValue(fakeUsers),
    findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
    findUsingCpf: jest.fn().mockResolvedValue(fakeUsers[0]),
    findUsingEmail: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn(), // O método delete não retorna nada
    findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be return all users registered', async () => {
    const result = await service.findAll();
    expect(result).toEqual(fakeUsers);
  });

  it('Should be verify if email is already registered in user table', async () => {
    const result = await service.findUsingEmail(fakeUsers[0].email);
    expect(result).toBe(fakeUsers[0]);
  });

  it('Should be verify if cpf id already registered in user table', async () => {
    const result = await service.findUsingCpf(fakeUsers[0].cpf);
    expect(result).toBe(fakeUsers[0]);
  });

  it('Should be find user sending id property', async () => {
    const result = await service.findOne(fakeUsers[0].id);
    expect(result).toBe(fakeUsers[0]);
  });

  it('Should be deleted a user', async () => {
    expect(await service.remove(fakeUsers[0].id)).toEqual({
      message: 'User deleted',
    });
  });

  it('Should be register a new User for type user', async () => {
    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const mock = {
      user: {
        create: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(null),
        findUsingCpf: jest.fn().mockResolvedValue(null),
        findUsingEmail: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    const result = await service.create(user);

    expect(result).toEqual(user);
  });

  it('Should be register a new User for type shopkeeper', async () => {
    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'shopkeeper',
    };

    const mock = {
      user: {
        create: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(null),
        findUsingCpf: jest.fn().mockResolvedValue(null),
        findUsingEmail: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    const result = await service.create(user);

    expect(result).toEqual(user);
  });

  it('Should be return error when during register cpf already exist', async () => {
    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const mock = {
      user: {
        create: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
        findUsingCpf: jest.fn().mockResolvedValue(fakeUsers[0]),
        findUsingEmail: jest.fn().mockResolvedValue(fakeUsers[0]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    try {
      await service.create(user);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'Already exist a user with that cpf',
      );
    }
  });

  it('Should be return error when during register email already exist', async () => {
    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const mock = {
      user: {
        create: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(null),
        findUsingCpf: jest.fn().mockResolvedValue(fakeUsers[0]),
        findUsingEmail: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    try {
      await service.create(user);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'Already exist a user with that e-mail',
      );
    }
  });

  it('Should be update data user', async () => {
    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'shopkeeper',
    };

    const mock = {
      user: {
        update: jest.fn().mockResolvedValue({
          id: fakeUsers[0].id,
          ...user,
        }),
        findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    const result = await service.update(fakeUsers[0].id, user);

    expect(result).toEqual({
      id: fakeUsers[0].id,
      ...user,
    });
  });

  it("Should be return execption when don't locate user using id", async () => {
    const mock = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mock }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    try {
      await service.update(fakeUsers[0].id, {
        cpf: generate({ format: true }),
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        password: faker.internet.password(),
        type_user: 'shopkeeper',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toBe(
        'User not found in database',
      );
    }
  });
});
