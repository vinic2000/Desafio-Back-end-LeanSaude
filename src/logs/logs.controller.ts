import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiTags('logs')
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.logsService.findAll();
  }
}
