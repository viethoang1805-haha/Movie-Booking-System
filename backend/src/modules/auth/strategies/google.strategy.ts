// src/modules/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prisma: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });

    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // Tìm user theo email — nếu có rồi thì dùng luôn
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Tạo mới với random password vì Google đã xác thực
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          role: 'USER',
        },
      });
    }

    done(null, {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}