import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { generate } from 'gerador-validador-cpf';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const userFake: User = {
    id: randomUUID(),
    cpf: generate({ format: true }),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    password: faker.internet.password(),
    type_user: 'user',
  };

  const token = faker.string.alphanumeric(20);

  const prismaMock = {
    user: {
      findUnique: jest.fn().mockReturnValue(userFake),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue(token),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be be authenticated', async () => {
    const login = {
      email: userFake.email,
      password: userFake.password,
    };
    const result = await service.signIn(login.email, login.password);

    expect(result).toEqual({
      ...userFake,
      access_token: token,
    });
  });

  it("Should be return exception when don't find user in database", async () => {
    const login = {
      email: userFake.email,
      password: userFake.password,
    };

    const prismaMock = {
      user: {
        findUnique: jest.fn().mockReturnValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    try {
      await service.signIn(login.email, login.password);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.UNAUTHORIZED,
      );
      expect((error as HttpException).getResponse()).toBe(
        'E-mail or password invalid.',
      );
    }
  });

  it('Should be return exception when password is invalid', async () => {
    const login = {
      email: userFake.email,
      password: faker.internet.password(),
    };

    const prismaMock = {
      user: {
        findUnique: jest.fn().mockReturnValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    try {
      await service.signIn(login.email, login.password);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.UNAUTHORIZED,
      );
      expect((error as HttpException).getResponse()).toBe(
        'E-mail or password invalid.',
      );
    }
  });
});
