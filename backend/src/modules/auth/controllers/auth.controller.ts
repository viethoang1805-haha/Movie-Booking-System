// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Get, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/me
  @Get('me')
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }

  // GET /auth/google — redirect sang Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport tự redirect
  }

  // GET /auth/google/callback — Google redirect về đây
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const result = await this.authService.loginWithGoogle(req.user);

    // Redirect về frontend kèm token
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${result.token}&userId=${result.user.id}&name=${encodeURIComponent(result.user.name ?? '')}&role=${result.user.role}`,
    );
  }
}