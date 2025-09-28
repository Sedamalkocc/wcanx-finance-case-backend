import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto.email, dto.password);
}

@Post('register')
async register(@Body() dto: CreateUserDto) {
  return this.authService.register(dto.username, dto.email, dto.password);
}

}
