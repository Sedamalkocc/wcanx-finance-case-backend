import { Controller, Post, Body, Get, Param, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { username: string; email: string; password: string }) {
    return this.usersService.create(body); 
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':email')
  async getByEmail(@Param('email') email: string, @Req() req) {
    if (req.user.email !== email) {
      return { message: 'You can only access your own data' };
    }
    return this.usersService.findByEmail(email);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
