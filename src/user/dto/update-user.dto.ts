import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  full_name: string;
  cpf: string;
  email: string;
  password: string;
  type_user: 'user' | 'shopkeeper';
}
