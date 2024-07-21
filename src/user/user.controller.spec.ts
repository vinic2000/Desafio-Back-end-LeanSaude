import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { generate } from 'gerador-validador-cpf';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import * as validate from 'uuid-validate';
import { User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;

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

  const userServiceMock = {
    create: jest.fn((data) => {
      return { id: randomUUID(), ...data };
    }),
    findOne: jest.fn().mockReturnValue(fakeUsers[0]),
    remove: jest.fn().mockReturnValue({ message: 'User deleted' }),
    findUsingEmail: jest.fn().mockReturnValue(fakeUsers[0]),
    findUsingCpf: jest.fn().mockReturnValue(fakeUsers[0]),
    findAll: jest.fn().mockReturnValue(fakeUsers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create user route', async () => {
    const user: CreateUserDto = {
      cpf: generate(),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const result = await controller.create(user);

    expect(result.cpf).toEqual(user.cpf);
    expect(result.email).toEqual(user.email);
    expect(result.full_name).toEqual(user.full_name);
    expect(result.type_user).toEqual(user.type_user);
    expect(validate(result.id)).toBeTruthy();
  });

  it('FindOne user route', async () => {
    const result = await controller.findOne(fakeUsers[0].id);
    expect(result).toEqual(fakeUsers[0]);
  });

  it('update user route', async () => {
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

    const user: CreateUserDto = {
      cpf: generate({ format: true }),
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      password: faker.internet.password(),
      type_user: 'user',
    };

    const updateMock = {
      update: jest.fn().mockReturnValue({
        id: fakeUsers[0].id,
        ...user,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: updateMock },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);

    const result = await controller.update(fakeUsers[0].id, user);
    expect(result).toEqual({ id: fakeUsers[0].id, ...user });
  });

  it('delete user route', async () => {
    const result = await controller.remove(fakeUsers[0].id);
    expect(result).toEqual({ message: 'User deleted' });
  });

  it('findUsingEmail user route', async () => {
    const result = await controller.findUsingEmail(fakeUsers[0].email);
    expect(result).toEqual(fakeUsers[0]);
  });

  it('findUsingCpf user route', async () => {
    const result = await controller.findUsingCpf(fakeUsers[0].email);
    expect(result).toEqual(fakeUsers[0]);
  });

  it('findAll user route', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(fakeUsers);
  });
});
