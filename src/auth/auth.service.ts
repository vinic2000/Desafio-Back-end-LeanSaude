import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Account: true,
      },
    });

    if (!user) {
      throw new HttpException(
        'E-mail or password invalid.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.password !== password) {
      throw new HttpException(
        'E-mail or password invalid.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, username: user.full_name };

    delete user.password;

    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
