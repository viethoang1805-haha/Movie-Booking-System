
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email đã được sử dụng');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return {
      token: this.generateToken(user),
      user: this.serializeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    return {
      token: this.generateToken(user),
      user: this.serializeUser(user),
    };
  }

  // Dùng sau khi Google OAuth callback
  async loginWithGoogle(googleUser: { id: string; email: string; name: string | null; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(googleUser.id) },
    });

    if (!user) throw new UnauthorizedException('User không tồn tại');

    return {
      token: this.generateToken(user),
      user: this.serializeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) throw new UnauthorizedException('User không tồn tại');

    return { ...user, id: user.id.toString() };
  }

  private generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  private serializeUser(user: any) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}