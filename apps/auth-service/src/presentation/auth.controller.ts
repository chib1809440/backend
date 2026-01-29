/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../../shared/guards/jwt.guard';
import { LoginDto } from '../application/dto/login.dto';
import { LoginUseCase } from '../application/user-cases/login.usecase';
import { LogoutUseCase } from '../application/user-cases/logout.usecase';
import { RefreshTokenUseCase } from '../application/user-cases/refresh-token.usecase';
import { RegisterUseCase } from '../application/user-cases/register.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: any) {
    return this.registerUseCase.execute(dto.email, dto.password);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto.email, dto.password);
    console.log('🚀 ~ AuthController ~ login ~ result:', result);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const token = req.cookies['refresh_token'];
    console.log('🚀 ~ AuthController ~ refresh ~ token:', token);
    return this.refreshUseCase.execute(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    await this.logoutUseCase.execute(req.user.userId);
    res.clearCookie('refresh_token');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return {
      id: req.user.userId,
      email: req.user.email,
      status: req.user.status,
    };
  }
}
