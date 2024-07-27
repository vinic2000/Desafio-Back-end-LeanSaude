import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findUsingCpf(createUserDto.cpf)) {
      throw new HttpException(
        'Already exist a user with that cpf',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.findUsingEmail(createUserDto.email)) {
      throw new HttpException(
        'Already exist a user with that e-mail',
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.prisma.user.create({
      data: createUserDto,
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });

    const users = await this.prisma.user.findMany();
    await this.cacheManager.set('users', users);

    return data;
  }

  async findAll() {
    const result = await this.prisma.user.findMany({
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });

    const cacheUsers = await this.cacheManager.get('users');

    if (cacheUsers) {
      return cacheUsers;
    }

    await this.cacheManager.set('users', result);

    return result;
  }

  async findUsingEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });
  }

  async findUsingCpf(cpf: string) {
    return await this.prisma.user.findUnique({
      where: {
        cpf: cpf,
      },
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!(await this.findOne(id))) {
      throw new HttpException(
        'User not found in database',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });

    const users = await this.prisma.user.findMany();
    await this.cacheManager.set('users', users);

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException('User cannot be find', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    const users = this.prisma.user.findMany();
    await this.cacheManager.set('users', users);

    return { message: 'User deleted' };
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });
  }
}
