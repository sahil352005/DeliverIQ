import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, password: passwordHash },
      select: { id: true, email: true, name: true },
    });
    const token = await this.signToken(user.id, user.email);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.signToken(user.id, user.email);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return this.jwt.signAsync(payload, { secret, expiresIn });
  }
}


