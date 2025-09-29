import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
  async getAll(@Req() req) {
    const userId = req.user.userId;
    return this.categoriesService.getDefaultAndUserCategories(userId);
  }

  @Post()
async create(@Req() req, @Body() dto: CreateCategoryDto) {
  return this.categoriesService.create(req.user.userId, dto);
}
@Get('type/:type')
async findByType(@Req() req, @Param('type') type: 'income' | 'expense') {
  return this.categoriesService.findByType(req.user.userId, type);
}

@Get('stats')
async getStats(@Req() req) {
  return this.categoriesService.getStats(req.user.userId);
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
