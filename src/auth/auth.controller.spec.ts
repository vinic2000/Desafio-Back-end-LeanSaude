import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { generate } from 'gerador-validador-cpf';

describe('AuthController', () => {
  let controller: AuthController;

  const UserMock: User = {
    id: randomUUID(),
    cpf: generate({ format: true }),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    password: faker.internet.password(),
    type_user: 'user',
  };

  const authServiceMock = {
    signIn: jest.fn().mockReturnValue(UserMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Route Post : /auth', async () => {
    const login = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = controller.signIn(login);
    expect(result).toEqual(UserMock);
  });
});
