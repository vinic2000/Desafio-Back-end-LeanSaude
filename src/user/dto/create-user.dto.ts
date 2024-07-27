export class CreateUserDto {
  full_name: string;
  cpf: string;
  email: string;
  password: string;
  type_user: 'user' | 'shopkeeper';
}
