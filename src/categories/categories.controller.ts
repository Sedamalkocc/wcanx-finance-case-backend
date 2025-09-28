import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Req() req, @Body() body: any) {
    return this.categoriesService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Req() req) {
    return this.categoriesService.findAll(req.user.userId);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(req.user.userId, id, body);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.categoriesService.remove(req.user.userId, id);
  }
}
