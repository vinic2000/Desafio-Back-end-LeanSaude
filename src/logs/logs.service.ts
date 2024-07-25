import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async create(createLogDto: CreateLogDto) {
    const result = await this.prisma.log.create({
      data: {
        action: createLogDto.action,
        payee: createLogDto.payee,
        payer: createLogDto.payer || '',
        value: createLogDto.value,
        error: createLogDto.error,
      },
    });

    return result;
  }

  async findAll() {
    return await this.prisma.log.findMany();
  }
}
