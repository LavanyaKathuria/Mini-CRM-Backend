import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

interface JwtUser {
  userId: number;
  email: string;
  role: string;
}

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: { user: JwtUser }) {
    return {
      message: 'You have accessed a protected route',
      user: req.user,
    };
  }
}
