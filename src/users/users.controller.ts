import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post()
async create(@Body() body: { username: string; email: string; password: string }) {
  return this.usersService.create(body); 
}


  @Get(':email')
  @UseGuards(AuthGuard('jwt'))
  async getByEmail(@Param('email') email: string, @Req() req) {
    if (req.user.email !== email) {
      return { message: 'You can only access your own data' };
    }
    return this.usersService.findByEmail(email);
  }
}
