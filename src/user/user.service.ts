import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    return data;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        cpf: true,
        email: true,
        full_name: true,
        id: true,
        type_user: true,
      },
    });
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

    return await this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

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
