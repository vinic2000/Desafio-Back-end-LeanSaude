import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from 'src/zodValidationPipe';
import { userZodSchema } from './zodSchema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(userZodSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/email/:email')
  async findUsingEmail(@Param('email') email: string) {
    try {
      return await this.userService.findUsingEmail(email);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/cpf/:cpf')
  async findUsingCpf(@Param('cpf') cpf: string) {
    try {
      return await this.userService.findUsingCpf(cpf);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
