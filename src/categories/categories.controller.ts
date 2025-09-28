import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
async create(@Req() req, @Body() dto: CreateCategoryDto) {
  return this.categoriesService.create(req.user.userId, dto);
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
