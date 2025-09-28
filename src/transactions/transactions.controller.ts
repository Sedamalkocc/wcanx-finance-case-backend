import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Req() req, @Body() body: any) {
    return this.transactionsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Req() req) {
    return this.transactionsService.findAll(req.user.userId);
  }

  @Get('summary')
  async getSummary(
    @Req() req,
    @Query('period') period: 'weekly' | 'monthly',
  ) {
    return this.transactionsService.getSummary(req.user.userId, period);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.userId, id);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: string, @Body() body: any) {
    return this.transactionsService.update(req.user.userId, id, body);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.userId, id);
  }
}
